/**
 * Emerging Logistics - Dynamic Content Loader
 * 
 * This application loads all page content from json/app.json and dynamically
 * renders it into the DOM. It handles:
 * - Company information (name, contact, services, testimonials, etc.)
 * - Navigation and menu interactions
 * - Smooth scroll animations and transitions
 * - Form handling with EmailJS integration (via FormService)
 * 
 * Architecture: Single-page application (SPA) with data-driven rendering
 * Form Service: Handles contact form submission via EmailJS
 */

// App Configuration & Dynamic Content Loader
class LogisticsApp {
  constructor() {
    this.data = null;
    this.init();
  }

  // Initialize app: load data, setup UI, render content
  async init() {
    await this.loadData();
    this.setupNavigation();
    this.renderContent();
    this.setupAnimations();
  }

  /**
   * Load company data from JSON file
   * This is the single source of truth for all page content
   */
  async loadData() {
    try {
      const response = await fetch('./json/app.json');
      this.data = await response.json();
      console.log('✓ Company data loaded:', this.data);
    } catch (err) {
      console.error('✗ Failed to load json/app.json:', err);
      this.data = {};
    }
  }

  /**
   * Render all page content from JSON data
   * Updates meta tags, titles, and renders each section
   */
  renderContent() {
    if (!this.data) return;

    // Update page title and meta
    document.getElementById('pageTitle').textContent = `${this.data.name} | Professional Freight & Logistics`;
    document.getElementById('pageDesc').textContent = this.data.about || 'Professional freight & logistics solutions.';
    
    // Update Open Graph meta tags for social sharing
    document.getElementById('ogTitle').setAttribute('content', `${this.data.name} | Professional Freight & Logistics`);
    document.getElementById('ogDesc').setAttribute('content', this.data.tagline || 'Reliable freight solutions nationwide');
    document.getElementById('twitterTitle').setAttribute('content', this.data.name);
    document.getElementById('twitterDesc').setAttribute('content', this.data.tagline || 'Reliable freight solutions nationwide');
    
    document.getElementById('year').textContent = new Date().getFullYear();
    document.getElementById('footerName').textContent = this.data.name;
    document.getElementById('footerLicense').textContent = `Licensed DOT: ${this.data.dot_number} • MC: ${this.data.mc_number}`;
    if (this.data.appdev) {
      document.getElementById('appdevName').textContent = this.data.appdev.name;
      document.getElementById('appdevLink').href = `https://${this.data.appdev.url}`;
      document.getElementById('appdevLink').target = '_blank';
    }

    // Render Hero Section
    this.renderHero();

    // Render About Section
    this.renderAbout();

    // Render Services Section
    this.renderServices();

    // Render Mission Section
    this.renderMission();

    // Render Why Choose Us Section
    this.renderWhyChooseUs();

    // Render Contact Section
    this.renderContact();

    // Render Careers Section
    this.renderCareers();

    // Render Testimonials Section
    this.renderTestimonials();
  }

