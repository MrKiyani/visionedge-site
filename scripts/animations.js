/**
 * Animation and visual effects
 */

export function initializeAnimations() {
  // Counter animation for hero stats with responsive timing
  const counters = document.querySelectorAll('.hero__stat-number');
  
  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
      const duration = window.innerWidth < 768 ? 100 : 150; // Faster on mobile
      const increment = target / duration;
      let current = 0;
      
      const updateCounter = () => {
        if (current < target) {
          current += increment;
          if (counter.textContent.includes('%')) {
            counter.textContent = Math.ceil(current) + '%';
          } else if (counter.textContent.includes('+')) {
            counter.textContent = Math.ceil(current) + '+';
          } else if (counter.textContent.includes('/')) {
            counter.textContent = counter.textContent; // Keep original format
          } else {
            counter.textContent = Math.ceil(current);
          }
          requestAnimationFrame(updateCounter);
        } else {
          // Reset to original format
          counter.textContent = counter.getAttribute('data-original') || counter.textContent;
        }
      };
      
      // Store original value
      counter.setAttribute('data-original', counter.textContent);
      updateCounter();
    });
  }

  // Trigger counter animation when hero section is visible
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(animateCounters, window.innerWidth < 768 ? 400 : 800);
          heroObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    heroObserver.observe(heroSection);
  }

  // Floating cards animation with responsive adjustments
  const floatingCards = document.querySelectorAll('.hero__floating-card');
  floatingCards.forEach((card, index) => {
    const delay = index * 1.5;
    const duration = window.innerWidth < 768 ? 6 : 8 + index * 2;
    
    card.style.animationDelay = `${delay}s`;
    card.style.animationDuration = `${duration}s`;
  });
}

export function initializeIntersectionObserver() {
  // Reveal elements on scroll with responsive thresholds
  const revealElements = document.querySelectorAll('.service__card, .portfolio__item, .testimonial__card, .blog__card');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: window.innerWidth < 768 ? 0.05 : 0.1,
    rootMargin: window.innerWidth < 768 ? '0px 0px -20px 0px' : '0px 0px -30px 0px'
  });

  revealElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = `translateY(${window.innerWidth < 768 ? '30px' : '50px'})`;
    element.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    revealObserver.observe(element);
  });
}