/**
 * Utility functions and helpers
 */

// Throttle function for performance optimization
export function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Debounce function for performance optimization
export function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Smooth scroll to element with responsive offset
export function scrollToElement(element, offset = 0) {
  const header = document.getElementById('header');
  const headerHeight = header ? header.offsetHeight : 0;
  const extraOffset = window.innerWidth < 768 ? 20 : 40;
  const elementPosition = element.offsetTop - headerHeight - extraOffset - offset;
  
  window.scrollTo({
    top: Math.max(0, elementPosition),
    behavior: 'smooth'
  });
}

// Check if element is in viewport with responsive threshold
export function isInViewport(element, threshold = 0.1) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  return (
    rect.top >= -rect.height * threshold &&
    rect.left >= -rect.width * threshold &&
    rect.bottom <= windowHeight + rect.height * threshold &&
    rect.right <= windowWidth + rect.width * threshold
  );
}

// Responsive features and optimizations
export function initializeResponsiveFeatures() {
  // Handle window resize
  window.addEventListener('resize', debounce(handleResize, 250));
  
  // Handle orientation change
  window.addEventListener('orientationchange', function() {
    setTimeout(handleResize, 100);
  });
  
  // Initial setup
  handleResize();
}

function handleResize() {
  // Update viewport height for mobile browsers
  updateViewportHeight();
  
  // Recalculate floating card positions
  updateFloatingCards();
  
  // Update grid layouts
  updateGridLayouts();
}

function updateViewportHeight() {
  // Fix for mobile browsers where 100vh doesn't account for address bar
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

function updateFloatingCards() {
  const floatingCards = document.querySelectorAll('.hero__floating-card');
  const heroVisual = document.querySelector('.hero__visual');
  
  if (!heroVisual) return;
  
  const isMobile = window.innerWidth < 768;
  
  floatingCards.forEach((card, index) => {
    if (isMobile) {
      // Adjust positions for mobile
      const positions = [
        { top: '10%', left: '2%' },
        { top: '20%', right: '5%' },
        { bottom: '35%', left: '8%' },
        { top: '65%', right: '2%' },
        { bottom: '10%', right: '20%' }
      ];
      
      if (positions[index]) {
        Object.assign(card.style, positions[index]);
      }
    }
  });
}

function updateGridLayouts() {
  // Dynamic grid adjustments based on content and screen size
  const grids = document.querySelectorAll('.services__grid, .portfolio__grid, .testimonials__grid, .blog__grid');
  
  grids.forEach(grid => {
    const items = grid.children.length;
    const breakpoint = getBreakpoint();
    
    // Adjust grid columns based on item count and breakpoint
    if (breakpoint === 'xs') {
      grid.style.gridTemplateColumns = '1fr';
    } else if (breakpoint === 'sm') {
      grid.style.gridTemplateColumns = items >= 2 ? 'repeat(2, 1fr)' : '1fr';
    } else if (breakpoint === 'md') {
      grid.style.gridTemplateColumns = items >= 3 ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(300px, 1fr))';
    } else if (breakpoint === 'lg') {
      grid.style.gridTemplateColumns = items >= 4 ? 'repeat(3, 1fr)' : 'repeat(auto-fit, minmax(300px, 1fr))';
    } else {
      // xl and above
      const maxCols = grid.classList.contains('services__grid') ? 4 : 3;
      const cols = Math.min(items, maxCols);
      grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    }
  });
}

function getBreakpoint() {
  const width = window.innerWidth;
  if (width >= 1920) return 'xxl';
  if (width >= 1440) return 'xl';
  if (width >= 1024) return 'lg';
  if (width >= 768) return 'md';
  if (width >= 576) return 'sm';
  return 'xs';
}

// Touch optimizations
export function initializeTouchOptimizations() {
  // Ensure touch targets are at least 44px
  const touchElements = document.querySelectorAll('.btn, .nav__link, .footer__link, .legal-nav__link');
  
  touchElements.forEach(element => {
    const rect = element.getBoundingClientRect();
    if (rect.height < 44 || rect.width < 44) {
      element.style.minHeight = '44px';
      element.style.minWidth = '44px';
      element.style.display = 'flex';
      element.style.alignItems = 'center';
      element.style.justifyContent = 'center';
    }
  });
  
  // Add touch feedback
  addTouchFeedback();
  
  // Optimize scroll performance on touch devices
  if ('ontouchstart' in window) {
    optimizeScrollForTouch();
  }
}

function addTouchFeedback() {
  const interactiveElements = document.querySelectorAll('.btn, .nav__link, .service__card, .portfolio__item, .testimonial__card, .blog__card');
  
  interactiveElements.forEach(element => {
    element.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.98)';
    }, { passive: true });
    
    element.addEventListener('touchend', function() {
      this.style.transform = '';
    }, { passive: true });
    
    element.addEventListener('touchcancel', function() {
      this.style.transform = '';
    }, { passive: true });
  });
}

function optimizeScrollForTouch() {
  // Use passive event listeners for better scroll performance
  document.addEventListener('touchstart', function() {}, { passive: true });
  document.addEventListener('touchmove', function() {}, { passive: true });
  
  // Prevent zoom on double tap for specific elements
  const preventZoomElements = document.querySelectorAll('.btn, .form__input');
  preventZoomElements.forEach(element => {
    element.addEventListener('touchend', function(e) {
      e.preventDefault();
      this.click();
    });
  });
}

// Performance optimizations
export function initializePerformanceOptimizations() {
  // Lazy load images
  initializeLazyLoading();
  
  // Preload critical resources
  preloadCriticalResources();
  
  // Optimize animations
  optimizeAnimations();
  
  // Reduce motion for users who prefer it
  respectReducedMotion();
}

function initializeLazyLoading() {
  // Use Intersection Observer for lazy loading
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      img.loading = 'lazy';
      imageObserver.observe(img);
    });
  }
}

function preloadCriticalResources() {
  const criticalImages = [
    'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

function optimizeAnimations() {
  // Use requestAnimationFrame for smooth animations
  const animatedElements = document.querySelectorAll('.hero__floating-card');
  
  animatedElements.forEach(element => {
    element.style.willChange = 'transform';
  });
  
  // Clean up will-change after animations
  setTimeout(() => {
    animatedElements.forEach(element => {
      element.style.willChange = 'auto';
    });
  }, 5000);
}

function respectReducedMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable animations for users who prefer reduced motion
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `;
    document.head.appendChild(style);
  }
}