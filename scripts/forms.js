/**
 * Form handling and validation with FormSubmit backend
 */

export function initializeFormHandling() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Validate form with responsive feedback
      if (!validateForm(this)) {
        return;
      }
      
      // Get form data
      const formData = new FormData(this);
      
      // Add loading state
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;
      submitButton.classList.add('loading');
      
      try {
        // Submit to FormSubmit - completely free, no signup required
        const response = await fetch('https://formsubmit.co/info@visionedge.tech', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          // Success feedback
          showNotification('✅ Message sent! We\'ll get back to you shortly.', 'success');
          
          // Reset form
          this.reset();
          
          // Clear any validation states
          const inputs = this.querySelectorAll('.form__input');
          inputs.forEach(input => {
            input.classList.remove('valid', 'invalid');
            clearInputError(input);
          });
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        console.error('Form submission error:', error);
        showNotification('❌ Failed to send message. Please try again or contact us directly.', 'error');
      } finally {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
      }
    });
  }

  // Form validation with responsive error display
  const formInputs = document.querySelectorAll('.form__input');
  formInputs.forEach(input => {
    input.addEventListener('blur', validateInput);
    input.addEventListener('input', clearValidation);
    
    // Add responsive input handling
    if (window.innerWidth < 768) {
      input.addEventListener('focus', function() {
        // Scroll input into view on mobile
        setTimeout(() => {
          this.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      });
    }
  });
}

function validateForm(form) {
  const inputs = form.querySelectorAll('.form__input[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!validateInput({ target: input })) {
      isValid = false;
    }
  });
  
  return isValid;
}

function validateInput(e) {
  const input = e.target;
  const value = input.value.trim();
  
  // Remove existing validation classes
  input.classList.remove('valid', 'invalid');
  
  // Email validation
  if (input.type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      input.classList.add('invalid');
      showInputError(input, 'Please enter a valid email address');
      return false;
    }
  }
  
  // Required field validation
  if (input.hasAttribute('required') && !value) {
    input.classList.add('invalid');
    showInputError(input, 'This field is required');
    return false;
  }
  
  // Success state
  if (value) {
    input.classList.add('valid');
    clearInputError(input);
  }
  
  return true;
}

function clearValidation(e) {
  const input = e.target;
  input.classList.remove('valid', 'invalid');
  clearInputError(input);
}

function showInputError(input, message) {
  clearInputError(input);
  
  const errorElement = document.createElement('span');
  errorElement.className = 'form__error';
  errorElement.textContent = message;
  errorElement.style.cssText = `
    color: #ef4444;
    font-size: ${window.innerWidth < 768 ? '0.75rem' : '0.875rem'};
    margin-top: 0.25rem;
    display: block;
    animation: fadeIn 0.3s ease-in-out;
  `;
  
  input.parentNode.appendChild(errorElement);
}

function clearInputError(input) {
  const errorElement = input.parentNode.querySelector('.form__error');
  if (errorElement) {
    errorElement.remove();
  }
}

function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.innerHTML = `
    <div class="notification__content">
      <span class="notification__message">${message}</span>
      <button class="notification__close" aria-label="Close notification">&times;</button>
    </div>
  `;
  
  // Responsive positioning and styling
  const isMobile = window.innerWidth < 768;
  notification.style.cssText = `
    position: fixed;
    top: ${isMobile ? '10px' : '20px'};
    right: ${isMobile ? '10px' : '20px'};
    left: ${isMobile ? '10px' : 'auto'};
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    padding: ${isMobile ? '0.75rem 1rem' : '1rem 1.5rem'};
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    transform: translateY(-100%);
    transition: transform 0.3s ease-in-out;
    max-width: ${isMobile ? 'calc(100vw - 20px)' : '400px'};
    font-size: ${isMobile ? '0.875rem' : '1rem'};
  `;
  
  // Add to DOM
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateY(0)';
  }, 100);
  
  // Close button functionality
  const closeButton = notification.querySelector('.notification__close');
  closeButton.style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0;
    margin-left: 1rem;
    min-width: 24px;
    min-height: 24px;
  `;
  
  closeButton.addEventListener('click', () => {
    notification.style.transform = 'translateY(-100%)';
    setTimeout(() => notification.remove(), 300);
  });
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.transform = 'translateY(-100%)';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}