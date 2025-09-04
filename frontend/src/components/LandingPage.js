import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { CheckCircle, Users, Target, BookOpen, Calendar, Star, ArrowRight, Phone, Mail, MapPin, Play, Award, TrendingUp, Heart, Zap, Brain, Shield } from 'lucide-react';

const LandingPage = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 4000);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Track active section on scroll and header state
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'services', 'testimonials', 'how-it-works', 'resources', 'contact'];
      const scrollPosition = window.scrollY + 150;
      
      // Update header state
      setIsScrolled(window.scrollY > 50);

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && scrollPosition >= element.offsetTop && scrollPosition < element.offsetTop + element.offsetHeight) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation observer for scroll-triggered animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page">
      {/* Enhanced Navigation Header */}
      <header className={`network-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-wrapper">
          <a href="#hero" className="network-logo" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>
            <div className="logo-content">
              <div className="logo-icon">SM</div>
              <span>Sarah Mitchell</span>
            </div>
          </a>
          <nav className="network-nav">
            <a 
              href="#about" 
              className={`network-nav-link ${activeSection === 'about' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
            >
              About
            </a>
            <a 
              href="#services" 
              className={`network-nav-link ${activeSection === 'services' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}
            >
              Services
            </a>
            <a 
              href="#testimonials" 
              className={`network-nav-link ${activeSection === 'testimonials' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}
            >
              Success Stories
            </a>
            <a 
              href="#how-it-works" 
              className={`network-nav-link ${activeSection === 'how-it-works' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}
            >
              Process
            </a>
            <a 
              href="#resources" 
              className={`network-nav-link ${activeSection === 'resources' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('resources'); }}
            >
              Resources
            </a>
            <Button 
              className="nav-cta-btn"
              onClick={() => scrollToSection('contact')}
            >
              Get Started
            </Button>
          </nav>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section id="hero" className="hero-section">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="floating-elements">
            <div className="floating-element element-1"></div>
            <div className="floating-element element-2"></div>
            <div className="floating-element element-3"></div>
          </div>
        </div>
        
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badges">
                <Badge className="hero-badge">
                  <Award className="badge-icon" />
                  Certified Life Coach (ICF)
                </Badge>
                <Badge className="hero-badge-alt">
                  <TrendingUp className="badge-icon" />
                  500+ Success Stories
                </Badge>
              </div>
              
              <h1 className="hero-title">
                Transform Your Life,
                <span className="hero-highlight"> Unlock Your Potential</span>
              </h1>
              
              <p className="hero-description">
                Break through barriers, achieve your biggest goals, and create the extraordinary life you deserve. 
                Join hundreds of successful clients who've transformed their careers, relationships, and mindset 
                through proven coaching strategies.
              </p>
              
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Lives Transformed</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">8+</div>
                  <div className="stat-label">Years Experience</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">98%</div>
                  <div className="stat-label">Success Rate</div>
                </div>
              </div>
              
              <div className="hero-buttons">
                <Button 
                  className="btn-hero-primary" 
                  onClick={() => scrollToSection('contact')}
                >
                  Start Your Transformation
                  <ArrowRight className="btn-icon" />
                </Button>
                <Button 
                  variant="outline" 
                  className="btn-hero-secondary"
                  onClick={() => scrollToSection('about')}
                >
                  <Play className="btn-icon-left" />
                  Watch Success Stories
                </Button>
              </div>
            </div>
            
            <div className="hero-visual">
              <div className="hero-image-container">
                <img 
                  src="https://images.unsplash.com/photo-1598268012815-ae21095df31b" 
                  alt="Sarah Mitchell - Professional Life Coach" 
                  className="hero-image"
                />
                <div className="hero-image-overlay">
                  <div className="testimonial-bubble">
                    <div className="bubble-content">
                      <div className="bubble-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="bubble-star" />
                        ))}
                      </div>
                      <p>"Life-changing experience!"</p>
                      <span>- Jessica M.</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="success-indicators">
                <div className="indicator-card">
                  <div className="indicator-icon">
                    <Target className="icon" />
                  </div>
                  <div className="indicator-text">
                    <strong>Goal Achievement</strong>
                    <span>Set & reach life goals</span>
                  </div>
                </div>
                <div className="indicator-card">
                  <div className="indicator-icon">
                    <Brain className="icon" />
                  </div>
                  <div className="indicator-text">
                    <strong>Mindset Shift</strong>
                    <span>Transform limiting beliefs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-visual animate-on-scroll">
              <div className="about-image-container">
                <img 
                  src="https://images.unsplash.com/photo-1598268012815-ae21095df31b" 
                  alt="Sarah Mitchell - Life Coach" 
                  className="about-image"
                />
                <div className="experience-badge">
                  <div className="experience-number">8+</div>
                  <div className="experience-text">Years of<br/>Excellence</div>
                </div>
              </div>
              
              <div className="achievement-cards">
                <div className="achievement-card">
                  <Shield className="achievement-icon" />
                  <span>ICF Certified</span>
                </div>
                <div className="achievement-card">
                  <Award className="achievement-icon" />
                  <span>500+ Success Stories</span>
                </div>
              </div>
            </div>
            
            <div className="about-text animate-on-scroll">
              <Badge className="section-badge">
                <Heart className="badge-icon" />
                Meet Your Coach
              </Badge>
              
              <h2 className="section-title">
                Hi, I'm Sarah Mitchell
                <span className="title-highlight"> Your Transformation Partner</span>
              </h2>
              
              <p className="section-description">
                For over 8 years, I've dedicated my life to helping individuals break through their limitations 
                and create extraordinary results. My approach combines proven psychological principles with 
                practical strategies that create lasting change.
              </p>
              
              <div className="about-highlights">
                <div className="highlight-item">
                  <CheckCircle className="highlight-icon" />
                  <div className="highlight-content">
                    <strong>Master's in Psychology</strong>
                    <span>UCLA Graduate with honors</span>
                  </div>
                </div>
                <div className="highlight-item">
                  <CheckCircle className="highlight-icon" />
                  <div className="highlight-content">
                    <strong>ICF Certified Coach</strong>
                    <span>International Coaching Federation</span>
                  </div>
                </div>
                <div className="highlight-item">
                  <CheckCircle className="highlight-icon" />
                  <div className="highlight-content">
                    <strong>NLP Master Practitioner</strong>
                    <span>Advanced communication techniques</span>
                  </div>
                </div>
                <div className="highlight-item">
                  <CheckCircle className="highlight-icon" />
                  <div className="highlight-content">
                    <strong>500+ Transformations</strong>
                    <span>Proven track record of success</span>
                  </div>
                </div>
              </div>
              
              <div className="about-cta">
                <Button 
                  className="btn-primary"
                  onClick={() => scrollToSection('contact')}
                >
                  Work With Me
                  <ArrowRight className="btn-icon" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section id="services" className="services-section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <Badge className="section-badge">
              <Zap className="badge-icon" />
              Coaching Services
            </Badge>
            <h2 className="section-title">
              Transform Every Area of 
              <span className="title-highlight"> Your Life</span>
            </h2>
            <p className="section-description">
              Comprehensive coaching programs designed to create breakthrough results in the areas that matter most to you.
            </p>
          </div>
          
          <div className="services-grid">
            <Card className="service-card premium-card animate-on-scroll">
              <div className="service-header">
                <div className="service-icon-container">
                  <Target className="service-icon" />
                </div>
                <div className="service-badge">Most Popular</div>
              </div>
              <CardHeader>
                <CardTitle className="service-title">Career & Purpose Mastery</CardTitle>
                <CardDescription className="service-description">
                  Discover your true calling and build a fulfilling career that aligns with your deepest values and highest potential.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="service-features">
                  <div className="feature-item">
                    <CheckCircle className="feature-icon" />
                    <span>Career transition strategy & planning</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle className="feature-icon" />
                    <span>Purpose discovery & clarity sessions</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle className="feature-icon" />
                    <span>Professional confidence building</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle className="feature-icon" />
                    <span>Interview & negotiation mastery</span>
                  </div>
                </div>
                <div className="service-result">
                  <div className="result-stat">
                    <span className="stat">92%</span>
                    <span className="stat-desc">Career satisfaction increase</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="service-card animate-on-scroll">
              <div className="service-header">
                <div className="service-icon-container">
                  <Users className="service-icon" />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="service-title">Relationship & Communication</CardTitle>
                <CardDescription className="service-description">
                  Master the art of meaningful connections and build stronger, more fulfilling relationships in all areas of life.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="service-features">
                  <div className="feature-item">
                    <CheckCircle className="feature-icon" />
                    <span>Advanced communication skills training</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle className="feature-icon" />
                    <span>Conflict resolution & mediation</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle className="feature-icon" />
                    <span>Healthy boundary setting techniques</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle className="feature-icon" />
                    <span>Leadership & influence development</span>
                  </div>
                </div>
                <div className="service-result">
                  <div className="result-stat">
                    <span className="stat">89%</span>
                    <span className="stat-desc">Relationship quality improvement</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="service-card animate-on-scroll">
              <div className="service-header">
                <div className="service-icon-container">
                  <Brain className="service-icon" />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="service-title">Mindset & Personal Growth</CardTitle>
                <CardDescription className="service-description">
                  Break through limiting beliefs and develop an unstoppable growth mindset for achieving your biggest dreams.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="service-features">
                  <div className="feature-item">
                    <CheckCircle className="feature-icon" />
                    <span>Limiting belief transformation</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle className="feature-icon" />
                    <span>Confidence & self-esteem building</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle className="feature-icon" />
                    <span>Goal achievement & accountability</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle className="feature-icon" />
                    <span>Stress management & resilience</span>
                  </div>
                </div>
                <div className="service-result">
                  <div className="result-stat">
                    <span className="stat">95%</span>
                    <span className="stat-desc">Confidence increase reported</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <Badge className="section-badge">
              <Star className="badge-icon" />
              Success Stories
            </Badge>
            <h2 className="section-title">
              Real People, Real 
              <span className="title-highlight"> Transformations</span>
            </h2>
            <p className="section-description">
              Don't just take our word for it. Here's what clients say about their life-changing experiences.
            </p>
          </div>

          <div className="testimonials-grid">
            <Card className="testimonial-card featured-testimonial animate-on-scroll">
              <CardContent className="testimonial-content">
                <div className="testimonial-header">
                  <div className="client-photo">
                    <img 
                      src="https://images.unsplash.com/photo-1615349719958-8e6381dd2f3e" 
                      alt="Jessica Martinez" 
                      className="client-image"
                    />
                  </div>
                  <div className="client-info">
                    <h4 className="client-name">Jessica Martinez</h4>
                    <p className="client-title">Marketing Director</p>
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="star-filled" />
                      ))}
                    </div>
                  </div>
                </div>
                <blockquote className="testimonial-quote">
                  "Sarah completely transformed my career trajectory. I went from feeling stuck and unfulfilled to landing my dream job as Marketing Director and starting my own consulting business. Her guidance was not just helpful—it was life-changing. The confidence and clarity I gained through our sessions have impacted every aspect of my life."
                </blockquote>
                <div className="testimonial-result">
                  <div className="result-item">
                    <span className="result-label">Career Growth:</span>
                    <span className="result-value">300% salary increase</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="testimonial-card animate-on-scroll">
              <CardContent className="testimonial-content">
                <div className="testimonial-header">
                  <div className="client-photo">
                    <img 
                      src="https://images.unsplash.com/photo-1573633509389-0e3075dea01b" 
                      alt="Michael Chen" 
                      className="client-image"
                    />
                  </div>
                  <div className="client-info">
                    <h4 className="client-name">Michael Chen</h4>
                    <p className="client-title">Tech Team Lead</p>
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="star-filled" />
                      ))}
                    </div>
                  </div>
                </div>
                <blockquote className="testimonial-quote">
                  "I struggled with imposter syndrome and self-doubt for years. Sarah helped me recognize my worth and develop unshakeable confidence. I now lead a team of 20 engineers and just got promoted to Director level."
                </blockquote>
                <div className="testimonial-result">
                  <div className="result-item">
                    <span className="result-label">Leadership Growth:</span>
                    <span className="result-value">Team of 20 people</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="testimonial-card animate-on-scroll">
              <CardContent className="testimonial-content">
                <div className="testimonial-header">
                  <div className="client-photo">
                    <img 
                      src="https://images.unsplash.com/photo-1751399566443-a07d07344bdf" 
                      alt="Amanda Foster" 
                      className="client-image"
                    />
                  </div>
                  <div className="client-info">
                    <h4 className="client-name">Amanda Foster</h4>
                    <p className="client-title">Entrepreneur</p>
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="star-filled" />
                      ))}
                    </div>
                  </div>
                </div>
                <blockquote className="testimonial-quote">
                  "Sarah's coaching helped me overcome crippling anxiety and build the business I'd always dreamed of. Her approach is both compassionate and results-driven. I'm now running a 6-figure business and loving every moment."
                </blockquote>
                <div className="testimonial-result">
                  <div className="result-item">
                    <span className="result-label">Business Success:</span>
                    <span className="result-value">6-figure revenue</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="testimonials-cta animate-on-scroll">
            <p className="cta-text">Ready to write your own success story?</p>
            <Button 
              className="btn-primary"
              onClick={() => scrollToSection('contact')}
            >
              Start Your Journey
              <ArrowRight className="btn-icon" />
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <Badge className="section-badge">
              <BookOpen className="badge-icon" />
              The Process
            </Badge>
            <h2 className="section-title">
              Your Transformation Journey in 
              <span className="title-highlight"> 4 Simple Steps</span>
            </h2>
            <p className="section-description">
              A proven methodology that has helped hundreds achieve breakthrough results and lasting change.
            </p>
          </div>

          <div className="process-container">
            <div className="process-timeline"></div>
            
            <div className="process-steps">
              <div className="process-step animate-on-scroll">
                <div className="step-visual">
                  <div className="step-number">1</div>
                  <div className="step-icon">
                    <Phone className="icon" />
                  </div>
                </div>
                <div className="step-content">
                  <h3 className="step-title">Free Discovery Call</h3>
                  <p className="step-description">
                    We start with a comprehensive 30-minute discovery call to understand your goals, 
                    challenges, and vision for your future. This is where we determine if we're a perfect fit.
                  </p>
                  <div className="step-details">
                    <div className="detail-item">
                      <CheckCircle className="detail-icon" />
                      <span>Goal clarity assessment</span>
                    </div>
                    <div className="detail-item">
                      <CheckCircle className="detail-icon" />
                      <span>Challenge identification</span>
                    </div>
                    <div className="detail-item">
                      <CheckCircle className="detail-icon" />
                      <span>Success vision mapping</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="process-step animate-on-scroll">
                <div className="step-visual">
                  <div className="step-number">2</div>
                  <div className="step-icon">
                    <Target className="icon" />
                  </div>
                </div>
                <div className="step-content">
                  <h3 className="step-title">Custom Strategy Development</h3>
                  <p className="step-description">
                    I create a personalized coaching plan tailored specifically to your needs, goals, 
                    and timeline. Every strategy is unique because every person is unique.
                  </p>
                  <div className="step-details">
                    <div className="detail-item">
                      <CheckCircle className="detail-icon" />
                      <span>Personalized action plan</span>
                    </div>
                    <div className="detail-item">
                      <CheckCircle className="detail-icon" />
                      <span>Milestone mapping</span>
                    </div>
                    <div className="detail-item">
                      <CheckCircle className="detail-icon" />
                      <span>Resource allocation</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="process-step animate-on-scroll">
                <div className="step-visual">
                  <div className="step-number">3</div>
                  <div className="step-icon">
                    <Users className="icon" />
                  </div>
                </div>
                <div className="step-content">
                  <h3 className="step-title">Weekly Coaching Sessions</h3>
                  <p className="step-description">
                    Through weekly 60-minute sessions, we work together to break through barriers, 
                    implement strategies, and create sustainable positive changes in your life.
                  </p>
                  <div className="step-details">
                    <div className="detail-item">
                      <CheckCircle className="detail-icon" />
                      <span>Deep breakthrough work</span>
                    </div>
                    <div className="detail-item">
                      <CheckCircle className="detail-icon" />
                      <span>Accountability & support</span>
                    </div>
                    <div className="detail-item">
                      <CheckCircle className="detail-icon" />
                      <span>Progress tracking</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="process-step animate-on-scroll">
                <div className="step-visual">
                  <div className="step-number">4</div>
                  <div className="step-icon">
                    <Award className="icon" />
                  </div>
                </div>
                <div className="step-content">
                  <h3 className="step-title">Lasting Transformation</h3>
                  <p className="step-description">
                    Experience genuine, lasting transformation as you develop new habits, mindsets, 
                    and achieve your most important goals. The results speak for themselves.
                  </p>
                  <div className="step-details">
                    <div className="detail-item">
                      <CheckCircle className="detail-icon" />
                      <span>Sustainable habit formation</span>
                    </div>
                    <div className="detail-item">
                      <CheckCircle className="detail-icon" />
                      <span>Mindset transformation</span>
                    </div>
                    <div className="detail-item">
                      <CheckCircle className="detail-icon" />
                      <span>Goal achievement</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Resources Section */}
      <section id="resources" className="resources-section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <Badge className="section-badge">
              <BookOpen className="badge-icon" />
              Free Resources
            </Badge>
            <h2 className="section-title">
              Start Your Journey 
              <span className="title-highlight"> Today</span>
            </h2>
            <p className="section-description">
              Download these powerful, science-backed resources to begin your transformation right now.
            </p>
          </div>

          <div className="resources-grid">
            <Card className="resource-card premium-resource animate-on-scroll">
              <div className="resource-visual">
                <div className="resource-icon">
                  <Target className="icon" />
                </div>
                <div className="resource-badge">Most Downloaded</div>
              </div>
              <CardHeader>
                <CardTitle className="resource-title">Ultimate Goal Setting Workbook</CardTitle>
                <CardDescription className="resource-description">
                  A comprehensive 25-page guide to setting and achieving meaningful goals that align with your deepest values and highest potential.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="resource-features">
                  <div className="feature-item">
                    <CheckCircle className="feature-icon" />
                    <span>SMART goals framework</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle className="feature-icon" />
                    <span>Values alignment exercises</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle className="feature-icon" />
                    <span>Action planning templates</span>
                  </div>
                </div>
                <Button className="resource-btn">
                  Download Free (PDF)
                  <ArrowRight className="btn-icon" />
                </Button>
              </CardContent>
            </Card>

            <Card className="resource-card animate-on-scroll">
              <div className="resource-visual">
                <div className="resource-icon">
                  <Zap className="icon" />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="resource-title">Confidence Building Masterclass</CardTitle>
                <CardDescription className="resource-description">
                  7 proven strategies to build unshakeable confidence and overcome self-doubt permanently.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="resource-features">
                  <div className="feature-item">
                    <CheckCircle className="feature-icon" />
                    <span>Self-doubt elimination techniques</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle className="feature-icon" />
                    <span>Daily confidence rituals</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle className="feature-icon" />
                    <span>Body language mastery</span>
                  </div>
                </div>
                <Button className="resource-btn">
                  Download Free (PDF)
                  <ArrowRight className="btn-icon" />
                </Button>
              </CardContent>
            </Card>

            <Card className="resource-card animate-on-scroll">
              <div className="resource-visual">
                <div className="resource-icon">
                  <Brain className="icon" />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="resource-title">Life Vision Planning Kit</CardTitle>
                <CardDescription className="resource-description">
                  Create a crystal-clear vision for your ideal life and the step-by-step roadmap to get there.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="resource-features">
                  <div className="feature-item">
                    <CheckCircle className="feature-icon" />
                    <span>Vision board templates</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle className="feature-icon" />
                    <span>Life wheel assessment</span>
                  </div>
                  <div className="feature-item">
                    <CheckCircle className="feature-icon" />
                    <span>Monthly review systems</span>
                  </div>
                </div>
                <Button className="resource-btn">
                  Download Free (PDF)
                  <ArrowRight className="btn-icon" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info animate-on-scroll">
              <Badge className="section-badge">
                <Calendar className="badge-icon" />
                Let's Connect
              </Badge>
              <h2 className="section-title">
                Ready to Transform 
                <span className="title-highlight"> Your Life?</span>
              </h2>
              <p className="section-description">
                Book your complimentary 30-minute discovery call today. We'll explore your goals, 
                discuss your challenges, and determine if coaching is the right fit for you. 
                No pressure, no sales pitch – just valuable insights.
              </p>
              
              <div className="contact-highlights">
                <div className="highlight-item">
                  <CheckCircle className="highlight-icon" />
                  <span>Free 30-minute consultation</span>
                </div>
                <div className="highlight-item">
                  <CheckCircle className="highlight-icon" />
                  <span>Personalized strategy discussion</span>
                </div>
                <div className="highlight-item">
                  <CheckCircle className="highlight-icon" />
                  <span>No obligation or pressure</span>
                </div>
              </div>
              
              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">
                    <Phone className="icon" />
                  </div>
                  <div className="contact-text">
                    <strong>(555) 123-4567</strong>
                    <span>Available Mon-Fri, 9AM-6PM PST</span>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">
                    <Mail className="icon" />
                  </div>
                  <div className="contact-text">
                    <strong>sarah@sarahmitchellcoaching.com</strong>
                    <span>Response within 24 hours</span>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">
                    <MapPin className="icon" />
                  </div>
                  <div className="contact-text">
                    <strong>Los Angeles, CA</strong>
                    <span>Online sessions available worldwide</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-container animate-on-scroll">
              <Card className="contact-form-card">
                <CardHeader className="form-header">
                  <CardTitle className="form-title">Book Your Free Discovery Call</CardTitle>
                  <CardDescription className="form-description">
                    Fill out the form below and I'll get back to you within 24 hours to schedule your complimentary session.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="form-success">
                      <div className="success-visual">
                        <CheckCircle className="success-icon" />
                      </div>
                      <h3 className="success-title">Thank You!</h3>
                      <p className="success-message">
                        I've received your information and will personally reach out within 24 hours 
                        to schedule your free discovery call. Get ready to start your transformation journey!
                      </p>
                      <div className="success-next-steps">
                        <p><strong>What happens next:</strong></p>
                        <ul>
                          <li>Personal email from me within 24 hours</li>
                          <li>Schedule your free 30-minute call</li>
                          <li>Receive pre-session preparation guide</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="contact-form">
                      <div className="form-row">
                        <div className="form-group">
                          <Input
                            type="text"
                            name="name"
                            placeholder="Your Full Name *"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <Input
                            type="email"
                            name="email"
                            placeholder="Your Email Address *"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <Input
                          type="tel"
                          name="phone"
                          placeholder="Your Phone Number (Optional)"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <Textarea
                          name="message"
                          placeholder="Tell me about your biggest goals and challenges. What would you most like to achieve through coaching? (This helps me prepare for our call)"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={5}
                          className="form-textarea"
                        />
                      </div>
                      <Button type="submit" className="form-submit-btn">
                        Book My Free Discovery Call
                        <Calendar className="btn-icon" />
                      </Button>
                      <p className="form-disclaimer">
                        By submitting this form, you agree to receive communications from Sarah Mitchell Coaching. 
                        Your information is never shared with third parties.
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="logo-icon">SM</div>
                <span>Sarah Mitchell Coaching</span>
              </div>
              <p className="footer-tagline">
                Empowering individuals to unlock their potential and create extraordinary lives through 
                personalized coaching and proven strategies.
              </p>
              <div className="footer-credentials">
                <Badge className="credential-badge">ICF Certified</Badge>
                <Badge className="credential-badge">NLP Master</Badge>
                <Badge className="credential-badge">500+ Success Stories</Badge>
              </div>
            </div>
            
            <div className="footer-links">
              <div className="footer-section">
                <h4 className="footer-section-title">Services</h4>
                <ul className="footer-list">
                  <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>Career Coaching</a></li>
                  <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>Relationship Coaching</a></li>
                  <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>Personal Growth</a></li>
                  <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>Mindset Transformation</a></li>
                </ul>
              </div>
              
              <div className="footer-section">
                <h4 className="footer-section-title">Resources</h4>
                <ul className="footer-list">
                  <li><a href="#resources" onClick={(e) => { e.preventDefault(); scrollToSection('resources'); }}>Free Downloads</a></li>
                  <li><a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}>Success Stories</a></li>
                  <li><a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>How It Works</a></li>
                  <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About Sarah</a></li>
                </ul>
              </div>
              
              <div className="footer-section">
                <h4 className="footer-section-title">Connect</h4>
                <ul className="footer-list">
                  <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Book Discovery Call</a></li>
                  <li><a href="mailto:sarah@sarahmitchellcoaching.com">Email Sarah</a></li>
                  <li><a href="tel:5551234567">Call (555) 123-4567</a></li>
                  <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact Form</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <Separator className="footer-separator" />
          
          <div className="footer-bottom">
            <div className="footer-copyright">
              <p>&copy; 2024 Sarah Mitchell Coaching. All rights reserved.</p>
              <p className="footer-subtitle">Transforming lives through personalized coaching excellence.</p>
            </div>
            <div className="footer-legal">
              <a href="#privacy" className="legal-link">Privacy Policy</a>
              <a href="#terms" className="legal-link">Terms of Service</a>
              <a href="#disclaimer" className="legal-link">Disclaimer</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;