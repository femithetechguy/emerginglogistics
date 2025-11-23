// App Configuration & Dynamic Content Loader
class LogisticsApp {
  constructor() {
    this.data = null;
    this.init();
  }

  async init() {
    await this.loadData();
    this.setupNavigation();
    this.renderContent();
    this.setupAnimations();
    this.setupFormHandling();
  }

  async loadData() {
    try {
      const response = await fetch('/json/app.json');
      this.data = await response.json();
      console.log('✓ Company data loaded:', this.data);
    } catch (err) {
      console.error('✗ Failed to load json/app.json:', err);
      this.data = {};
    }
  }

  renderContent() {
    if (!this.data) return;

    // Update page title and meta
    document.getElementById('pageTitle').textContent = `${this.data.name} | Professional Freight & Logistics`;
    document.getElementById('pageDesc').textContent = this.data.about || 'Professional freight & logistics solutions.';
    document.getElementById('brandName').textContent = this.data.name;
    document.getElementById('year').textContent = new Date().getFullYear();
    document.getElementById('footerName').textContent = this.data.name;
    document.getElementById('footerLicense').textContent = `Licensed DOT: ${this.data.dot_number} • MC: ${this.data.mc_number}`;

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

  renderHero() {
    const heroHtml = `
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-7">
            <span class="badge rounded-pill mb-3">Trusted Trucking • ${this.data.location}</span>
            <h1 class="display-6 fw-bold">${this.data.tagline}</h1>
            <p class="text-muted mb-4">${this.data.about}</p>
            <div class="d-flex gap-2">
              <a class="btn btn-primary btn-lg" href="#contact">Request Quote</a>
              <a class="btn btn-outline-secondary btn-lg" href="#services">Our Services</a>
            </div>
          </div>
          <div class="col-lg-5 mt-4 mt-lg-0">
            <div class="card shadow-sm">
              <div class="card-body">
                <h5 class="card-title mb-3"><i class="bi bi-telephone me-2 text-primary"></i>Contact</h5>
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

  renderAbout() {
    const aboutHtml = `
      <div class="row">
        <div class="col-lg-8">
          <h2 class="h4 section-title"><i class="bi bi-info-circle text-primary me-2"></i>About ${this.data.name}</h2>
          <p class="text-muted">${this.data.about}</p>
        </div>
        <div class="col-lg-4">
          <ul class="list-unstyled features">
            <li><i class="bi bi-check-circle-fill text-success me-2"></i> Founded: ${this.data.founded}</li>
            <li><i class="bi bi-upc-scan text-muted me-2"></i> DOT: ${this.data.dot_number}</li>
            <li><i class="bi bi-briefcase text-muted me-2"></i> MC: ${this.data.mc_number}</li>
          </ul>
        </div>
      </div>
    `;
    document.getElementById('about').innerHTML = aboutHtml;
  }

  renderServices() {
    const servicesHtml = `
      <h3 class="h5 section-title mb-4"><i class="bi bi-box-seam text-primary me-2"></i>Our Services</h3>
      <div class="row g-3">
        ${this.data.services.map(service => `
          <div class="col-md-6 col-lg-3">
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
    `;
    document.getElementById('services').innerHTML = servicesHtml;
  }

  renderMission() {
    const missionHtml = `
      <h3 class="h5 section-title"><i class="bi bi-target text-primary me-2"></i>Our Mission</h3>
      <p class="text-muted">${this.data.mission}</p>
    `;
    document.getElementById('mission').innerHTML = missionHtml;
  }

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
          <form id="contactForm" method="POST" action="https://formspree.io/f/myzewodq">
            <div class="mb-3">
              <label class="form-label">Name</label>
              <input type="text" class="form-control" name="name" placeholder="Your name" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" name="email" placeholder="you@example.com" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Message</label>
              <textarea class="form-control" name="message" rows="3" placeholder="How can we help?" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Send</button>
          </form>
        </div>
      </div>
    `;
    document.getElementById('contact').innerHTML = contactHtml;
  }

  renderCareers() {
    const careersHtml = `
      <h3 class="h5 section-title"><i class="bi bi-people-fill text-primary me-2"></i>Join Our Team</h3>
      <p class="text-muted">${this.data.careers}</p>
    `;
    document.getElementById('careers').innerHTML = careersHtml;
  }

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

  setupNavigation() {
    // Mobile menu toggle
    const toggler = document.querySelector('.navbar-toggler');
    const nav = document.getElementById('navMenu');
    if (!toggler || !nav) return;

    toggler.addEventListener('click', function(e){
      nav.classList.toggle('show');
      var expanded = nav.classList.contains('show');
      toggler.setAttribute('aria-expanded', expanded);
      try {
        if (typeof bootstrap !== 'undefined' && bootstrap.Collapse){
          var bs = bootstrap.Collapse.getInstance(nav) || new bootstrap.Collapse(nav, {toggle: false});
        }
      } catch(err){}
    });

    window.addEventListener('resize', function(){
      if (window.innerWidth >= 992 && nav.classList.contains('show')){
        nav.classList.remove('show');
        toggler.setAttribute('aria-expanded', false);
      }
    });

    // Smooth scroll links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
          e.preventDefault();
          document.querySelector(href).scrollIntoView({behavior: 'smooth'});
        }
      });
    });
  }

  setupFormHandling() {
    // Delayed form handling (since it's rendered after init)
    setTimeout(() => {
      const contactForm = document.getElementById('contactForm');
      if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
          e.preventDefault();
          
          const formData = new FormData(contactForm);
          const submitBtn = contactForm.querySelector('button[type="submit"]');
          const originalText = submitBtn.textContent;
          
          submitBtn.textContent = 'Sending...';
          submitBtn.disabled = true;
          
          fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {'Accept': 'application/json'}
          })
          .then(res => {
            if (res.ok) {
              alert('✓ Thanks! Your message has been sent. We\'ll get back to you soon.');
              contactForm.reset();
            } else {
              alert('✗ Error sending message. Please try again.');
            }
          })
          .catch(err => alert('✗ Error: ' + err.message))
          .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          });
        });
      }
    }, 100);
  }

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

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new LogisticsApp();
});
