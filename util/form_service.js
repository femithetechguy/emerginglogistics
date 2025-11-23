/**
 * FormService - Email Form Handler with EmailJS
 * 
 * Handles form submissions with client-side validation and EmailJS integration.
 * Sign up at https://www.emailjs.com/ (free tier: 200 emails/month)
 */

class FormService {
  constructor(config = {}) {
    this.recipientEmail = config.recipientEmail || 'femithetchguy@gmail.com';
    this.formSelector = config.formSelector || 'form[name="contactForm"]';
    this.submitButtonSelector = config.submitButtonSelector || 'button[type="submit"]';
    
    // EmailJS configuration
    this.emailJSServiceId = config.emailJSServiceId;
    this.emailJSTemplateId = config.emailJSTemplateId;
    this.emailJSPublicKey = config.emailJSPublicKey;
    
    if (!this.emailJSServiceId || !this.emailJSTemplateId || !this.emailJSPublicKey) {
      console.error('FormService: Missing EmailJS credentials. Check config.');
    }
    
    // Validation rules
    this.requiredFields = config.requiredFields || ['name', 'email', 'message'];
    this.emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // UI feedback
    this.showLoadingSpinner = config.showLoadingSpinner !== false;
    this.successMessage = config.successMessage || 'We\'ll get back to you soon.';
    this.errorMessage = config.errorMessage || 'Failed to send message. Please try again.';
    
    this.form = null;s
    this.submitButton = null;
    this.originalButtonText = '';
  }

  /**
   * Initialize form service
   */
  init() {
    this.form = document.querySelector(this.formSelector);
    if (!this.form) {
      console.warn(`Form not found with selector: ${this.formSelector}`);
      return;
    }

    this.submitButton = this.form.querySelector(this.submitButtonSelector);
    if (this.submitButton) {
      this.originalButtonText = this.submitButton.textContent;
    }

    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  /**
   * Validate form data
   */
  validateForm(formData) {
    const errors = [];

    // Check required fields
    for (const field of this.requiredFields) {
      if (!formData.get(field) || formData.get(field).trim() === '') {
        errors.push(`${this.capitalize(field)} is required`);
      }
    }

    // Validate email format
    const email = formData.get('email');
    if (email && !this.emailPattern.test(email)) {
      errors.push('Please enter a valid email address');
    }

    // Validate message length
    const message = formData.get('message');
    if (message && message.trim().length < 10) {
      errors.push('Message must be at least 10 characters long');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Handle form submission
   */
  async handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(this.form);
    const validation = this.validateForm(formData);

    if (!validation.isValid) {
      this.showError(validation.errors.join('\n'));
      return;
    }

    this.setLoadingState(true);

    try {
      await this.sendViaEmailJS(formData);
      this.showSuccess(this.successMessage);
      this.form.reset();
    } catch (error) {
      console.error('Form submission error:', error);
      this.showError(error.message || this.errorMessage);
    } finally {
      this.setLoadingState(false);
    }
  }

  /**
   * Send email via EmailJS
   */
  async sendViaEmailJS(formData) {
    // Check if EmailJS is loaded
    if (typeof emailjs === 'undefined' || !window.emailjs) {
      throw new Error('EmailJS library not loaded. Please refresh the page.');
    }

    const templateParams = {
      to_email: this.recipientEmail,
      from_name: formData.get('name'),
      from_email: formData.get('email'),
      phone: formData.get('phone') || 'Not provided',
      message: formData.get('message'),
      reply_to: formData.get('email')
    };

    try {
      const response = await emailjs.send(
        this.emailJSServiceId,
        this.emailJSTemplateId,
        templateParams
      );
      console.log('✓ Email sent successfully:', response);
      return response;
    } catch (error) {
      console.error('✗ EmailJS error:', error);
      throw new Error(`EmailJS error: ${error.message || error.text}`);
    }
  }

  /**
   * Set loading state on submit button
   */
  setLoadingState(isLoading) {
    if (!this.submitButton) return;

    if (isLoading) {
      this.submitButton.disabled = true;
      this.submitButton.innerHTML = this.showLoadingSpinner
        ? `<span class="spinner-border spinner-border-sm me-2"></span>Sending...`
        : 'Sending...';
    } else {
      this.submitButton.disabled = false;
      this.submitButton.textContent = this.originalButtonText;
    }
  }

  /**
   * Show success message
   */
  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  /**
   * Show error message
   */
  showError(message) {
    this.showNotification(message, 'danger');
  }

  /**
   * Display notification alert with enhanced styling
   */
  showNotification(message, type = 'info') {
    // Create alert container if it doesn't exist
    let alertContainer = this.form.parentElement.querySelector('.form-alerts');
    if (!alertContainer) {
      alertContainer = document.createElement('div');
      alertContainer.className = 'form-alerts';
      this.form.parentElement.insertBefore(alertContainer, this.form);
    }

    // Create alert element with enhanced UI
    const alertId = `alert-${Date.now()}`;
    const alert = document.createElement('div');
    alert.id = alertId;
    
    if (type === 'success') {
      alert.className = 'border-0 shadow-lg alert alert-success alert-dismissible fade show';
      alert.role = 'alert';
      alert.innerHTML = `
        <div class="d-flex align-items-center">
          <i class="bi bi-check-circle-fill me-3" style="font-size: 1.5rem;"></i>
          <div>
            <h5 class="alert-heading mb-1">Message Sent Successfully! ✓</h5>
            <p class="mb-0">${message}</p>
          </div>
          <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `;
    } else {
      alert.className = 'border-0 shadow-lg alert alert-danger alert-dismissible fade show';
      alert.role = 'alert';
      alert.innerHTML = `
        <div class="d-flex align-items-center">
          <i class="bi bi-exclamation-circle-fill me-3" style="font-size: 1.5rem;"></i>
          <div>
            <h5 class="alert-heading mb-1">Error Sending Message</h5>
            <p class="mb-0">${message}</p>
          </div>
          <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `;
    }

    alertContainer.appendChild(alert);

    // Auto-dismiss success messages after 6 seconds
    if (type === 'success') {
      setTimeout(() => {
        const el = document.getElementById(alertId);
        if (el) {
          const bsAlert = new bootstrap.Alert(el);
          bsAlert.close();
        }
      }, 6000);
    }
  }

  /**
   * Utility: Capitalize first letter
   */
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Export for use in modules or global scope
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FormService;
}
