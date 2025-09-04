import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { CheckCircle, Users, Target, BookOpen, Calendar, Star, ArrowRight, Phone, Mail, MapPin } from 'lucide-react';

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
      const sections = ['hero', 'about', 'services', 'testimonials', 'how-it-works', 'resources', 'contact'];
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
    <div className="landing-page">
      {/* Navigation Header */}
      <header className="network-header">
        <div className="nav-wrapper">
          <a href="#hero" className="network-logo" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>
            Sarah Mitchell Coaching
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
              How It Works
            </a>
            <a 
              href="#resources" 
              className={`network-nav-link ${activeSection === 'resources' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('resources'); }}
            >
              Resources
            </a>
            <a 
              href="#contact" 
              className={`network-nav-link ${activeSection === 'contact' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
            >
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="hero-section">
        <div className="hero-content">
          <div className="container">
            <div className="hero-text">
              <Badge className="hero-badge">Transform Your Life Today</Badge>
              <h1 className="display-large animated fadeIn">
                Unlock Your True Potential with Expert Life Coaching
              </h1>
              <p className="body-large animated fadeIn delay-200ms">
                Are you ready to break through barriers, achieve your goals, and create the life you've always dreamed of? 
                Join hundreds of clients who have transformed their lives through personalized coaching.
              </p>
              <div className="hero-buttons animated fadeIn delay-500ms">
                <Button 
                  className="btn-cta" 
                  onClick={() => scrollToSection('contact')}
                >
                  Book Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  className="btn-secondary"
                  onClick={() => scrollToSection('about')}
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <img 
            src="https://images.unsplash.com/photo-1518495973542-4542c06a5843" 
            alt="Growth and transformation" 
            className="hero-bg-image"
          />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <Badge className="section-badge">About Sarah</Badge>
              <h2 className="heading-1 animated fadeIn">
                Meet Your Transformation Partner
              </h2>
              <p className="body-large animated fadeIn delay-200ms">
                With over 8 years of experience in life coaching and personal development, I've helped over 500 
                individuals break through limiting beliefs and create extraordinary lives.
              </p>
              <div className="credentials animated fadeIn delay-500ms">
                <div className="credential-item">
                  <CheckCircle className="credential-icon" />
                  <span>Certified Life Coach (ICF)</span>
                </div>
                <div className="credential-item">
                  <CheckCircle className="credential-icon" />
                  <span>NLP Master Practitioner</span>
                </div>
                <div className="credential-item">
                  <CheckCircle className="credential-icon" />
                  <span>Psychology Degree (UCLA)</span>
                </div>
                <div className="credential-item">
                  <CheckCircle className="credential-icon" />
                  <span>500+ Success Stories</span>
                </div>
              </div>
            </div>
            <div className="about-image animated fadeIn delay-200ms">
              <img 
                src="https://images.unsplash.com/photo-1598268012815-ae21095df31b" 
                alt="Sarah Mitchell - Life Coach" 
                className="coach-photo"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="container">
          <div className="section-header">
            <Badge className="section-badge">Services</Badge>
            <h2 className="heading-1 text-center">Transform Every Area of Your Life</h2>
            <p className="body-large text-center max-w-3xl mx-auto">
              Comprehensive coaching programs designed to help you achieve breakthrough results in all areas of your life.
            </p>
          </div>
          
          <div className="services-grid">
            <Card className="network-card service-card animated fadeIn">
              <CardHeader>
                <div className="service-icon">
                  <Target className="h-8 w-8" />
                </div>
                <CardTitle className="network-card-title">Career & Purpose</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="network-card-content">
                  Discover your true calling and build a fulfilling career aligned with your values and passions.
                </CardDescription>
                <ul className="service-features">
                  <li>Career transition guidance</li>
                  <li>Purpose discovery sessions</li>
                  <li>Professional confidence building</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="network-card service-card animated fadeIn delay-200ms">
              <CardHeader>
                <div className="service-icon">
                  <Users className="h-8 w-8" />
                </div>
                <CardTitle className="network-card-title">Relationships & Communication</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="network-card-content">
                  Build stronger, more meaningful relationships and master the art of effective communication.
                </CardDescription>
                <ul className="service-features">
                  <li>Communication skills training</li>
                  <li>Conflict resolution strategies</li>
                  <li>Boundary setting techniques</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="network-card service-card animated fadeIn delay-500ms">
              <CardHeader>
                <div className="service-icon">
                  <BookOpen className="h-8 w-8" />
                </div>
                <CardTitle className="network-card-title">Personal Growth & Mindset</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="network-card-content">
                  Break through limiting beliefs and develop an unstoppable growth mindset for lasting success.
                </CardDescription>
                <ul className="service-features">
                  <li>Limiting belief transformation</li>
                  <li>Confidence & self-esteem building</li>
                  <li>Goal achievement strategies</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <Badge className="section-badge">Success Stories</Badge>
            <h2 className="heading-1 text-center">What My Clients Say</h2>
            <p className="body-large text-center">
              Real transformations from real people who took the leap to invest in themselves.
            </p>
          </div>

          <div className="testimonials-grid">
            <Card className="network-card testimonial-card animated fadeIn">
              <CardContent className="testimonial-content">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="star-icon filled" />
                  ))}
                </div>
                <p className="testimonial-text">
                  "Sarah helped me completely transform my career. I went from feeling stuck and unfulfilled to landing my dream job 
                  and starting my own side business. Her guidance was life-changing."
                </p>
                <div className="testimonial-author">
                  <div className="author-info">
                    <h4>Jessica Martinez</h4>
                    <p>Marketing Director</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="network-card testimonial-card animated fadeIn delay-200ms">
              <CardContent className="testimonial-content">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="star-icon filled" />
                  ))}
                </div>
                <p className="testimonial-text">
                  "I struggled with confidence and self-doubt for years. Through Sarah's coaching, I discovered my inner strength 
                  and now lead a team of 20 people. I never thought this was possible."
                </p>
                <div className="testimonial-author">
                  <div className="author-info">
                    <h4>Michael Chen</h4>
                    <p>Team Lead, Tech Company</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="network-card testimonial-card animated fadeIn delay-500ms">
              <CardContent className="testimonial-content">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="star-icon filled" />
                  ))}
                </div>
                <p className="testimonial-text">
                  "Sarah's approach is both compassionate and results-driven. She helped me overcome anxiety and build the 
                  life I always wanted. I'm now happier and more confident than ever."
                </p>
                <div className="testimonial-author">
                  <div className="author-info">
                    <h4>Amanda Foster</h4>
                    <p>Entrepreneur</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <Badge className="section-badge">How It Works</Badge>
            <h2 className="heading-1 text-center">Your Transformation Journey</h2>
            <p className="body-large text-center">
              A proven 4-step process that has helped hundreds achieve breakthrough results.
            </p>
          </div>

          <div className="process-steps">
            <div className="process-step animated fadeIn">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3 className="heading-3">Discovery Call</h3>
                <p className="body-medium">
                  We start with a free 30-minute discovery call to understand your goals, challenges, and vision for your life.
                </p>
              </div>
            </div>

            <div className="process-step animated fadeIn delay-200ms">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3 className="heading-3">Custom Strategy</h3>
                <p className="body-medium">
                  I create a personalized coaching plan tailored to your specific needs, goals, and timeline for transformation.
                </p>
              </div>
            </div>

            <div className="process-step animated fadeIn delay-500ms">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3 className="heading-3">Weekly Sessions</h3>
                <p className="body-medium">
                  Through weekly 1-on-1 sessions, we work together to break through barriers and implement positive changes.
                </p>
              </div>
            </div>

            <div className="process-step animated fadeIn delay-700ms">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3 className="heading-3">Lasting Results</h3>
                <p className="body-medium">
                  Experience genuine transformation as you develop new habits, mindsets, and achieve your most important goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="resources-section">
        <div className="container">
          <div className="section-header">
            <Badge className="section-badge">Free Resources</Badge>
            <h2 className="heading-1 text-center">Start Your Journey Today</h2>
            <p className="body-large text-center">
              Download these powerful resources to begin your transformation right now.
            </p>
          </div>

          <div className="resources-grid">
            <Card className="network-card resource-card animated fadeIn">
              <CardHeader>
                <CardTitle className="network-card-title">Goal Setting Workbook</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="network-card-content">
                  A comprehensive guide to setting and achieving meaningful goals that align with your values.
                </CardDescription>
                <Button className="btn-primary resource-btn">
                  Download Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="network-card resource-card animated fadeIn delay-200ms">
              <CardHeader>
                <CardTitle className="network-card-title">Confidence Building Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="network-card-content">
                  7 proven strategies to build unshakeable confidence and overcome self-doubt permanently.
                </CardDescription>
                <Button className="btn-primary resource-btn">
                  Download Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="network-card resource-card animated fadeIn delay-500ms">
              <CardHeader>
                <CardTitle className="network-card-title">Life Vision Planner</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="network-card-content">
                  Create a crystal-clear vision for your ideal life and the roadmap to get there.
                </CardDescription>
                <Button className="btn-primary resource-btn">
                  Download Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <Badge className="section-badge">Get Started</Badge>
              <h2 className="heading-1">Ready to Transform Your Life?</h2>
              <p className="body-large">
                Book your free 30-minute discovery call today. No pressure, no sales pitch – just a genuine 
                conversation about your goals and how I can help you achieve them.
              </p>
              
              <div className="contact-details">
                <div className="contact-item">
                  <Phone className="contact-icon" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="contact-item">
                  <Mail className="contact-icon" />
                  <span>sarah@sarahmitchellcoaching.com</span>
                </div>
                <div className="contact-item">
                  <MapPin className="contact-icon" />
                  <span>Los Angeles, CA (Online Sessions Available)</span>
                </div>
              </div>
            </div>

            <div className="contact-form-container">
              <Card className="network-card contact-form-card">
                <CardHeader>
                  <CardTitle className="network-card-title">Book Your Free Consultation</CardTitle>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="success-message">
                      <CheckCircle className="success-icon" />
                      <h3>Thank you for your interest!</h3>
                      <p>I'll get back to you within 24 hours to schedule your free consultation.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="contact-form">
                      <div className="form-group">
                        <Input
                          type="text"
                          name="name"
                          placeholder="Your Full Name"
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
                          placeholder="Your Email Address"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <Input
                          type="tel"
                          name="phone"
                          placeholder="Your Phone Number"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <Textarea
                          name="message"
                          placeholder="Tell me about your goals and what you'd like to achieve through coaching..."
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={4}
                          className="form-textarea"
                        />
                      </div>
                      <Button type="submit" className="btn-cta form-submit">
                        Book Free Consultation
                        <Calendar className="ml-2 h-5 w-5" />
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3 className="footer-logo">Sarah Mitchell Coaching</h3>
              <p className="footer-tagline">Transforming lives, one breakthrough at a time.</p>
            </div>
            
            <div className="footer-links">
              <div className="footer-column">
                <h4>Services</h4>
                <ul>
                  <li><a href="#services">Career Coaching</a></li>
                  <li><a href="#services">Relationship Coaching</a></li>
                  <li><a href="#services">Personal Growth</a></li>
                  <li><a href="#resources">Free Resources</a></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h4>Company</h4>
                <ul>
                  <li><a href="#about">About Sarah</a></li>
                  <li><a href="#testimonials">Success Stories</a></li>
                  <li><a href="#contact">Contact</a></li>
                  <li><a href="#how-it-works">How It Works</a></li>
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