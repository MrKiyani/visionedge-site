/**
 * Scroll effects and functionality
 */

export function initializeScrollEffects() {
  const header = document.getElementById('header');
  const heroSection = document.querySelector('.hero');
  
  function handleScroll() {
    const currentScrollY = window.pageYOffset;
    
    // Get hero section height
    const heroHeight = heroSection ? heroSection.offsetHeight : 0;
    
    // Apply glassmorphism effect when scrolled past hero section
    if (currentScrollY > heroHeight - 100) {
      header.classList.add('scroll-header');
    } else {
      header.classList.remove('scroll-header');
    }
    
    // Parallax effect for hero section (disabled on mobile for performance)
    if (window.innerWidth > 768 && heroSection) {
      const scrolled = currentScrollY;
      const parallaxSpeed = 0.2;
      heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
    
    scrollY = currentScrollY;
  }

  // Throttled scroll event for better performance
  window.addEventListener('scroll', throttle(handleScroll, 16), { passive: true });
}

export function initializeBackToTop() {
  const backToTopButton = document.getElementById('backToTop');
  
  if (!backToTopButton) return;
  
  // Show/hide button based on scroll position with responsive threshold
  function toggleBackToTop() {
    const threshold = window.innerHeight * 0.5; // Show after scrolling half viewport
    if (window.pageYOffset > threshold) {
      backToTopButton.classList.add('show');
    } else {
      backToTopButton.classList.remove('show');
    }
  }
  
  // Enhanced smooth scroll to top with easing
  function scrollToTop() {
    const scrollDuration = window.innerWidth < 768 ? 800 : 1200;
    const scrollHeight = window.scrollY;
    const scrollStep = Math.PI / (scrollDuration / 15);
    const cosParameter = scrollHeight / 2;
    let scrollCount = 0;
    let scrollMargin;
    
    function scrollAnimation() {
      scrollCount = scrollCount + 1;
      scrollMargin = cosParameter - cosParameter * Math.cos(scrollCount * scrollStep);
      window.scrollTo(0, (scrollHeight - scrollMargin));
      
      if (scrollCount * scrollStep < Math.PI) {
        requestAnimationFrame(scrollAnimation);
      }
    }
    
    requestAnimationFrame(scrollAnimation);
  }
  
  // Event listeners
  window.addEventListener('scroll', throttle(toggleBackToTop, 100), { passive: true });
  backToTopButton.addEventListener('click', scrollToTop);
  
  // Keyboard accessibility
  backToTopButton.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollToTop();
    }
  });
}

// Throttle function for performance optimization
function throttle(func, limit) {
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