"use strict";

const STORAGE_KEY = "pollichat-v1";
const GEN = "https://gen.pollinations.ai";

const TEXT_ENDPOINTS = [
  `${GEN}/v1/chat/completions`,
  "https://text.pollinations.ai/openai",
];

const CONTEXT_LIMIT = 30;

const FALLBACK_MODELS = {
  text: [
    "openai/gpt-5.4-nano",
    "openai/gpt-5-nano",
    "openai/gpt-oss-20b",
    "google/gemini-2.5-flash-lite",
    "mistralai/mistral-small-3.2",
    "deepseek/deepseek-v4-flash",
    "meta/llama-3.3-70b-instruct",
    "amazon/nova-micro-v1",
    "google/gemma-4-26b-a4b-it",
  ],
  image: [
    "tongyi-mai/z-image-turbo",
    "black-forest-labs/flux.1-schnell",
    "lykon/dreamshaper-8-lcm",
    "black-forest-labs/flux.2-klein-4b",
    "prunaai/p-image",
  ],
};

const SIZES = [
  ["1024x1024", "Square"],
  ["768x1024", "Portrait"],
  ["1024x768", "Landscape"],
];

const SUGGESTIONS = {
  chat: [
    "Draft a project proposal",
    "Summarize my meeting notes",
    "Write a Python script",
    "Prioritize my tasks",
  ],
  image: [
    "A sleek modern dashboard interface",
    "Minimalist workspace setup",
    "Clean vector icon set",
    "Abstract geometric background",
  ],
};

/* ---- Icons (inline SVG, stroke-based) ---------------------------------- */

const ICONS = {
  plus: '<path d="M5 12h14M12 5v14"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  arrowUp: '<path d="M12 19V5M5 12l7-7 7 7"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" stroke="none"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  refresh:
    '<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',
  download:
    '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  trash:
    '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  sliders:
    '<path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4"/>',
};

const icon = (name, size = 16) =>
  `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;

function hydrateIcons() {
  document.querySelectorAll("[data-icon]").forEach((node) => {
    node.innerHTML = icon(node.dataset.icon, node.dataset.size || 16);
  });
}

/* ---- State ------------------------------------------------------------- */

const defaults = () => ({
  apiKey: "",
  systemPrompt: "",
  freeOnly: true,
  mode: "chat",
  textModel: FALLBACK_MODELS.text[0],
  imageModel: FALLBACK_MODELS.image[0],
  imageSize: "1024x1024",
  activeChatId: null,
  chats: [],
});

let state = loadState();
const catalog = {
  text: null,
  image: null,
};

let busy = null;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

    return {
      ...defaults(),
      ...saved,
    };
  } catch {
    return defaults();
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn("Could not save:", err);
  }
}

const $ = (id) => document.getElementById(id);

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

function el(tag, className = "", text = "") {
  const node = document.createElement(tag);

  if (className) {
    node.className = className;
  }

  if (text) {
    node.textContent = text;
  }

  return node;
}

const activeChat = () =>
  state.chats.find((chat) => chat.id === state.activeChatId);

const messagesEl = $("messages");
const input = $("input");
const composer = $("composer");
const composerWrap = $("composerWrap");
const mainEl = document.querySelector(".main");
const sendBtn = $("sendBtn");
const modelSelect = $("modelSelect");
const chatList = $("chatList");
const sidebar = $("sidebar");
const scrim = $("scrim");
const settingsDialog = $("settingsDialog");

/* ---- Markdown (small, safe subset) ------------------------------------- */

const esc = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// `s` must already be escaped.
function inline(s) {
  return s
    .replace(/`([^`\n]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>")
    .replace(
      /\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    );
}

function textBlocks(text) {
  const out = [];
  let para = [];
  let list = null;

  const flushPara = () => {
    if (para.length) {
      out.push(`<p>${para.join("<br>")}</p>`);
      para = [];
    }
  };

  const flushList = () => {
    if (list) {
      out.push(
        `<${list.tag}>${list.items.map((item) => `<li>${item}</li>`).join("")}</${list.tag}>`,
      );
      list = null;
    }
  };

  for (const raw of text.split("\n")) {
    const line = esc(raw);
    let m;

    if (!line.trim()) {
      flushPara();
      flushList();
      continue;
    }

    if ((m = line.match(/^#{1,4}\s+(.+)$/))) {
      flushPara();
      flushList();
      out.push(`<h4>${inline(m[1])}</h4>`);
      continue;
    }

    if (/^\s*(-{3,}|\*{3,})\s*$/.test(line)) {
      flushPara();
      flushList();
      out.push("<hr>");
      continue;
    }

    if ((m = line.match(/^\s*[-*•]\s+(.+)$/))) {
      flushPara();

      if (!list || list.tag !== "ul") {
        flushList();
        list = { tag: "ul", items: [] };
      }

      list.items.push(inline(m[1]));
      continue;
    }

    if ((m = line.match(/^\s*\d+[.)]\s+(.+)$/))) {
      flushPara();

      if (!list || list.tag !== "ol") {
        flushList();
        list = { tag: "ol", items: [] };
      }

      list.items.push(inline(m[1]));
      continue;
    }

    flushList();
    para.push(inline(line));
  }

  flushPara();
  flushList();

  return out.join("");
}

function codeBlock(part) {
  const nl = part.indexOf("\n");
  let body = part;

  // Drop a leading language tag (```python) but keep the first line when it is real code.
  if (nl >= 0 && /^[\w+#.-]{0,20}$/.test(part.slice(0, nl).trim())) {
    body = part.slice(nl + 1);
  }

  return `<pre><code>${esc(body.replace(/\n$/, ""))}</code></pre>`;
}

function md(text) {
  return text
    .split("```")
    .map((part, i) => (i % 2 === 1 ? codeBlock(part) : textBlocks(part)))
    .join("");
}

/* ---- Image storage (IndexedDB with in-memory fallback) ----------------- */

const memImages = new Map();
const urlCache = new Map();
let dbPromise;

function openDb() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open("pollichat", 1);

      req.onupgradeneeded = () => {
        req.result.createObjectStore("images");
      };

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  return dbPromise;
}