  /**
   * Render hero section with company tagline, truck image, and CTA buttons
   */
  renderHero() {
    const heroHtml = `
      <div class="container">
        <div class="row align-items-center g-4">
          <div class="col-lg-6">
            <h2 class="hero-company-name">${this.data.name}</h2>
            <h1 class="display-6 fw-bold">${this.data.tagline}</h1>
            <span class="badge rounded-pill mb-3">Trusted Trucking • ${this.data.business_scope}</span>
            <p class="text-muted mb-4">${this.data.about}</p>
            <div class="d-flex gap-2 flex-wrap">
              <a class="btn btn-primary btn-lg" href="#contact">Request Quote</a>
              <a class="btn btn-outline-secondary btn-lg" href="#services">Our Services</a>
            </div>
          </div>
          <div class="col-lg-6 d-flex justify-content-center align-items-center">
            <img src="./img/el_truck1.jpg" alt="Delivery Truck" class="hero-truck-image">
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-lg-6 mx-auto">
            <div class="card shadow-sm contact-card">
              <div class="card-body">
                <h5 class="card-title mb-3"><i class="bi bi-telephone me-2 text-primary"></i>Get in Touch</h5>
                <p class="mb-1"><strong>Phone:</strong> <a href="tel:${this.data.contact.phone.replace(/\D/g, '')}">${this.data.contact.phone}</a></p>
                <p class="mb-1"><strong>Email:</strong> <a href="mailto:${this.data.contact.email}">${this.data.contact.email}</a></p>
                <p class="mb-0"><strong>Address:</strong> ${this.data.contact.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.getElementById('heroSection').innerHTML = heroHtml;
  }

  /**
   * Render about section with company description and key details (DOT, MC, Service Area)
   */
  renderAbout() {
    const aboutHtml = `
      <div class="row">
        <div class="col-lg-8">
          <h2 class="h4 section-title"><i class="bi bi-info-circle text-primary me-2"></i>About ${this.data.name}</h2>
          <p class="text-muted">${this.data.about}</p>
        </div>
        <div class="col-lg-4">
          <ul class="list-unstyled features">
            <li><i class="bi bi-globe text-muted me-2"></i> Service Area: ${this.data.business_scope}</li>
            <li><i class="bi bi-upc-scan text-muted me-2"></i> DOT: ${this.data.dot_number}</li>
            <li><i class="bi bi-briefcase text-muted me-2"></i> MC: ${this.data.mc_number}</li>
          </ul>
        </div>
      </div>
    `;
    document.getElementById('about').innerHTML = aboutHtml;
  }

  /**
   * Render services section with list of service offerings
   * Displays truck image alongside service cards
   */
  renderServices() {
    const servicesHtml = `
      <div class="row mb-4 align-items-center">
        <div class="col-lg-6">
          <h3 class="h5 section-title mb-4"><i class="bi bi-box-seam text-primary me-2"></i>Our Services</h3>
          <div class="row g-3">
            ${this.data.services.map(service => `
              <div class="col-md-6 col-lg-12">
                <div class="card card-service h-100">
                  <div class="card-body d-flex flex-column">
                    <div class="mb-3">
                      <i class="bi bi-${service.icon} service-icon"></i>
                    </div>
                    <h5 class="card-title">${service.name}</h5>
                    <p class="card-text text-muted">${service.description}</p>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="col-lg-6 d-flex justify-content-center align-items-center mt-4 mt-lg-0">
          <img src="./img/el_truck2.jpg" alt="Logistics Services" class="services-truck-image">
        </div>
      </div>
    `;
    document.getElementById('services').innerHTML = servicesHtml;
  }

  /**
   * Render mission statement section
   */
  renderMission() {
    const missionHtml = `
      <h3 class="h5 section-title"><i class="bi bi-target text-primary me-2"></i>Our Mission</h3>
      <p class="text-muted">${this.data.mission}</p>
    `;
    document.getElementById('mission').innerHTML = missionHtml;
  }

  /**
   * Render why choose us section with key differentiators
   */
  renderWhyChooseUs() {
    const whyHtml = `
      <h3 class="h5 section-title"><i class="bi bi-award text-primary me-2"></i>Why Choose Us</h3>
      <div class="row">
        ${this.data.why_choose_us.map((item, idx) => `
          <div class="col-md-6">
            <div class="mb-3">
              <h6 class="fw-bold"><i class="bi bi-${item.icon} text-primary me-2"></i>${item.title}</h6>
              <p class="text-muted small">${item.description}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    document.getElementById('why').innerHTML = whyHtml;
  }

  /**
   * Render contact section with contact info and contact form
   * Form is handled by FormService with EmailJS integration
   */
  renderContact() {
    const contactHtml = `
      <h3 class="h5 section-title"><i class="bi bi-chat-dots text-primary me-2"></i>Contact Us</h3>
      <div class="row">
        <div class="col-md-6">
          <p class="mb-1"><strong>Phone:</strong> <a href="tel:${this.data.contact.phone.replace(/\D/g, '')}">${this.data.contact.phone}</a></p>
          <p class="mb-1"><strong>Email:</strong> <a href="mailto:${this.data.contact.email}">${this.data.contact.email}</a></p>
          <p class="mb-0"><strong>Address:</strong> ${this.data.contact.address}</p>
        </div>
        <div class="col-md-6">
          <form id="contactForm" name="contactForm">
            <div class="mb-3">
              <label class="form-label">Name</label>
              <input type="text" class="form-control" name="name" placeholder="Your name" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" name="email" placeholder="you@example.com" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Phone</label>
              <input type="tel" class="form-control" name="phone" placeholder="(optional)">
            </div>
            <div class="mb-3">
              <label class="form-label">Message</label>
              <textarea class="form-control" name="message" rows="3" placeholder="How can we help?" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Send Message</button>
          </form>
        </div>
      </div>
    `;
    document.getElementById('contact').innerHTML = contactHtml;
  }

  /**
   * Render careers section with job opportunities
   */
  renderCareers() {
    const careersHtml = `
      <h3 class="h5 section-title"><i class="bi bi-people-fill text-primary me-2"></i>Join Our Team</h3>
      <p class="text-muted">${this.data.careers}</p>
    `;
    document.getElementById('careers').innerHTML = careersHtml;
  }

  /**
   * Render testimonials section with client feedback and star ratings
   */
  renderTestimonials() {
    const testimonialsHtml = `
      <h3 class="h5 section-title mb-4"><i class="bi bi-chat-quote text-primary me-2"></i>What Our Clients Say</h3>
      <div class="row g-3">
        ${this.data.testimonials.map(testimonial => `
          <div class="col-md-6 col-lg-4">
            <div class="card card-testimonial h-100">
              <div class="card-body">
                <div class="mb-2">
                  ${Array(testimonial.rating).fill('<i class="bi bi-star-fill text-warning"></i>').join('')}
                </div>
                <p class="card-text text-muted mb-3">"${testimonial.quote}"</p>
                <p class="card-text fw-bold mb-0"><small>– ${testimonial.author}, ${testimonial.company}</small></p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    document.getElementById('testimonials').innerHTML = testimonialsHtml;
  }

  /**
   * Setup navigation interactions
   * Handles mobile menu toggle, smooth scrolling, and return-to-top button visibility
   */
  setupNavigation() {
    // Mobile menu toggle with X icon
    const toggler = document.querySelector('.navbar-toggler');
    const closeIcon = document.querySelector('.navbar-close-icon');
    const hamburgerIcon = document.querySelector('.navbar-toggler-icon');
    const nav = document.getElementById('navMenu');
    if (!toggler || !nav || !closeIcon || !hamburgerIcon) return;

    // Hide X icon by default, show hamburger
    closeIcon.style.display = 'none';

    // Helper function to close menu
    const closeMenu = () => {
      nav.classList.remove('show');
      toggler.setAttribute('aria-expanded', 'false');
      hamburgerIcon.style.display = 'block';
      closeIcon.style.display = 'none';
    };

    // Helper function to open menu
    const openMenu = () => {
      nav.classList.add('show');
      toggler.setAttribute('aria-expanded', 'true');
      hamburgerIcon.style.display = 'none';
      closeIcon.style.display = 'block';
    };

    toggler.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = nav.classList.contains('show');
      
      if (isOpen) {
        closeMenu();
        console.log('📱 Mobile menu CLOSED (hamburger clicked)');
      } else {
        openMenu();
        console.log('📱 Mobile menu OPENED');
      }
    });

    // Close menu when clicking a nav link
    document.querySelectorAll('#navMenu .nav-link').forEach(link => {
      link.addEventListener('click', function() {
        closeMenu();
        console.log('📱 Mobile menu CLOSED (nav link clicked)');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.navbar') && nav.classList.contains('show')) {
        closeMenu();
        console.log('📱 Mobile menu CLOSED (clicked outside)');
      }
    });

    window.addEventListener('resize', function(){
      if (window.innerWidth >= 992 && nav.classList.contains('show')){
        nav.classList.remove('show');
        toggler.setAttribute('aria-expanded', false);
      }
    });

    // Show/hide return to top button on scroll
    const returnToTopBtn = document.getElementById('returnToTopBtn');
    if (returnToTopBtn) {
      let scrollTimeout;
      const handleScroll = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          if (window.scrollY > 400) {
            if (returnToTopBtn.style.display !== 'block') {
              returnToTopBtn.style.display = 'block';
            }
          } else {
            if (returnToTopBtn.style.display !== 'none') {
              returnToTopBtn.style.display = 'none';
            }
          }
        }, 10);
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      // Initial check
      handleScroll();
    }

