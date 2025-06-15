/**
 * Vision Edge Website - Main JavaScript File
 * Handles all interactive functionality including navigation, animations, and form handling
 * Optimized for responsive design and performance across all devices
 */

// Import modular scripts with explicit function imports
import { initializeNavigation } from './nav.js';
import { initializeScrollEffects, initializeBackToTop } from './scroll.js';
import { initializeAnimations, initializeIntersectionObserver } from './animations.js';
import { initializeFormHandling } from './forms.js';
import { initializeResponsiveFeatures, initializeTouchOptimizations, initializePerformanceOptimizations } from './utils.js';

// ===== GLOBAL VARIABLES =====
let scrollY = window.pageYOffset;
let isScrolling = false;
let resizeTimer;

// ===== RESPONSIVE BREAKPOINTS =====
const breakpoints = {
  xs: 320,
  sm: 576,
  md: 768,
  lg: 1024,
  xl: 1440,
  xxl: 1920
};

function getBreakpoint() {
  const width = window.innerWidth;
  if (width >= breakpoints.xxl) return 'xxl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
}

let currentBreakpoint = getBreakpoint();

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all functionality
  initializeNavigation();
  initializeScrollEffects();
  initializeAnimations();
  initializeFormHandling();
  initializeIntersectionObserver();
  initializeBackToTop();
  initializeResponsiveFeatures();
  initializeTouchOptimizations();
  initializePerformanceOptimizations();
  
  // Initialize AOS (Animate On Scroll) library
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      once: true,
      offset: 50,
      delay: 100,
      disable: function() {
        // Disable animations on mobile for better performance
        return window.innerWidth < 768;
      }
    });
  }
});

console.log('Vision Edge modular website loaded successfully! 🚀');