async function idbRun(mode, fn) {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction("images", mode);
    const req = fn(tx.objectStore("images"));

    tx.oncomplete = () => resolve(req.result);

    tx.onerror = tx.onabort = () => reject(tx.error);
  });
}

async function saveImage(id, blob) {
  memImages.set(id, blob);

  try {
    await idbRun("readwrite", (store) => store.put(blob, id));
  } catch (err) {
    console.warn("Image kept in memory only:", err);
  }
}

async function getImageURL(id) {
  if (urlCache.has(id)) {
    return urlCache.get(id);
  }

  let blob = memImages.get(id);

  if (!blob) {
    try {
      blob = await idbRun("readonly", (store) => store.get(id));
    } catch {}
  }

  if (!blob) {
    return null;
  }

  const url = URL.createObjectURL(blob);

  urlCache.set(id, url);

  return url;
}

function deleteImage(id) {
  memImages.delete(id);

  const url = urlCache.get(id);

  if (url) {
    URL.revokeObjectURL(url);
    urlCache.delete(id);
  }

  idbRun("readwrite", (store) => store.delete(id)).catch(() => {});
}

/* ---- Network ----------------------------------------------------------- */

function headers() {
  const h = {
    "Content-Type": "application/json",
  };

  if (state.apiKey) {
    h.Authorization = `Bearer ${state.apiKey}`;
  }

  return h;
}

async function httpError(res) {
  let detail = "";

  try {
    const j = await res.clone().json();

    detail =
      j?.error?.message ||
      (typeof j?.error === "string" ? j.error : "") ||
      j?.message ||
      "";
  } catch {}

  const friendly = {
    401: "API key missing or invalid. Add one in Settings.",
    402: "This model needs Pollen credits your account doesn't have. Pick a free model.",
    403: "Your key isn't allowed to use this model. Pick another one.",
    429: "Rate limit reached. Wait a moment and try again.",
  }[res.status];

  const message =
    (friendly || `Request failed (${res.status}).`) +
    (detail ? ` ${String(detail).slice(0, 200)}` : "");

  const err = new Error(message);

  err.fatal = [401, 402, 403].includes(res.status);

  return err;
}