    // Smooth scroll links and close mobile menu on click (with event delegation for dynamic content)
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      
      const href = anchor.getAttribute('href');
      const targetElement = document.querySelector(href);
      
      if (href !== '#' && targetElement) {
        e.preventDefault();
        
        // Remove hash from URL for all links
        window.history.replaceState(null, '', window.location.pathname);
        
        // Then scroll smoothly
        targetElement.scrollIntoView({behavior: 'smooth'});
        
        // Close mobile menu after clicking a link
        if (window.innerWidth < 992 && nav.classList.contains('show')) {
          nav.classList.remove('show');
          toggler.setAttribute('aria-expanded', false);
          hamburgerIcon.style.display = 'block';
          closeIcon.style.display = 'none';
          console.log('📱 Mobile menu CLOSED (nav link clicked)');
        }
      }
    });
  }

  /**
   * Setup scroll animations and fade-in effects
   * Uses IntersectionObserver for performance-optimized scroll-triggered animations
   */
  setupAnimations() {
    // Add fade-in animation on page load
    window.addEventListener('load', function() {
      document.querySelectorAll('.hero, .card, section').forEach((el, idx) => {
        el.style.opacity = '0';
        el.style.animation = `fadeIn 0.6s ease-in-out ${idx * 0.08}s forwards`;
      });
    });

    // Scroll-triggered animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeIn 0.6s ease-in-out forwards';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('section, .card').forEach(el => {
      if (window.scrollY === 0) observer.observe(el);
    });
  }
}

