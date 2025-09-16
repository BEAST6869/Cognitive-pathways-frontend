// JavaScript-based theme switcher utility

// Initialize theme on page load
export const initializeTheme = () => {
  console.log('Initializing theme system...');
  // Ensure we start with light mode by default
  document.documentElement.classList.remove('dark');
  document.body.style.backgroundColor = '#f9fafb';
  document.body.style.color = '#111827';
  
  const root = document.getElementById('root');
  if (root) {
    root.style.backgroundColor = '#f9fafb';
    root.style.color = '#111827';
  }
};

export const applyTheme = (isDarkMode) => {
  const root = document.documentElement;
  const body = document.body;
  
  console.log('Applying theme:', isDarkMode ? 'dark' : 'light');
  
  if (isDarkMode) {
    // Add dark class
    root.classList.add('dark');
    
    // Apply dark theme styles directly
    body.style.backgroundColor = '#111827'; // gray-900
    body.style.color = '#ffffff';
    
    // Apply dark styles to all elements
    applyDarkStyles();
  } else {
    // Remove dark class
    root.classList.remove('dark');
    
    // Apply light theme styles directly
    body.style.backgroundColor = '#f9fafb'; // gray-50
    body.style.color = '#111827'; // gray-900
    
    // Apply light styles to all elements
    applyLightStyles();
  }
  
  // Update all existing elements
  updateElementStyles(isDarkMode);
};

const applyDarkStyles = () => {
  // Apply styles to root element
  const root = document.getElementById('root');
  if (root) {
    root.style.backgroundColor = '#111827';
    root.style.color = '#ffffff';
  }
  
  // Update all main containers
  const mainContainers = document.querySelectorAll('div[class*="bg-gray-50"], div[class*="bg-white"], main');
  mainContainers.forEach(el => {
    el.style.backgroundColor = '#111827';
    el.style.color = '#ffffff';
  });
};

const applyLightStyles = () => {
  // Apply styles to root element
  const root = document.getElementById('root');
  if (root) {
    root.style.backgroundColor = '#f9fafb';
    root.style.color = '#111827';
  }
  
  // Reset all main containers to light theme
  const mainContainers = document.querySelectorAll('div[class*="bg-gray-50"], div[class*="bg-white"], main');
  mainContainers.forEach(el => {
    el.style.backgroundColor = '';
    el.style.color = '';
  });
};

const updateElementStyles = (isDarkMode) => {
  // Update all text elements
  const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, a, li');
  textElements.forEach(el => {
    if (isDarkMode) {
      // Skip elements that should maintain their specific colors (like red buttons)
      if (!el.classList.contains('text-white') && !el.classList.contains('text-red-600') && !el.classList.contains('bg-red-600')) {
        el.style.color = '#ffffff';
      }
    } else {
      // Reset to original colors for light mode
      if (!el.classList.contains('text-white') && !el.classList.contains('text-red-600')) {
        el.style.color = '';
      }
    }
  });
  
  // Update all background elements
  const bgElements = document.querySelectorAll('[class*="bg-white"], [class*="bg-gray-50"], [class*="bg-gray-100"]');
  bgElements.forEach(el => {
    // Skip red buttons and other specific colored elements
    if (!el.classList.contains('bg-red-600') && !el.classList.contains('bg-red-500')) {
      if (isDarkMode) {
        if (el.classList.contains('bg-white')) {
          el.style.backgroundColor = '#1f2937'; // gray-800
        } else if (el.classList.contains('bg-gray-50')) {
          el.style.backgroundColor = '#111827'; // gray-900
        } else if (el.classList.contains('bg-gray-100')) {
          el.style.backgroundColor = '#374151'; // gray-700
        }
        el.style.color = '#ffffff';
      } else {
        el.style.backgroundColor = '';
        el.style.color = '';
      }
    }
  });
  
  // Update navbar specifically
  const navbars = document.querySelectorAll('nav');
  navbars.forEach(nav => {
    if (isDarkMode) {
      nav.style.backgroundColor = '#1f2937';
      nav.style.borderBottomColor = '#4b5563';
      
      // Update navbar links
      const navLinks = nav.querySelectorAll('a, span');
      navLinks.forEach(link => {
        if (!link.classList.contains('bg-red-600')) {
          link.style.color = '#ffffff';
        }
      });
    } else {
      nav.style.backgroundColor = '';
      nav.style.borderBottomColor = '';
      
      // Reset navbar links
      const navLinks = nav.querySelectorAll('a, span');
      navLinks.forEach(link => {
        if (!link.classList.contains('bg-red-600')) {
          link.style.color = '';
        }
      });
    }
  });
  
  // Update buttons
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    if (isDarkMode) {
      // Keep red buttons as they are, but update others
      if (!button.classList.contains('bg-red-600') && !button.classList.contains('bg-red-500')) {
        if (button.classList.contains('bg-white') || button.classList.contains('bg-gray-100')) {
          button.style.backgroundColor = '#1f2937';
          button.style.color = '#ffffff';
          button.style.borderColor = '#4b5563';
        }
      }
    } else {
      // Reset buttons to original styles
      if (!button.classList.contains('bg-red-600') && !button.classList.contains('bg-red-500')) {
        button.style.backgroundColor = '';
        button.style.color = '';
        button.style.borderColor = '';
      }
    }
  });
  
  // Update SVG icons
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (isDarkMode) {
      svg.style.color = '#ffffff';
    } else {
      svg.style.color = '';
    }
  });
  
  // Update cards and containers
  const cards = document.querySelectorAll('[class*="shadow"], [class*="rounded"]');
  cards.forEach(card => {
    if (isDarkMode) {
      if (!card.classList.contains('bg-red-600') && !card.classList.contains('bg-red-500')) {
        card.style.backgroundColor = '#1f2937';
        card.style.color = '#ffffff';
        card.style.borderColor = '#4b5563';
      }
    } else {
      if (!card.classList.contains('bg-red-600') && !card.classList.contains('bg-red-500')) {
        card.style.backgroundColor = '';
        card.style.color = '';
        card.style.borderColor = '';
      }
    }
  });
};

// Observer to handle dynamically added elements
export const setupThemeObserver = (isDarkMode) => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Apply theme to newly added elements
            setTimeout(() => updateElementStyles(isDarkMode), 100);
          }
        });
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  return observer;
};