async function readSSE(res, onDelta) {
  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";

  for (;;) {
    const { value, done } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");

    buffer = lines.pop();

    for (const line of lines) {
      const s = line.trim();

      if (!s.startsWith("data:")) {
        continue;
      }

      const payload = s.slice(5).trim();

      if (payload === "[DONE]") {
        return;
      }

      try {
        const delta = JSON.parse(payload).choices?.[0]?.delta?.content;

        if (delta) {
          onDelta(delta);
        }
      } catch {}
    }
  }
}

async function streamChat({ messages, model, signal, onDelta }) {
  let received = false;

  const emit = (delta) => {
    received = true;
    onDelta(delta);
  };

  let firstError;

  for (const url of TEXT_ENDPOINTS) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: headers(),
        signal,
        body: JSON.stringify({
          model,
          messages,
          stream: true,
        }),
      });

      if (!res.ok) {
        throw await httpError(res);
      }

      const type = res.headers.get("content-type") || "";

      if (type.includes("text/event-stream") && res.body) {
        await readSSE(res, emit);
      } else {
        const data = await res.json();

        const text =
          data?.choices?.[0]?.message?.content ||
          data?.choices?.[0]?.text ||
          "";

        if (text) {
          emit(text);
        }
      }

      return;
    } catch (err) {
      if (err.name === "AbortError" || err.fatal || received) {
        throw err;
      }

      firstError ||= err;
    }
  }

  throw firstError;
}

function b64ToBlob(b64) {
  const bin = atob(b64);

  const bytes = new Uint8Array(bin.length);

  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }

  const type = b64.startsWith("/9j/")
    ? "image/jpeg"
    : b64.startsWith("UklG")
      ? "image/webp"
      : "image/png";

  return new Blob([bytes], { type });
}

async function generateImage(prompt, signal) {
  const res = await fetch(`${GEN}/v1/images/generations`, {
    method: "POST",
    headers: headers(),
    signal,
    body: JSON.stringify({
      model: state.imageModel,
      prompt,
      size: state.imageSize,
      n: 1,
      response_format: "b64_json",
    }),
  });

  if (!res.ok) {
    throw await httpError(res);
  }

  const item = (await res.json())?.data?.[0];

  if (item?.b64_json) {
    return b64ToBlob(item.b64_json);
  }

  if (item?.url) {
    const img = await fetch(item.url, { signal });

    if (!img.ok) {
      throw new Error("Couldn't download the generated image.");
    }

    return img.blob();
  }

  throw new Error("The server didn't return an image.");
}

/* ---- Model catalog ----------------------------------------------------- */

function numbersIn(v) {
  if (typeof v === "number") {
    return [v];
  }

  if (typeof v === "string" && v.trim() !== "" && !isNaN(v)) {
    return [Number(v)];
  }

  if (v && typeof v === "object") {
    return Object.values(v).flatMap(numbersIn);
  }

  return [];
}

function isFree(m) {
  if (m.paid_only === true) {
    return false;
  }

  if (m.free === true || m.is_free === true) {
    return true;
  }

  const tier = String(m.tier || "").toLowerCase();

  if (tier === "anonymous" || tier === "free") {
    return true;
  }

  const prices = numbersIn(m.pricing);

  return prices.length > 0 && prices.every((n) => n === 0);
}

