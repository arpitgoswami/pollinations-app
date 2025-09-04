import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { CheckCircle, ArrowRight, Phone, Mail, MapPin, Star } from 'lucide-react';

const LandingPage = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
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

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'services', 'testimonials', 'process', 'contact'];
      const scrollPosition = window.scrollY + 100;

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

  return (
    <div className="minimal-landing">
      {/* Minimal Navigation */}
      <header className="minimal-header">
        <div className="container">
          <nav className="nav-content">
            <a href="#hero" className="logo" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>
              Sarah Mitchell
            </a>
            <div className="nav-links">
              <a 
                href="#about" 
                className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
              >
                About
              </a>
              <a 
                href="#services" 
                className={`nav-link ${activeSection === 'services' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}
              >
                Services
              </a>
              <a 
                href="#testimonials" 
                className={`nav-link ${activeSection === 'testimonials' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}
              >
                Testimonials
              </a>
              <Button 
                variant="outline" 
                className="contact-btn"
                onClick={() => scrollToSection('contact')}
              >
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Minimal Hero Section */}
      <section id="hero" className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Transform Your Life Through 
                <span className="highlight"> Expert Coaching</span>
              </h1>
              <p className="hero-description">
                Break through barriers, achieve your goals, and create the life you've always envisioned. 
                Personalized coaching that delivers real results.
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <span className="number">500+</span>
                  <span className="label">Lives Transformed</span>
                </div>
                <div className="stat">
                  <span className="number">8</span>
                  <span className="label">Years Experience</span>
                </div>
                <div className="stat">
                  <span className="number">98%</span>
                  <span className="label">Success Rate</span>
                </div>
              </div>
              <div className="hero-actions">
                <Button 
                  className="primary-btn" 
                  onClick={() => scrollToSection('contact')}
                >
                  Start Your Journey
                  <ArrowRight className="icon" />
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => scrollToSection('about')}
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="hero-image">
              <img 
                src="https://images.unsplash.com/photo-1598268012815-ae21095df31b" 
                alt="Sarah Mitchell - Life Coach" 
                className="coach-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Minimal About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">About Sarah</h2>
            <p className="section-subtitle">
              Certified life coach with 8+ years of experience helping individuals achieve breakthrough results.
            </p>
          </div>
          
          <div className="about-grid">
            <div className="about-text">
              <p>
                I believe everyone has untapped potential waiting to be unleashed. Through personalized coaching 
                strategies and proven methodologies, I help my clients overcome limiting beliefs, set meaningful 
                goals, and create lasting positive change.
              </p>
              <div className="credentials">
                <div className="credential">
                  <CheckCircle className="check-icon" />
                  <span>ICF Certified Life Coach</span>
                </div>
                <div className="credential">
                  <CheckCircle className="check-icon" />
                  <span>Master's in Psychology, UCLA</span>
                </div>
                <div className="credential">
                  <CheckCircle className="check-icon" />
                  <span>NLP Master Practitioner</span>
                </div>
                <div className="credential">
                  <CheckCircle className="check-icon" />
                  <span>500+ Successful Transformations</span>
                </div>
              </div>
            </div>
            <div className="about-image">
              <img 
                src="https://images.unsplash.com/photo-1598268012815-ae21095df31b" 
                alt="Sarah Mitchell" 
                className="profile-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Services Section */}
      <section id="services" className="services">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Services</h2>
            <p className="section-subtitle">
              Comprehensive coaching programs tailored to your unique goals and challenges.
            </p>
          </div>
          
          <div className="services-grid">
            <Card className="service-card">
              <CardHeader>
                <CardTitle>Career & Purpose</CardTitle>
                <CardDescription>
                  Discover your true calling and build a fulfilling career aligned with your values.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="service-list">
                  <li>Career transition guidance</li>
                  <li>Purpose discovery sessions</li>
                  <li>Professional confidence building</li>
                  <li>Interview preparation</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="service-card">
              <CardHeader>
                <CardTitle>Relationships</CardTitle>
                <CardDescription>
                  Build stronger connections and master effective communication skills.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="service-list">
                  <li>Communication skills training</li>
                  <li>Conflict resolution</li>
                  <li>Boundary setting</li>
                  <li>Leadership development</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="service-card">
              <CardHeader>
                <CardTitle>Personal Growth</CardTitle>
                <CardDescription>
                  Break through limiting beliefs and develop an unstoppable mindset.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="service-list">
                  <li>Mindset transformation</li>
                  <li>Confidence building</li>
                  <li>Goal achievement</li>
                  <li>Stress management</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Minimal Testimonials Section */}
      <section id="testimonials" className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Clients Say</h2>
            <p className="section-subtitle">
              Real stories from people who transformed their lives through coaching.
            </p>
          </div>
          
          <div className="testimonials-grid">
            <Card className="testimonial-card">
              <CardContent>
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="star" />
                  ))}
                </div>
                <blockquote>
                  "Sarah helped me completely transform my career. I went from feeling stuck to landing my dream job and starting my own business. Her guidance was life-changing."
                </blockquote>
                <div className="author">
                  <img 
                    src="https://images.unsplash.com/photo-1615349719958-8e6381dd2f3e" 
                    alt="Jessica Martinez" 
                    className="author-image"
                  />
                  <div>
                    <div className="author-name">Jessica Martinez</div>
                    <div className="author-title">Marketing Director</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="testimonial-card">
              <CardContent>
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="star" />
                  ))}
                </div>
                <blockquote>
                  "I struggled with confidence for years. Through Sarah's coaching, I developed unshakeable self-belief and now lead a team of 20 people."
                </blockquote>
                <div className="author">
                  <img 
                    src="https://images.unsplash.com/photo-1573633509389-0e3075dea01b" 
                    alt="Michael Chen" 
                    className="author-image"
                  />
                  <div>
                    <div className="author-name">Michael Chen</div>
                    <div className="author-title">Team Lead</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="testimonial-card">
              <CardContent>
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="star" />
                  ))}
                </div>
                <blockquote>
                  "Sarah's approach is both compassionate and results-driven. She helped me overcome anxiety and build the life I always wanted."
                </blockquote>
                <div className="author">
                  <img 
                    src="https://images.unsplash.com/photo-1751399566443-a07d07344bdf" 
                    alt="Amanda Foster" 
                    className="author-image"
                  />
                  <div>
                    <div className="author-name">Amanda Foster</div>
                    <div className="author-title">Entrepreneur</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Minimal Process Section */}
      <section id="process" className="process">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              A simple 4-step process to transform your life.
            </p>
          </div>
          
          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Discovery Call</h3>
              <p>Free 30-minute consultation to understand your goals and challenges.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Custom Plan</h3>
              <p>Personalized coaching strategy tailored to your specific needs.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Weekly Sessions</h3>
              <p>Regular coaching sessions to implement changes and track progress.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Transformation</h3>
              <p>Achieve your goals and maintain lasting positive change.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <h2 className="section-title">Ready to Get Started?</h2>
              <p className="section-subtitle">
                Book your free discovery call today. No pressure, just a genuine conversation about your goals.
              </p>
              
              <div className="contact-details">
                <div className="contact-item">
                  <Phone className="contact-icon" />
                  <div>
                    <div className="contact-label">Phone</div>
                    <div className="contact-value">(555) 123-4567</div>
                  </div>
                </div>
                <div className="contact-item">
                  <Mail className="contact-icon" />
                  <div>
                    <div className="contact-label">Email</div>
                    <div className="contact-value">sarah@sarahmitchellcoaching.com</div>
                  </div>
                </div>
                <div className="contact-item">
                  <MapPin className="contact-icon" />
                  <div>
                    <div className="contact-label">Location</div>
                    <div className="contact-value">Los Angeles, CA (Online Available)</div>
                  </div>
                </div>
              </div>
            </div>

            <Card className="contact-form-card">
              <CardHeader>
                <CardTitle>Book Your Free Discovery Call</CardTitle>
                <CardDescription>
                  Fill out the form below and I'll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="success-message">
                    <CheckCircle className="success-icon" />
                    <h3>Thank you!</h3>
                    <p>I'll get back to you within 24 hours to schedule your free consultation.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-row">
                      <Input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number (Optional)"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                    <Textarea
                      name="message"
                      placeholder="Tell me about your goals and what you'd like to achieve..."
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                    />
                    <Button type="submit" className="submit-btn">
                      Send Message
                      <ArrowRight className="icon" />
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>Sarah Mitchell Coaching</h3>
              <p>Transforming lives through personalized coaching excellence.</p>
            </div>
            
            <div className="footer-links">
              <div className="footer-column">
                <h4>Services</h4>
                <ul>
                  <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>Career Coaching</a></li>
                  <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>Relationships</a></li>
                  <li><a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>Personal Growth</a></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h4>Company</h4>
                <ul>
                  <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a></li>
                  <li><a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}>Testimonials</a></li>
                  <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <Separator className="footer-separator" />
          
          <div className="footer-bottom">
            <p>&copy; 2024 Sarah Mitchell Coaching. All rights reserved.</p>
            <div className="footer-legal">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;