/**
 * App Initialization
 * Runs when DOM is ready:
 * 1. Create LogisticsApp instance (loads data, renders content)
 * 2. Initialize FormService for contact form handling with EmailJS
 */
document.addEventListener('DOMContentLoaded', () => {
  const app = new LogisticsApp();
  
  // Wait for form to be rendered, then initialize FormService
  setTimeout(() => {
    const formService = new FormService({
      recipientEmail: 'femithetchguy@gmail.com',
      formSelector: '#contactForm',
      emailJSServiceId: 'service_fttg_gmail',
      emailJSTemplateId: 'template_fttg',
      emailJSPublicKey: 'ANmN0gWxEnEHgUCXx'
    });
    formService.init();
  }, 100);
});

/**
 * Handle logo click animation
 * Adds pulse animation class and scrolls to top smoothly
 */
function handleLogoClick(event) {
  event.preventDefault();
  const logo = document.querySelector('.navbar-logo');
  
  // Remove animation class if it exists
  logo.classList.remove('logo-click-pulse');
  
  // Trigger reflow to restart animation
  void logo.offsetWidth;
  
  // Add animation class
  logo.classList.add('logo-click-pulse');
  
  // Scroll to top smoothly
  window.scrollTo({top: 0, behavior: 'smooth'});
}