async function fetchModels(url, kind) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Model list returned ${res.status}.`);
  }

  const data = await res.json();

  const list = Array.isArray(data) ? data : data.data || data.models || [];

  const seen = new Set();
  const out = [];

  for (const m of list) {
    const obj = typeof m === "object" && m !== null;

    const id = obj ? m.id || m.name : m;

    if (!id || seen.has(id)) {
      continue;
    }

    const mods =
      obj && Array.isArray(m.output_modalities) ? m.output_modalities : null;

    if (mods) {
      if (kind === "text" && !mods.includes("text")) {
        continue;
      }

      if (
        kind === "image" &&
        (!mods.includes("image") || mods.includes("video"))
      ) {
        continue;
      }
    } else if (kind === "image" && obj && m.video_capabilities) {
      continue;
    }

    seen.add(id);

    out.push({
      id,
      free: obj && isFree(m),
    });
  }

  return out;
}

async function loadCatalog() {
  const [text, image] = await Promise.allSettled([
    fetchModels(`${GEN}/text/models`, "text"),
    fetchModels(`${GEN}/image/models`, "image"),
  ]);

  catalog.text =
    text.status === "fulfilled" && text.value.length ? text.value : null;

  catalog.image =
    image.status === "fulfilled" && image.value.length ? image.value : null;

  renderModelSelect();
}

function visibleModels(kind) {
  const fallback = FALLBACK_MODELS[kind].map((id) => ({
    id,
    free: false,
  }));

  const all = catalog[kind];

  if (!all) {
    return fallback;
  }

  if (!state.freeOnly) {
    return all;
  }

  const free = all.filter((model) => model.free);

  return free.length ? free : fallback;
}

function modelStatusText() {
  if (!catalog.text && !catalog.image) {
    return "Couldn't load the live model list. Showing lightweight fallback models.";
  }

  if (!state.freeOnly) {
    return "Showing every model. Some may use Pollen credits.";
  }

  const flagged = [...(catalog.text || []), ...(catalog.image || [])].some(
    (model) => model.free,
  );

  if (flagged) {
    const t = (catalog.text || []).filter((model) => model.free).length;

    const i = (catalog.image || []).filter((model) => model.free).length;

    return `Showing ${t} free text and ${i} free image models.`;
  }

  return "The API didn't identify free models, so lightweight fallback models are shown.";
}

/* ---- Rendering --------------------------------------------------------- */

function renderModelSelect() {
  const kind = state.mode === "image" ? "image" : "text";

  const key = `${kind}Model`;

  const ids = visibleModels(kind).map((model) => model.id);

  if (!ids.includes(state[key])) {
    state[key] = ids[0];

    save();
  }

  // Show the short model name; fall back to the full id when two names collide.
  const tails = ids.map((id) => id.split("/").pop());

  const counts = {};

  tails.forEach((tail) => {
    counts[tail] = (counts[tail] || 0) + 1;
  });

  modelSelect.replaceChildren(
    ...ids.map((id, i) => {
      const option = el("option", "", counts[tails[i]] > 1 ? id : tails[i]);

      option.value = id;

      option.title = id;

      return option;
    }),
  );

  modelSelect.value = state[key];
}

function renderHeader() {
  document.querySelectorAll("#modeTabs button").forEach((button) => {
    const active = button.dataset.mode === state.mode;

    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  $("imageOptions").hidden = state.mode !== "image";

  input.placeholder =
    state.mode === "image" ? "Describe an image..." : "Message PolliChat...";

  renderModelSelect();
}

function renderSizes() {
  $("sizeOptions").replaceChildren(
    ...SIZES.map(([value, label]) => {
      const [w, h] = value.split("x").map(Number);

      const button = el("button", "opt");

      button.type = "button";

      button.classList.toggle("is-active", state.imageSize === value);
      button.setAttribute("aria-pressed", String(state.imageSize === value));

      const glyph = el("span", "size-glyph");

      glyph.style.aspectRatio = `${w} / ${h}`;

      button.append(glyph, document.createTextNode(label));

      button.onclick = () => {
        state.imageSize = value;

        save();
        renderSizes();
      };

      return button;
    }),
  );
}

function dayGroup(ts) {
  const start = new Date();

  start.setHours(0, 0, 0, 0);

  const day = 86400000;
  const t0 = start.getTime();

  if (ts >= t0) return "Today";
  if (ts >= t0 - day) return "Yesterday";
  if (ts >= t0 - 7 * day) return "Previous 7 days";

  return "Older";
}

function renderSidebar() {
  chatList.replaceChildren();

  let lastGroup = "";

  [...state.chats]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .forEach((chat) => {
      const group = dayGroup(chat.updatedAt);

      if (group !== lastGroup) {
        chatList.append(el("div", "chat-group-label", group));

        lastGroup = group;
      }

      const active = chat.id === state.activeChatId;

      const row = el("div", "chat-row" + (active ? " is-active" : ""));

      const open = el("button", "chat-open", chat.title);

      open.type = "button";

      if (active) {
        open.setAttribute("aria-current", "true");
      }

      open.onclick = () => {
        state.activeChatId = chat.id;

        save();
        renderAll();
        setSidebar(false);
      };

      const del = el("button", "chat-del");

      del.type = "button";

      del.innerHTML = icon("trash", 15);

      del.setAttribute("aria-label", `Delete "${chat.title}"`);

      del.onclick = () => deleteChat(chat.id);

      row.append(open, del);

      chatList.append(row);
    });
}

function actionBtn(iconName, label, onClick) {
  const button = el("button", "icon-btn icon-btn-sm");

  button.type = "button";

  button.title = label;

  button.setAttribute("aria-label", label);

  button.innerHTML = icon(iconName, 15);

  button.onclick = () => onClick(button);

  return button;
}

function actionsRow(...items) {
  const row = el("div", "msg-actions");

  row.append(...items.filter(Boolean));

  return row;
}

function typingDots() {
  const wrap = el("div", "dots");

  wrap.setAttribute("role", "status");

  wrap.setAttribute("aria-label", "Typing");

  for (let i = 0; i < 3; i++) {
    const dot = el("span");

    dot.style.animationDelay = `${i * 0.18}s`;

    wrap.append(dot);
  }

  return wrap;
}

function renderMessage(msg, isLast) {
  if (msg.role === "user") {
    const row = el("div", "msg msg-user");

    row.append(el("div", "bubble", msg.content));

    return row;
  }

  if (msg.error) {
    const box = el("div", "error-box");

    box.append(el("p", "", msg.content));

    const retryBtn = el("button", "retry");

    retryBtn.type = "button";

    retryBtn.innerHTML = `${icon("refresh", 14)}<span>Try again</span>`;

    retryBtn.onclick = () => retry(msg);

    box.append(retryBtn);

    return box;
  }

  const wrap = el("div", "msg msg-assistant" + (isLast ? " is-last" : ""));

  if (msg.kind === "image") {
    const [w, h] = (msg.size || "1024x1024").split("x");

    const link = el("a", "img-card");

    link.target = "_blank";

    link.rel = "noopener";

    link.style.aspectRatio = `${w} / ${h}`;

    const img = el("img");

    img.alt = msg.prompt || "Generated image";

    link.append(img);

    const download = el("a", "icon-btn icon-btn-sm");

    download.innerHTML = icon("download", 15);

    download.title = "Download";

    download.setAttribute("aria-label", "Download");

    const ext = (msg.mime || "image/png").split("/")[1] || "png";

    download.download = `pollichat-${msg.id.slice(0, 8)}.${ext}`;

    getImageURL(msg.imageId).then((url) => {
      if (url) {
        img.src = url;

        link.href = url;

        download.href = url;
      } else {
        link.replaceChildren(
          el(
            "div",
            "img-missing",
            "This image is no longer stored in this browser.",
          ),
        );
      }
    });

    wrap.append(
      link,
      actionsRow(
        download,
        isLast && !busy
          ? actionBtn("refresh", "Generate again", () => regenerate(msg))
          : null,
      ),
    );

    return wrap;
  }

  const body = el("div", "prose");

  const streaming = busy && busy.streamId === msg.id;

  if (streaming) {
    body.dataset.stream = msg.id;
  }

  if (streaming && !msg.content) {
    body.append(typingDots());
  } else {
    body.innerHTML = md(msg.content);
  }

  wrap.append(body);

  if (!streaming) {
    wrap.append(
      actionsRow(
        actionBtn("copy", "Copy", async (button) => {
          try {
            await navigator.clipboard.writeText(msg.content);

            button.innerHTML = icon("check", 15);

            setTimeout(() => {
              button.innerHTML = icon("copy", 15);
            }, 1200);
          } catch {}
        }),

        isLast && !busy
          ? actionBtn("refresh", "Regenerate", () => regenerate(msg))
          : null,
      ),
    );
  }

  return wrap;
}

const PIXEL_MARK =
  '<svg class="empty-logo" viewBox="0 0 4 5" shape-rendering="crispEdges" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M0 0h4v3H1v2H0ZM1 1h2v1H1Z"/></svg>';

function renderEmpty() {
  const wrap = el("div", "empty");

  const inner = el("div", "empty-inner");

  inner.insertAdjacentHTML("beforeend", PIXEL_MARK);

  inner.append(
    el(
      "h1",
      "",
      state.mode === "image"
        ? "Generate an image"
        : "How can I help you today?",
    ),
  );

  // The composer sits directly under the greeting on the start screen.
  if (!state.apiKey) {
    const notice = el("div", "notice");

    notice.append(
      el("span", "", "Add your Pollinations API key to get started."),
    );

    const btn = el("button", "", "Open settings");

    btn.type = "button";

    btn.onclick = openSettings;

    notice.append(btn);

    composer.prepend(notice);

    composer.classList.add("has-notice");
  }

  inner.append(composerWrap);

  const list = el("div", "suggestions");

  SUGGESTIONS[state.mode].forEach((suggestion) => {
    const row = el("button", "suggestion", suggestion);

    row.type = "button";

    row.onclick = () => {
      input.value = suggestion;

      autosize();

      input.focus();
    };

    list.append(row);
  });

  inner.append(list);

  wrap.append(inner);

  return wrap;
}

function renderMessages() {
  const chat = activeChat();

  const hadFocus = document.activeElement === input;

  // Detach the composer first so replaceChildren() doesn't drop it with the old start screen.
  composer.querySelector(".notice")?.remove();

  composer.classList.remove("has-notice");

  messagesEl.replaceChildren();

  if (!chat || chat.messages.length === 0) {
    messagesEl.append(renderEmpty());
  } else {
    const list = el("div", "thread");

    chat.messages.forEach((msg, index) => {
      list.append(renderMessage(msg, index === chat.messages.length - 1));
    });

    if (busy && busy.kind === "image" && busy.chatId === chat.id) {
      const [w, h] = state.imageSize.split("x");

      const skeleton = el("div", "img-skeleton", "Generating...");

      skeleton.style.aspectRatio = `${w} / ${h}`;

      list.append(skeleton);
    }

    messagesEl.append(list);

    if (composerWrap.parentElement !== mainEl) {
      mainEl.append(composerWrap);
    }

    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  if (hadFocus) {
    input.focus();
  }
}

function paintStream(msg) {
  const node = messagesEl.querySelector(`[data-stream="${msg.id}"]`);

  if (!node) {
    return;
  }

  const nearBottom =
    messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight <
    140;

  node.innerHTML = md(msg.content);

  if (nearBottom) {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
}

function updateComposer() {
  const here = busy && busy.chatId === state.activeChatId;

  sendBtn.innerHTML = icon(here ? "stop" : "arrowUp", 18);

  sendBtn.setAttribute("aria-label", here ? "Stop" : "Send");

  sendBtn.disabled = Boolean(busy && !here);

  sendBtn.title = busy && !here ? "Another reply is in progress" : "";

  sendBtn.classList.toggle("is-idle", !busy && !input.value.trim());
}

function renderAll() {
  renderSidebar();
  renderHeader();
  renderMessages();
  updateComposer();
}

/* ---- Chat actions ------------------------------------------------------ */

function errorMessage(err, retryInfo) {
  const offline = err instanceof TypeError;

  return {
    id: uid(),
    role: "assistant",
    error: true,
    content: offline
      ? "Couldn't reach Pollinations. Check your connection and try again."
      : err.message || "Something went wrong.",
    retry: retryInfo,
  };
}

function buildContext(chat) {
  const history = chat.messages
    .filter(
      (message) =>
        !message.error &&
        message.kind !== "image" &&
        message.kind !== "image-prompt" &&
        message.content,
    )
    .slice(-CONTEXT_LIMIT)
    .map((message) => ({
      role: message.role,
      content: message.content,
    }));

  const system = state.systemPrompt.trim();

  return system
    ? [
        {
          role: "system",
          content: system,
        },
        ...history,
      ]
    : history;
}

function finish(chat) {
  busy = null;

  chat.updatedAt = Date.now();

  save();

  renderSidebar();
  updateComposer();

  if (state.activeChatId === chat.id) {
    renderMessages();
  }
}

async function runText(chat) {
  const msg = {
    id: uid(),
    role: "assistant",
    content: "",
    model: state.textModel,
  };

  const context = buildContext(chat);

  chat.messages.push(msg);

  const controller = new AbortController();

  busy = {
    chatId: chat.id,
    kind: "text",
    controller,
    streamId: msg.id,
  };

  updateComposer();
  renderMessages();

  try {
    await streamChat({
      messages: context,
      model: state.textModel,
      signal: controller.signal,
      onDelta: (delta) => {
        msg.content += delta;

        paintStream(msg);
      },
    });

    if (!msg.content.trim()) {
      throw new Error(
        "The model returned an empty reply. Try again or pick another model.",
      );
    }
  } catch (err) {
    if (!msg.content.trim()) {
      chat.messages.splice(chat.messages.indexOf(msg), 1);
    }

    if (err.name !== "AbortError") {
      chat.messages.push(
        errorMessage(err, {
          kind: "text",
        }),
      );
    }
  } finally {
    finish(chat);
  }
}

async function runImage(chat, prompt) {
  const controller = new AbortController();

  busy = {
    chatId: chat.id,
    kind: "image",
    controller,
  };

  updateComposer();
  renderMessages();

  try {
    const blob = await generateImage(prompt, controller.signal);

    const imageId = uid();

    await saveImage(imageId, blob);

    chat.messages.push({
      id: uid(),
      role: "assistant",
      kind: "image",
      imageId,
      prompt,
      model: state.imageModel,
      size: state.imageSize,
      mime: blob.type,
    });
  } catch (err) {
    if (err.name !== "AbortError") {
      chat.messages.push(
        errorMessage(err, {
          kind: "image",
          prompt,
        }),
      );
    }
  } finally {
    finish(chat);
  }
}

function retry(msg) {
  if (busy) {
    return;
  }

  const chat = activeChat();

  chat.messages = chat.messages.filter((message) => message !== msg);

  save();

  if (msg.retry?.kind === "image") {
    runImage(chat, msg.retry.prompt);
  } else {
    runText(chat);
  }
}

function regenerate(msg) {
  if (busy) {
    return;
  }

  const chat = activeChat();

  if (chat.messages[chat.messages.length - 1] !== msg) {
    return;
  }

  chat.messages.pop();

  if (msg.imageId) {
    deleteImage(msg.imageId);
  }

  save();

  if (msg.kind === "image") {
    runImage(chat, msg.prompt);
  } else {
    runText(chat);
  }
}

function newChat() {
  const current = activeChat();

  if (current && current.messages.length === 0) {
    input.focus();
    return;
  }

  const chat = {
    id: uid(),
    title: "New chat",
    updatedAt: Date.now(),
    messages: [],
  };

  state.chats.unshift(chat);

  state.activeChatId = chat.id;

  save();

  renderAll();
}

function deleteChat(id) {
  const chat = state.chats.find((c) => c.id === id);

  if (!chat || !confirm(`Delete "${chat.title}"?`)) {
    return;
  }

  if (busy && busy.chatId === id) {
    busy.controller.abort();
  }

  chat.messages.forEach((message) => {
    if (message.imageId) {
      deleteImage(message.imageId);
    }
  });

  state.chats = state.chats.filter((c) => c.id !== id);

  if (state.activeChatId === id) {
    state.activeChatId = state.chats[0]?.id ?? null;
  }

  if (!state.activeChatId) {
    newChat();
    return;
  }

  save();

  renderAll();
}

function deleteAllChats() {
  if (!confirm("Delete all chats and generated images?")) {
    return;
  }

  if (busy) {
    busy.controller.abort();
  }

  state.chats.forEach((chat) => {
    chat.messages.forEach((message) => {
      if (message.imageId) {
        deleteImage(message.imageId);
      }
    });
  });

  state.chats = [];
  state.activeChatId = null;

  settingsDialog.close();

  newChat();
}

/* ---- Settings & chrome ------------------------------------------------- */

function openSettings() {
  $("apiKeyInput").value = state.apiKey;

  $("freeOnlyToggle").checked = state.freeOnly;

  $("systemInput").value = state.systemPrompt;

  $("modelStatus").textContent = modelStatusText();

  settingsDialog.showModal();
}

function saveSettings() {
  state.apiKey = $("apiKeyInput").value.trim();

  state.freeOnly = $("freeOnlyToggle").checked;

  state.systemPrompt = $("systemInput").value;

  save();

  settingsDialog.close();

  renderHeader();

  if (!activeChat()?.messages.length) {
    renderMessages();
  }
}

function setSidebar(open) {
  sidebar.classList.toggle("is-open", open);

  scrim.hidden = !open;
}

function autosize() {
  input.style.height = "auto";

  input.style.height = `${Math.min(input.scrollHeight, 200)}px`;

  updateComposer();
}

/* ---- Events ------------------------------------------------------------ */

composer.addEventListener("submit", (e) => {
  e.preventDefault();

  if (busy) {
    if (busy.chatId === state.activeChatId) {
      busy.controller.abort();
    }

    return;
  }

  const text = input.value.trim();

  if (!text) {
    return;
  }

  const chat = activeChat();

  const imageMode = state.mode === "image";

  chat.messages.push({
    id: uid(),
    role: "user",
    content: text,
    ...(imageMode
      ? {
          kind: "image-prompt",
        }
      : {}),
  });

  if (chat.title === "New chat") {
    chat.title = text.slice(0, 48);
  }

  chat.updatedAt = Date.now();

  input.value = "";

  autosize();

  save();

  renderSidebar();

  if (imageMode) {
    runImage(chat, text);
  } else {
    runText(chat);
  }
});

input.addEventListener("input", autosize);

input.addEventListener("keydown", (e) => {
  const touch = window.matchMedia("(pointer: coarse)").matches;

  if (e.key === "Enter" && !e.shiftKey && !e.isComposing && !touch) {
    e.preventDefault();
    composer.requestSubmit();
  }
});

document.querySelectorAll("#modeTabs button").forEach((button) => {
  button.addEventListener("click", () => {
    state.mode = button.dataset.mode;

    save();

    renderHeader();

    if (!activeChat()?.messages.length) {
      renderMessages();
    }
  });
});

modelSelect.addEventListener("change", () => {
  state[state.mode === "image" ? "imageModel" : "textModel"] =
    modelSelect.value;

  save();
});

$("newChatBtn").addEventListener("click", () => {
  newChat();
  setSidebar(false);
});

$("menuBtn").addEventListener("click", () => setSidebar(true));

$("closeSidebarBtn").addEventListener("click", () => setSidebar(false));

scrim.addEventListener("click", () => setSidebar(false));

$("openSettingsBtn").addEventListener("click", () => {
  setSidebar(false);
  openSettings();
});

$("closeSettingsBtn").addEventListener("click", () => settingsDialog.close());

$("saveSettingsBtn").addEventListener("click", saveSettings);

$("deleteAllBtn").addEventListener("click", deleteAllChats);

$("freeOnlyToggle").addEventListener("change", () => {
  state.freeOnly = $("freeOnlyToggle").checked;

  $("modelStatus").textContent = modelStatusText();
});

settingsDialog.addEventListener("click", (e) => {
  if (e.target === settingsDialog) {
    settingsDialog.close();
  }
});

/* ---- Boot -------------------------------------------------------------- */

hydrateIcons();
renderSizes();

if (!state.chats.length || !activeChat()) {
  if (state.chats.length) {
    state.activeChatId = state.chats[0].id;
  } else {
    newChat();
  }
}

renderAll();
loadCatalog();
