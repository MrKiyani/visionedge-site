/**
 * Navigation functionality
 */

export function initializeNavigation() {
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const navLinks = document.querySelectorAll('.nav__link');
  const header = document.getElementById('header');

  // Mobile menu toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.add('show-menu');
      // Focus management for accessibility
      setTimeout(() => {
        const firstLink = navMenu.querySelector('.nav__link');
        if (firstLink) firstLink.focus();
      }, 100);
    });
  }

  if (navClose) {
    navClose.addEventListener('click', () => {
      navMenu.classList.remove('show-menu');
      // Return focus to toggle button
      if (navToggle) navToggle.focus();
    });
  }

  // Close menu when clicking on nav links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('show-menu');
    });
  });

  // Smooth scrolling for navigation links with responsive offset
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const headerHeight = header.offsetHeight;
        const extraOffset = window.innerWidth < 768 ? 20 : 40;
        const targetPosition = targetSection.offsetTop - headerHeight - extraOffset;
        
        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: 'smooth'
        });
      }
    });
  });

  // Active navigation link highlighting with responsive considerations
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + (window.innerHeight * 0.3);

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (navLink) navLink.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
  
  // Keyboard navigation support
  navMenu.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      navMenu.classList.remove('show-menu');
      if (navToggle) navToggle.focus();
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