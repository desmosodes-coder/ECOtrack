// Section navigation functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get all navigation links and sections
  const navLinks = document.querySelectorAll('.nav-link');
  const sideNavLinks = document.querySelectorAll('.side-nav-link');
  const sections = document.querySelectorAll('.content-section');
  
  // Get hamburger elements
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  // Get side navbar elements
  const sideNavbar = document.querySelector('.side-navbar');
  const sideNavToggle = document.querySelector('.side-nav-toggle');
  const mainContent = document.querySelector('.main-content');
  
  // Function to switch sections
  function switchSection(sectionId) {
    // Hide all sections
    sections.forEach(section => {
      section.classList.remove('active');
    });
    
    // Show the selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update active nav links
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.section === sectionId) {
        link.classList.add('active');
      }
    });
    
    // Update active side nav links
    sideNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.section === sectionId) {
        link.classList.add('active');
      }
    });
    
    // Close mobile menu if open
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
  }
  
  // Add click event listeners to navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const sectionId = this.dataset.section;
      switchSection(sectionId);
    });
  });
  
  // Add click event listeners to side navigation links
  sideNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const sectionId = this.dataset.section;
      switchSection(sectionId);
      
      // On mobile, close the side navbar after clicking a link
      if (window.innerWidth <= 768) {
        toggleSideNav();
      }
    });
  });
  
  // Add click event listener to hamburger menu
  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
  
  // Toggle side navbar function
  function toggleSideNav() {
    sideNavbar.classList.toggle('hidden');
    
    // Toggle main content margin
    if (sideNavbar.classList.contains('hidden')) {
      mainContent.classList.add('full-width');
      sideNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
    } else {
      mainContent.classList.remove('full-width');
      sideNavToggle.innerHTML = '<i class="fas fa-times"></i>';
    }
  }
  
  // Add click event listener to side navbar toggle button
  if (sideNavToggle) {
    sideNavToggle.addEventListener('click', toggleSideNav);
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
  
  // Add entrance animation for text elements in all sections
  function animateTextElements() {
    const allTextElements = document.querySelectorAll('h1, h2, p');
    
    allTextElements.forEach(function(element, index) {
      // Apply initial styles for animation
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
      
      // Stagger the animations
      setTimeout(function() {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, 300 + (index * 100));
    });
  }
  
  // Run text animations for the initially visible section
  animateTextElements();
  
  // Re-run text animations when switching sections
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      setTimeout(animateTextElements, 100);
    });
  });
  
  sideNavLinks.forEach(link => {
    link.addEventListener('click', function() {
      setTimeout(animateTextElements, 100);
    });
  });
  
  // Initialize side navbar state based on screen size
  function initializeSideNav() {
    if (window.innerWidth <= 768) {
      sideNavbar.classList.add('hidden');
      mainContent.classList.add('full-width');
      if (sideNavToggle) {
        sideNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    } else {
      sideNavbar.classList.remove('hidden');
      mainContent.classList.remove('full-width');
      if (sideNavToggle) {
        sideNavToggle.innerHTML = '<i class="fas fa-times"></i>';
      }
    }
  }
  
  // Run initialization
  initializeSideNav();
  
  // Update on window resize
  window.addEventListener('resize', initializeSideNav);
  
  // Ensure overlay background is visible
  const overlayBackground = document.querySelector('.overlay-background');
  if (overlayBackground) {
    // Make sure the overlay is visible
    overlayBackground.style.opacity = '0.7';
    overlayBackground.style.display = 'block';
  }
  
  // Check if after.png is loaded correctly
  const afterImage = new Image();
  afterImage.onload = function() {
    console.log('after.png loaded successfully');
  };
  afterImage.onerror = function() {
    console.error('Error loading after.png');
    // Try to reload the image with a cache-busting parameter
    overlayBackground.style.backgroundImage = "url('after.png?" + new Date().getTime() + "')";
  };
  afterImage.src = 'after.png';
});