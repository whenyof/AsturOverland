// ASTUR OVERLAND — Optimized Modern Interactions

// Performance optimizations
const IS_REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const IS_TOUCH_DEVICE = 'ontouchstart' in window;

// Initialize Lucide icons with error handling
function initLucideIcons() {
  if (typeof lucide !== 'undefined') {
    try {
      lucide.createIcons();
      console.log('Lucide icons initialized from script.js');
    } catch (error) {
      console.warn('Lucide icons failed to load:', error);
    }
  } else {
    console.warn('Lucide library not available in script.js');
  }
}

// Update year
function updateYear() {
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
  }
}

// Optimized smooth scroll
function initSmoothScroll() {
  const anchors = document.querySelectorAll('a[href^="#"]');
  
  anchors.forEach(anchor => {
    anchor.addEventListener('click', handleSmoothScroll, { passive: false });
  });
}

function handleSmoothScroll(e) {
  const targetId = e.currentTarget.getAttribute('href');
  const targetElement = document.querySelector(targetId);
  
  if (targetElement) {
        e.preventDefault();
    
    if (IS_REDUCED_MOTION) {
      targetElement.scrollIntoView();
      } else {
      targetElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
    }
  }
}

// Scroll reveal animations with IntersectionObserver
const revealElements = Array.from(document.querySelectorAll('.reveal'));
if (revealElements.length > 0 && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseFloat(el.dataset.delay || '0');
        setTimeout(() => {
          el.classList.add('revealed');
        }, delay);
        obs.unobserve(el);
      }
    });
  }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

  // Stagger within groups
  const groups = new Map();
  revealElements.forEach(el => {
    const parentKey = el.closest('.section, .info-rows, .gallery, .highlights, .hero-content') || document.body;
    if (!groups.has(parentKey)) groups.set(parentKey, []);
    groups.get(parentKey).push(el);
  });
  groups.forEach(list => {
    list.forEach((el, idx) => {
      el.dataset.delay = String(idx * 90);
      observer.observe(el);
    });
  });
}

// Registration form logic: validate and redirect to WhatsApp broadcast/group
const form = document.getElementById('registerForm');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const nameError = document.getElementById('nameError');
const phoneError = document.getElementById('phoneError');

// Sponsors form logic
const sponsorsForm = document.getElementById('sponsorsForm');
const emailSubjectInput = document.getElementById('emailSubject');
const messageInput = document.getElementById('message');
const emailSubjectError = document.getElementById('emailSubjectError');
const messageError = document.getElementById('messageError');

function isValidPhoneInternational(value) {
  // Accepts +<countrycode><digits> with optional spaces
  // e.g., +34 612 345 678 or +34612345678
  const digitsOnly = value.replace(/\s+/g, '');
  return /^\+[1-9]\d{7,14}$/.test(digitsOnly);
}

function buildWhatsappLink(name, phone) {
  // Replace with real WhatsApp group invite link if available
  // Fallback: open chat to a number with prefilled message
  const organizerNumber = '+34612345678'; // Change to event official number
  const msg = `Hola, soy ${name} (${phone}). Quiero unirme a ASTUR OVERLAND.`;
  const encoded = encodeURIComponent(msg);
  return `https://wa.me/${organizerNumber.replace(/[^\d]/g, '')}?text=${encoded}`;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildSponsorsEmailLink(emailSubject, message) {
  const organizerEmail = 'iyanrimada@gmail.com'; // Email de prueba
  const subject = emailSubject;
  const body = message;

  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  return `mailto:${organizerEmail}?subject=${encodedSubject}&body=${encodedBody}`;
}

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();

    let valid = true;
    nameError.textContent = '';
    phoneError.textContent = '';

    if (name.length < 2) {
      nameError.textContent = 'Introduce un nombre válido.';
      valid = false;
    }

    if (!isValidPhoneInternational(phone)) {
      phoneError.textContent = 'Introduce un número con prefijo internacional. Ej: +34 612 345 678';
      valid = false;
    }

    if (!valid) return;

    // Simulated registration: could be extended to send to backend/Sheet
    const link = buildWhatsappLink(name, phone);
    window.location.href = link;
  });
}

// Sponsors form handling
if (sponsorsForm) {
  sponsorsForm.addEventListener('submit', e => {
    e.preventDefault();
    const emailSubject = emailSubjectInput.value;
    const message = messageInput.value.trim();

    let valid = true;
    emailSubjectError.textContent = '';
    messageError.textContent = '';

    if (!emailSubject) {
      emailSubjectError.textContent = 'Selecciona un asunto para el correo.';
      valid = false;
    }

    if (message.length < 10) {
      messageError.textContent = 'Escribe un mensaje de al menos 10 caracteres.';
      valid = false;
    }

    if (!valid) return;

    // Build email link with form data
    const link = buildSponsorsEmailLink(emailSubject, message);
    window.location.href = link;
  });
}

// Micro-interactions for press feedback on clickable elements
const pressables = document.querySelectorAll('a.btn, button, .register-card, .gallery img');
pressables.forEach(el => {
  el.addEventListener('mousedown', () => el.classList.add('is-pressed'));
  el.addEventListener('mouseup', () => el.classList.remove('is-pressed'));
  el.addEventListener('mouseleave', () => el.classList.remove('is-pressed'));
  el.addEventListener('touchstart', () => el.classList.add('is-pressed'), { passive: true });
  el.addEventListener('touchend', () => el.classList.remove('is-pressed'));
});

// ========================================
// OLD GALLERY CODE - DEPRECATED (Keeping for reference only)
// Replaced by initNewGallery() function
// ========================================
/* DEPRECATED - Gallery Carousel functionality with modal support
class GalleryCarousel {
  constructor() {
    this.container = document.querySelector('.carousel-container');
    if (!this.container) return;
    
    this.slides = this.container.querySelectorAll('.carousel-slide');
    this.prevBtn = this.container.querySelector('.carousel-btn-prev');
    this.nextBtn = this.container.querySelector('.carousel-btn-next');
    this.currentIndex = 1; // Start with middle slide (active)
    this.isAnimating = false;
    
    // All photos from the fotos folder
    this.images = [
      'fotos/33a86e7b-4dcd-457f-b8d9-0df7408469b7.JPG',
      'fotos/4a41cc5b-c5b5-4088-b336-e12328692eed.JPG',
      'fotos/75b663e7-f8fc-4148-8810-5f9792276d4e.JPG',
      'fotos/7da83a6a-3d8e-45b7-bc80-365c6e1b3445.JPG',
      'fotos/7f8cf50f-8cf5-49f6-b6bb-b8077d3f5b13.JPG',
      'fotos/8b80e811-32af-47df-8375-c4220f56e02a.JPG',
      'fotos/ae16ce46-dd17-4678-9039-b5e9c3a603c7.JPG',
      'fotos/Captura 2025-09-25 a las 22.35.15.jpeg',
      'fotos/Captura 2025-09-25 a las 22.36.34.jpeg',
      'fotos/Captura 2025-09-25 a las 22.37.53.jpeg',
      'fotos/Captura 2025-09-25 a las 22.39.07.jpeg',
      'fotos/Captura 2025-09-25 a las 22.39.54.jpeg',
      'fotos/Captura 2025-09-25 a las 22.41.09.jpeg',
      'fotos/Captura 2025-09-25 a las 22.42.01.jpeg',
      'fotos/Captura 2025-09-25 a las 22.42.30.jpeg',
      'fotos/Captura 2025-09-25 a las 22.44.24.jpeg',
      'fotos/coche1.JPG',
      'fotos/coche2.JPG',
      'fotos/e40452de-a553-4236-9e0c-b8db88b52ddd.JPG',
      'fotos/eaeea247-b03c-4b48-952d-455addc7ae44.JPG',
      'fotos/f42f0e2e-5691-4c4f-be25-c3621d5526a4.JPG',
      'fotos/IMG_5627.png',
      'fotos/IMG_9062.png',
      'fotos/IMG_9071.png'
    ];
    
    // Modal elements
    this.modal = document.getElementById('photoModal');
    this.modalImage = document.getElementById('modalImage');
    this.modalClose = this.modal.querySelector('.modal-close');
    this.modalPrev = this.modal.querySelector('.modal-prev');
    this.modalNext = this.modal.querySelector('.modal-next');
    
    this.init();
  }
  
  init() {
    this.updateSlides();
    this.bindEvents();
    this.bindModalEvents();
  }
  
  bindEvents() {
    this.prevBtn.addEventListener('click', () => this.previous());
    this.nextBtn.addEventListener('click', () => this.next());
    
    // Click on slides to open modal
    this.slides.forEach((slide, index) => {
      slide.addEventListener('click', () => {
        const imageIndex = this.getImageIndexForSlide(index);
        this.openModal(imageIndex);
      });
    });
    
    // Enhanced touch/swipe and mouse drag support
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let currentX = 0;
    
    // Touch events
    this.container.addEventListener('touchstart', (e) => {
      if (this.isAnimating) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
      this.container.style.cursor = 'grabbing';
    }, { passive: true });
    
    this.container.addEventListener('touchmove', (e) => {
      if (!isDragging || this.isAnimating) return;
      currentX = e.touches[0].clientX;
    }, { passive: true });
    
    this.container.addEventListener('touchend', (e) => {
      if (!isDragging || this.isAnimating) return;
      
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;
      
      // Only trigger if horizontal swipe is more significant than vertical
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
        if (diffX > 0) {
          this.next();
        } else {
          this.previous();
        }
      }
      
      startX = 0;
      startY = 0;
      isDragging = false;
      this.container.style.cursor = 'grab';
    }, { passive: true });
    
    // Mouse drag events
    this.container.addEventListener('mousedown', (e) => {
      if (this.isAnimating) return;
      e.preventDefault();
      startX = e.clientX;
      startY = e.clientY;
      isDragging = true;
      this.container.style.cursor = 'grabbing';
    });
    
    this.container.addEventListener('mousemove', (e) => {
      if (!isDragging || this.isAnimating) return;
      currentX = e.clientX;
    });
    
    this.container.addEventListener('mouseup', (e) => {
      if (!isDragging || this.isAnimating) return;
      
      const endX = e.clientX;
      const endY = e.clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;
      
      // Only trigger if horizontal drag is more significant than vertical
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
        if (diffX > 0) {
          this.next();
        } else {
          this.previous();
        }
      }
      
      startX = 0;
      startY = 0;
      isDragging = false;
      this.container.style.cursor = 'grab';
    });
    
    // Prevent context menu on drag
    this.container.addEventListener('contextmenu', (e) => {
      if (isDragging) {
        e.preventDefault();
      }
    });
  }
  
  bindModalEvents() {
    this.modalClose.addEventListener('click', () => this.closeModal());
    
    // Close modal on backdrop click
    this.modal.querySelector('.modal-backdrop').addEventListener('click', () => this.closeModal());
    
    // Keyboard navigation - only Escape to close
    document.addEventListener('keydown', (e) => {
      if (!this.modal.classList.contains('active')) return;
      
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });
  }
  
  getImageIndexForSlide(slideIndex) {
    if (slideIndex === 0) { // prev slide
      return (this.currentIndex - 1 + this.images.length) % this.images.length;
    } else if (slideIndex === 1) { // active slide
      return this.currentIndex;
    } else { // next slide
      return (this.currentIndex + 1) % this.images.length;
    }
  }
  
  previous() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateSlidesWithAnimation('prev');
  }
  
  next() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateSlidesWithAnimation('next');
  }
  
  updateSlidesWithAnimation(direction) {
    // Add sliding animation class with correct direction
    const track = this.container.querySelector('.carousel-track');
    
    // When going next, photos should slide left (opposite direction)
    // When going prev, photos should slide right (opposite direction)
    if (direction === 'next') {
      track.classList.add('sliding-next');
    } else {
      track.classList.add('sliding-prev');
    }
    
    // Update slides mid-animation for smooth roulette effect
    setTimeout(() => {
      this.updateSlides();
    }, 150);
    
    setTimeout(() => {
      track.classList.remove('sliding-next', 'sliding-prev');
      this.isAnimating = false;
    }, 600);
  }
  
  updateSlides() {
    this.slides.forEach((slide, index) => {
      const img = slide.querySelector('img');
      let imageIndex;
      
      if (index === 0) { // prev slide
        imageIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        slide.className = 'carousel-slide carousel-slide-prev';
      } else if (index === 1) { // active slide
        imageIndex = this.currentIndex;
        slide.className = 'carousel-slide carousel-slide-active';
      } else { // next slide
        imageIndex = (this.currentIndex + 1) % this.images.length;
        slide.className = 'carousel-slide carousel-slide-next';
      }
      
      img.src = this.images[imageIndex];
      img.alt = `Imagen ${imageIndex + 1} del evento AsturOverland`;
      
      // Add error handling for broken images
      img.onerror = function() {
        console.warn(`Error loading carousel image: ${this.images[imageIndex]}`);
        // Try to load a fallback image or hide the slide
        slide.style.display = 'none';
      };
      
      // Add load success handler
      img.onload = function() {
        slide.style.display = 'block';
      };
    });
  }
  
  openModal(imageIndex) {
    this.modalImage.src = this.images[imageIndex];
    this.modalImage.alt = `Imagen ${imageIndex + 1} del evento AsturOverland`;
    this.modalCurrentIndex = imageIndex;
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  closeModal() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }
  
}
*/

// Reviews Carousel functionality with GSAP Infinite Autoplay
class ReviewsCarousel {
  constructor() {
    this.track = document.querySelector('.reviews-track');
    if (!this.track) return;
    
    this.cards = this.track.querySelectorAll('.review-card');
    this.isPaused = false;
    this.autoplayTimeline = null;
    this.animationDuration = 40; // seconds for full loop
    
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
      console.warn('GSAP not loaded for reviews carousel');
      return;
    }
    
    this.init();
  }
  
  init() {
    this.duplicateCards();
    this.bindEvents();
    this.startGSAPInfiniteAnimation();
    
    // Stagger animation for cards on scroll
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      const cards = this.track.querySelectorAll('.review-card');
      
      ScrollTrigger.create({
        trigger: this.track.closest('.section-reviews'),
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            delay: 0.2
          });
        }
      });
    }
  }
  
  duplicateCards() {
    // Duplicate cards for seamless infinite loop
    const cardsHTML = Array.from(this.cards).map(card => card.outerHTML).join('');
    this.track.insertAdjacentHTML('beforeend', cardsHTML);
    
    // Update the cards reference to include the duplicated ones
    this.cards = this.track.querySelectorAll('.review-card');
    
    // Set initial opacity for animation
    this.cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
    });
  }
  
  bindEvents() {
    const reviewsSection = this.track.closest('.section-reviews');
    if (!reviewsSection) return;
    
    // Pause on hover
    reviewsSection.addEventListener('mouseenter', () => {
      this.pauseAnimation();
    });
    
    reviewsSection.addEventListener('mouseleave', () => {
      this.resumeAnimation();
    });
    
    // Pause on touch
    this.track.addEventListener('touchstart', () => {
      this.pauseAnimation();
    }, { passive: true });
    
    this.track.addEventListener('touchend', () => {
      setTimeout(() => this.resumeAnimation(), 1500);
    }, { passive: true });
    
    // Pause on focus (accessibility)
    this.track.addEventListener('focusin', () => {
      this.pauseAnimation();
    });
    
    this.track.addEventListener('focusout', () => {
      this.resumeAnimation();
    });
  }
  
  startGSAPInfiniteAnimation() {
    if (!gsap) return;
    
    // Kill existing timeline if any
    if (this.autoplayTimeline) {
      this.autoplayTimeline.kill();
      this.autoplayTimeline = null;
    }
    
    // Calculate total width (half because we duplicated)
    const totalWidth = this.track.scrollWidth / 2;
    const speed = totalWidth / this.animationDuration; // pixels per second
    
    // Set initial position
    gsap.set(this.track, { x: 0 });
    
    // Create infinite timeline
    this.autoplayTimeline = gsap.timeline({
      repeat: -1,
      paused: this.isPaused,
      onRepeat: () => {
        // Seamlessly reset position when loop completes
        gsap.set(this.track, { x: 0 });
      }
    });
    
    // Animate to the duplicated set
    this.autoplayTimeline.to(this.track, {
      x: -totalWidth,
      duration: this.animationDuration,
      ease: 'none'
    });
  }
  
  pauseAnimation() {
    if (this.autoplayTimeline) {
      this.autoplayTimeline.pause();
      this.isPaused = true;
    }
  }
  
  resumeAnimation() {
    if (this.autoplayTimeline && this.isPaused) {
      this.autoplayTimeline.play();
      this.isPaused = false;
    }
  }
}

/* DEPRECATED - Gallery Expand functionality
class GalleryExpand {
  constructor() {
    this.toggle = document.getElementById('galleryToggle');
    this.collage = document.getElementById('galleryCollage');
    this.grid = document.getElementById('collageGrid');
    this.isExpanded = false;
    
    if (this.toggle && this.collage && this.grid) {
      this.init();
    }
  }
  
  init() {
    this.loadAllImages();
    this.bindEvents();
  }
  
  loadAllImages() {
    // All photos from the fotos folder
    const allImages = [
      'fotos/33a86e7b-4dcd-457f-b8d9-0df7408469b7.JPG',
      'fotos/4a41cc5b-c5b5-4088-b336-e12328692eed.JPG',
      'fotos/75b663e7-f8fc-4148-8810-5f9792276d4e.JPG',
      'fotos/7da83a6a-3d8e-45b7-bc80-365c6e1b3445.JPG',
      'fotos/7f8cf50f-8cf5-49f6-b6bb-b8077d3f5b13.JPG',
      'fotos/8b80e811-32af-47df-8375-c4220f56e02a.JPG',
      'fotos/ae16ce46-dd17-4678-9039-b5e9c3a603c7.JPG',
      'fotos/Captura 2025-09-25 a las 22.35.15.jpeg',
      'fotos/Captura 2025-09-25 a las 22.36.34.jpeg',
      'fotos/Captura 2025-09-25 a las 22.37.53.jpeg',
      'fotos/Captura 2025-09-25 a las 22.39.07.jpeg',
      'fotos/Captura 2025-09-25 a las 22.39.54.jpeg',
      'fotos/Captura 2025-09-25 a las 22.41.09.jpeg',
      'fotos/Captura 2025-09-25 a las 22.42.01.jpeg',
      'fotos/Captura 2025-09-25 a las 22.42.30.jpeg',
      'fotos/Captura 2025-09-25 a las 22.44.24.jpeg',
      'fotos/coche1.JPG',
      'fotos/coche2.JPG',
      'fotos/e40452de-a553-4236-9e0c-b8db88b52ddd.JPG',
      'fotos/eaeea247-b03c-4b48-952d-455addc7ae44.JPG',
      'fotos/f42f0e2e-5691-4c4f-be25-c3621d5526a4.JPG',
      'fotos/IMG_5627.png',
      'fotos/IMG_9062.png',
      'fotos/IMG_9071.png'
    ];
    
    // Create collage items
    allImages.forEach((imageSrc, index) => {
      const item = document.createElement('div');
      item.className = 'collage-item';
      item.setAttribute('data-index', index);
      
      const img = document.createElement('img');
      img.src = imageSrc;
      img.alt = `Momento ${index + 1} de AsturOverland`;
      img.loading = 'lazy';
      
      // Add error handling for broken images
      img.onerror = function() {
        console.warn(`Error loading image: ${imageSrc}`);
        // Hide the item if image fails to load
        item.style.display = 'none';
      };
      
      // Add load success handler
      img.onload = function() {
        item.style.display = 'block';
      };
      
      item.appendChild(img);
      this.grid.appendChild(item);
      
      // Add click event to open in modal
      item.addEventListener('click', () => {
        this.openInModal(imageSrc, index);
      });
    });
  }
  
  bindEvents() {
    this.toggle.addEventListener('click', () => {
      this.toggleCollage();
    });
  }
  
  toggleCollage() {
    this.isExpanded = !this.isExpanded;
    
    if (this.isExpanded) {
      this.collage.classList.add('expanded');
      this.toggle.classList.add('expanded');
      this.toggle.querySelector('.toggle-text').textContent = 'Ver menos';
    } else {
      this.collage.classList.remove('expanded');
      this.toggle.classList.remove('expanded');
      this.toggle.querySelector('.toggle-text').textContent = 'Ver más momentos';
    }
  }
  
  openInModal(imageSrc, index) {
    // Reuse the existing modal from GalleryCarousel
    const modal = document.getElementById('photoModal');
    const modalImage = document.getElementById('modalImage');
    
    if (modal && modalImage) {
      modalImage.src = imageSrc;
      modalImage.alt = `Momento ${index + 1} de AsturOverland`;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
}
*/

// Mobile Menu Toggle
class MobileMenu {
  constructor() {
    this.toggle = document.querySelector('.mobile-menu-toggle');
    this.nav = document.querySelector('.site-nav');
    this.header = document.querySelector('.site-header');
    
    if (this.toggle && this.nav) {
      this.init();
    }
  }
  
  init() {
    this.toggle.addEventListener('click', () => this.toggleMenu());
    
    // Close menu when clicking on nav links
    this.nav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        this.closeMenu();
      }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.header.contains(e.target) && this.nav.classList.contains('active')) {
        this.closeMenu();
      }
    });
  }
  
  toggleMenu() {
    this.nav.classList.toggle('active');
    this.toggle.classList.toggle('active');
    
    // Update icon
    const icon = this.toggle.querySelector('i');
    if (this.nav.classList.contains('active')) {
      icon.setAttribute('data-lucide', 'x');
    } else {
      icon.setAttribute('data-lucide', 'menu');
    }
    
    // Re-initialize icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
  
  closeMenu() {
    this.nav.classList.remove('active');
    this.toggle.classList.remove('active');
    
    const icon = this.toggle.querySelector('i');
    icon.setAttribute('data-lucide', 'menu');
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
}

// Enhanced Scroll Reveal
class ScrollReveal {
  constructor() {
    this.elements = document.querySelectorAll('.reveal');
    this.init();
  }
  
  init() {
    if (this.elements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const delay = parseFloat(element.dataset.delay || '0');
          
          setTimeout(() => {
            element.classList.add('revealed');
          }, delay);
          
          observer.unobserve(element);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1
    });
    
    // Stagger animations within groups
    const groups = new Map();
    this.elements.forEach(el => {
      const parentKey = el.closest('.section, .info-rows, .highlights, .hero-content') || document.body;
      if (!groups.has(parentKey)) groups.set(parentKey, []);
      groups.get(parentKey).push(el);
    });
    
    groups.forEach(list => {
      list.forEach((el, idx) => {
        el.dataset.delay = String(idx * 100);
        observer.observe(el);
      });
    });
  }
  
}

// Enhanced Header Scroll Effect with Progress Indicator
class HeaderScroll {
  constructor() {
    this.header = document.querySelector('.site-header');
    this.lastScrollY = window.scrollY;
    this.isScrollingDown = false;
    this.scrollTimeout = null;
    this.init();
  }
  
  init() {
    if (!this.header) return;
    
    // Throttled scroll handler for better performance
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateHeader();
          this.updateScrollProgress();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
  
  updateHeader() {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - this.lastScrollY;
    
    // Determine scroll direction
    this.isScrollingDown = scrollDelta > 0;
    
    // Add scrolled class when past hero section
    if (currentScrollY > 50) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
    
    this.lastScrollY = currentScrollY;
  }
  
  updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    // Update the progress bar
    this.header.style.setProperty('--scroll-progress', `${scrollPercent}%`);
    
    // Subtle parallax effect for hero background
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
      const parallaxSpeed = 0.5;
      const yPos = -(scrollTop * parallaxSpeed);
      heroBackground.style.transform = `translate3d(0, ${yPos}px, 0)`;
    }
  }
}

// Enhanced Active Navigation with Smooth Animations
class ActiveNavigation {
  constructor() {
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('section[id]');
    this.isScrolling = false;
    this.scrollTimeout = null;
    this.currentActiveSection = null;
    this.init();
  }
  
  init() {
    if (!this.navLinks.length) return;
    
    // Initialize active state with delay to ensure DOM is ready
    setTimeout(() => {
      this.setActiveLink('info');
    }, 100);
    
    // Setup intersection observer for precise section detection
    this.setupIntersectionObserver();
    
    // Enhanced click handling with smooth scrolling
    this.setupClickHandlers();
    
    // Throttled scroll handler for performance
    this.setupScrollHandler();
  }
  
  setupIntersectionObserver() {
    // Improved options for better section detection in both directions
    const options = {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // More balanced margins for better detection
      threshold: [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1] // More granular thresholds
    };
    
    this.observer = new IntersectionObserver((entries) => {
      // Only update if not manually scrolling
      if (this.isScrolling) return;
      
      // Find the most visible section
      let mostVisibleSection = null;
      let maxVisibility = 0;
      
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const visibility = entry.intersectionRatio;
          if (visibility > maxVisibility) {
            maxVisibility = visibility;
            mostVisibleSection = entry.target.getAttribute('id');
          }
        }
      });
      
      // If we found a visible section, activate it
      if (mostVisibleSection && maxVisibility > 0.1) {
        // Map reviews section to comunidad for consistency
        const mappedSectionId = mostVisibleSection === 'reviews' ? 'comunidad' : mostVisibleSection;
        
        // Only update if it's actually a different section
        if (this.currentActiveSection !== mappedSectionId) {
          this.setActiveLink(mappedSectionId);
        }
      }
    }, options);
    
    // Observe all sections
    this.sections.forEach(section => {
      this.observer.observe(section);
    });
    
    // Special handling for footer with different threshold
    const footer = document.querySelector('#contacto');
    if (footer) {
      const footerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', // Activate when footer is 10% visible
        threshold: [0, 0.1, 0.3, 0.5]
      };
      
      this.footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.1 && !this.isScrolling) {
            this.setActiveLink('contacto');
          }
        });
      }, footerOptions);
      
      this.footerObserver.observe(footer);
    }
  }
  
  setupClickHandlers() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
      e.preventDefault();
        
        const sectionId = link.getAttribute('data-section');
        const targetSection = document.querySelector(`#${sectionId}`);
        
        if (targetSection) {
          // Set scrolling flag to prevent observer conflicts
          this.isScrolling = true;
          
          // Smooth scroll to section with custom timing
          this.smoothScrollToSection(targetSection);
          
          // Update active state immediately for better UX
          this.setActiveLink(sectionId);
          
          // Clear scrolling flag after animation completes
          setTimeout(() => {
            this.isScrolling = false;
          }, 1000); // Slightly longer than scroll duration
        }
      });
    });
  }
  
  setupScrollHandler() {
    // Throttled scroll handler to prevent excessive updates
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          
          // Special handling for top of page
          if (scrollY < 100) {
            // If we're near the top, activate the first section (info)
            if (this.currentActiveSection !== 'info') {
              this.setActiveLink('info');
            }
          }
          
          // Clear any existing timeout
          if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
          }
          
          // Set timeout to detect end of scroll
          this.scrollTimeout = setTimeout(() => {
            this.isScrolling = false;
          }, 150);
          
          ticking = false;
        });
        
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
  
  smoothScrollToSection(targetSection) {
    const headerHeight = 80; // Account for fixed header
    const targetPosition = targetSection.offsetTop - headerHeight;
    
    // Use native smooth scrolling with fallback
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    } else {
      // Fallback for older browsers
      this.animateScroll(targetPosition);
    }
  }
  
  animateScroll(targetPosition) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800; // 800ms for smooth animation
    let startTime = null;
    
    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function for smooth animation (ease-in-out)
      const ease = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      window.scrollTo(0, startPosition + distance * ease);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };
    
    requestAnimationFrame(animation);
  }
  
  setActiveLink(sectionId) {
    // Prevent unnecessary updates
    if (this.currentActiveSection === sectionId) return;
    
    // Remove active class from all links with smooth transition
    this.navLinks.forEach(link => {
      link.classList.remove('active');
    });
    
    // Add active class to current link
    const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeLink) {
      // Add a slight delay for smooth visual transition
      requestAnimationFrame(() => {
        activeLink.classList.add('active');
      });
    }
    
    // Update current active section
    this.currentActiveSection = sectionId;
  }
}

// Smooth Scroll to Section
class SmoothScroll {
  constructor() {
    this.init();
  }
  
  init() {
    // Hero scroll button
    const heroScroll = document.querySelector('.hero-scroll');
    if (heroScroll) {
      heroScroll.addEventListener('click', () => {
        const nextSection = document.querySelector('#entradas');
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
    
    // All internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
      e.preventDefault();
          targetElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
}

// Image Loading Enhancement
class ImageLoader {
  constructor() {
    this.images = document.querySelectorAll('img');
    this.init();
  }
  
  init() {
    this.images.forEach(img => {
      if (img.complete) {
        this.handleImageLoad(img);
      } else {
        img.setAttribute('data-loading', 'true');
        img.addEventListener('load', () => this.handleImageLoad(img));
        img.addEventListener('error', () => this.handleImageError(img));
      }
    });
  }
  
  handleImageLoad(img) {
    img.removeAttribute('data-loading');
    img.setAttribute('data-loaded', 'true');
  }
  
  handleImageError(img) {
    img.removeAttribute('data-loading');
    img.style.opacity = '0.5';
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons FIRST
  initLucideIcons();
  
  // Re-initialize icons after a short delay to ensure they load
  setTimeout(initLucideIcons, 500);
  
  updateYear();
  
  // Initialize all components
  new MobileMenu();
  new ScrollReveal();
  new HeaderScroll();
  new ActiveNavigation();
  new SmoothScroll();
  // initNewGallery(); // Deshabilitado temporalmente
  new ReviewsCarousel();
  new ImageLoader();

  // Legal & cookies
  initCookieBanner();
  
  // Initialize hero animations
  initHeroAnimations();
  
  // Initialize countdown
  initCountdown();
});
/**
 * ========================================
 * Adventure Overland Gallery - Vanilla JS Implementation
 * No external dependencies (no GSAP)
 * Prefijo .ao- para evitar conflictos
 * ========================================
 */
function initNewGallery() {
  // Get gallery elements with new ao- prefixed IDs
  const galleryContainer = document.getElementById('aoGalleryContainer');
  const galleryTrack = document.getElementById('aoGalleryTrack');
  const galleryWrapper = document.getElementById('aoGalleryWrapper');
  const galleryPrevBtn = document.getElementById('aoGalleryPrev');
  const galleryNextBtn = document.getElementById('aoGalleryNext');
  const lightbox = document.getElementById('aoLightbox');
  const lightboxImage = document.getElementById('aoLightboxImage');
  const lightboxClose = document.getElementById('aoLightboxClose');
  const lightboxPrev = document.getElementById('aoLightboxPrev');
  const lightboxNext = document.getElementById('aoLightboxNext');
  const lightboxBackdrop = document.getElementById('aoLightboxBackdrop');
  const lightboxLoader = document.getElementById('aoLightboxLoader');
  const lightboxCurrent = document.getElementById('aoLightboxCurrent');
  const lightboxTotal = document.getElementById('aoLightboxTotal');
  
  // Early return if critical elements are missing
  if (!galleryContainer || !galleryTrack || !galleryWrapper) {
    console.warn('[AO Gallery] Critical elements not found. Skipping initialization.');
    return;
  }
  
  if (!lightbox || !lightboxImage) {
    console.warn('[AO Gallery] Lightbox elements not found. Gallery will work without lightbox.');
  }
  
  // Gallery state
  let currentIndex = 0;
  let isLightboxOpen = false;
  let isPlaying = true;
  let autoplayInterval = null;
  let isHovered = false;
  let isTouching = false;
  let touchStartX = 0;
  let scrollPosition = 0;
  
  // All gallery images - 23 images from /fotos
  const images = [
    { src: 'fotos/33a86e7b-4dcd-457f-b8d9-0df7408469b7.JPG', alt: 'Momentos del Overland Asturias - Vehículo 4x4 en terreno' },
    { src: 'fotos/4a41cc5b-c5b5-4088-b336-e12328692eed.JPG', alt: 'Momentos del Overland Asturias - Aventura 4x4' },
    { src: 'fotos/75b663e7-f8fc-4148-8810-5f9792276d4e.JPG', alt: 'Momentos del Overland Asturias - Competición 4x4' },
    { src: 'fotos/7da83a6a-3d8e-45b7-bc80-365c6e1b3445.JPG', alt: 'Momentos del Overland Asturias - Terreno asturiano' },
    { src: 'fotos/7f8cf50f-8cf5-49f6-b6bb-b8077d3f5b13.JPG', alt: 'Momentos del Overland Asturias - Vehículo todo terreno' },
    { src: 'fotos/8b80e811-32af-47df-8375-c4220f56e02a.JPG', alt: 'Momentos del Overland Asturias - Aventura offroad' },
    { src: 'fotos/Captura 2025-09-25 a las 22.35.15.jpeg', alt: 'Momentos del Overland Asturias - Evento 2025' },
    { src: 'fotos/Captura 2025-09-25 a las 22.36.34.jpeg', alt: 'Momentos del Overland Asturias - Participantes' },
    { src: 'fotos/Captura 2025-09-25 a las 22.37.53.jpeg', alt: 'Momentos del Overland Asturias - Competición' },
    { src: 'fotos/Captura 2025-09-25 a las 22.39.07.jpeg', alt: 'Momentos del Overland Asturias - Vehículos 4x4' },
    { src: 'fotos/Captura 2025-09-25 a las 22.39.54.jpeg', alt: 'Momentos del Overland Asturias - Terreno difícil' },
    { src: 'fotos/Captura 2025-09-25 a las 22.41.09.jpeg', alt: 'Momentos del Overland Asturias - Aventura extrema' },
    { src: 'fotos/Captura 2025-09-25 a las 22.42.01.jpeg', alt: 'Momentos del Overland Asturias - Acción 4x4' },
    { src: 'fotos/Captura 2025-09-25 a las 22.42.30.jpeg', alt: 'Momentos del Overland Asturias - Evento único' },
    { src: 'fotos/Captura 2025-09-25 a las 22.44.24.jpeg', alt: 'Momentos del Overland Asturias - Experiencia inolvidable' },
    { src: 'fotos/coche1.JPG', alt: 'Momentos del Overland Asturias - 4x4 en acción' },
    { src: 'fotos/coche2.JPG', alt: 'Momentos del Overland Asturias - Evento AsturOverland' },
    { src: 'fotos/ae16ce46-dd17-4678-9039-b5e9c3a603c7.JPG', alt: 'Momentos del Overland Asturias - Vehículo todo terreno' },
    { src: 'fotos/e40452de-a553-4236-9e0c-b8db88b52ddd.JPG', alt: 'Momentos del Overland Asturias - Terreno asturiano' },
    { src: 'fotos/eaeea247-b03c-4b48-952d-455addc7ae44.JPG', alt: 'Momentos del Overland Asturias - Aventura 4x4' },
    { src: 'fotos/f42f0e2e-5691-4c4f-be25-c3621d5526a4.JPG', alt: 'Momentos del Overland Asturias - Competición' },
    { src: 'fotos/IMG_5627.png', alt: 'Momentos del Overland Asturias - Participantes del evento' },
    { src: 'fotos/IMG_9062.png', alt: 'Momentos del Overland Asturias - Competición y aventura' },
    { src: 'fotos/IMG_9071.png', alt: 'Momentos del Overland Asturias - Experiencia 4x4 única' }
  ];
  
  // Update total count in lightbox
  if (lightboxTotal) lightboxTotal.textContent = images.length;
  
  /**
   * Create gallery item - Vanilla JS implementation
   */
  function createGalleryItem(image, index) {
    const item = document.createElement('div');
    item.className = 'ao-gallery-item';
    item.setAttribute('role', 'listitem');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', `Ver imagen ${index + 1}: ${image.alt}`);
    item.dataset.index = index;
    
    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.alt;
    img.loading = index < 6 ? 'eager' : 'lazy';
    
    // Image load handler with vanilla JS animation
    img.addEventListener('load', () => {
      item.classList.add('loaded');
      // Fade in animation with CSS transition
      requestAnimationFrame(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      });
    }, { once: true });
    
    // Error handling
    img.addEventListener('error', () => {
      item.style.opacity = '0.5';
      console.warn(`[AO Gallery] Failed to load image: ${image.src}`);
    }, { once: true });
    
    // Click handler for lightbox
    item.addEventListener('click', () => {
      if (lightbox && lightboxImage) {
        openLightbox(index);
      }
    });
    
    // Keyboard accessibility
    item.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && lightbox && lightboxImage) {
        e.preventDefault();
        openLightbox(index);
      }
    });
    
    item.appendChild(img);
    return item;
  }
  
  /**
   * Initialize carousel - Vanilla JS
   */
  function initCarousel() {
    // Clear existing items
    galleryTrack.innerHTML = '';
    
    // Create items
    images.forEach((image, index) => {
      galleryTrack.appendChild(createGalleryItem(image, index));
    });
    
    // Duplicate items for infinite loop
    const items = Array.from(galleryTrack.children);
    items.forEach(item => {
      const duplicate = item.cloneNode(true);
      duplicate.dataset.duplicate = 'true';
      galleryTrack.appendChild(duplicate);
    });
  }
  
  /**
   * Get item width (responsive)
   */
  function getItemWidth() {
    if (window.innerWidth > 1024) return 320;
    if (window.innerWidth > 768) return 280;
    if (window.innerWidth > 480) return 260;
    return 240;
  }
  
  /**
   * Get gap size (responsive)
   */
  function getGap() {
    if (window.innerWidth > 1024) return 24;
    if (window.innerWidth > 768) return 16;
    return 12;
  }
  
  /**
   * Initialize vanilla JS autoplay
   */
  function initAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
    
    if (!galleryTrack || isHovered || isLightboxOpen || !isPlaying) return;
    
    const itemWidth = getItemWidth();
    const gap = getGap();
    const itemWithGap = itemWidth + gap;
    const scrollAmount = itemWithGap * images.length;
    let currentScroll = 0;
    const scrollSpeed = 0.5; // pixels per frame
    
    autoplayInterval = setInterval(() => {
      if (isHovered || isLightboxOpen || !isPlaying) return;
      
      currentScroll += scrollSpeed;
      
      // Reset position seamlessly for infinite loop
      if (currentScroll >= scrollAmount) {
        currentScroll = 0;
      }
      
      galleryTrack.style.transform = `translateX(-${currentScroll}px)`;
    }, 16); // ~60fps
  }
  
  /**
   * Stop autoplay
   */
  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }
  
  /**
   * Navigate carousel manually
   */
  function navigateCarousel(direction) {
    const itemWidth = getItemWidth();
    const gap = getGap();
    const scrollAmount = itemWidth + gap;
    const currentScroll = parseInt(galleryTrack.style.transform.replace('translateX(-', '').replace('px)', '') || '0');
    const newScroll = direction === 'next' 
      ? currentScroll + scrollAmount 
      : Math.max(0, currentScroll - scrollAmount);
    
    galleryTrack.style.transform = `translateX(-${newScroll}px)`;
    
    // Reset to start if we've scrolled past all images
    if (newScroll >= itemWidth * images.length * 2) {
      galleryTrack.style.transform = 'translateX(0)';
    }
  }
  
  /**
   * Open lightbox - Vanilla JS
   */
  function openLightbox(index) {
    if (!lightbox || !lightboxImage) return;
    
    currentIndex = Math.max(0, Math.min(index, images.length - 1));
    isLightboxOpen = true;
    
    // Pause autoplay
    stopAutoplay();
    
    // Get current image
    const image = images[currentIndex];
    
    // Show loader
    if (lightboxLoader) {
      lightboxLoader.classList.add('active');
    }
    lightboxImage.classList.add('loading');
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    
    // Handle image load
    lightboxImage.onload = () => {
      lightboxImage.classList.remove('loading');
      if (lightboxLoader) {
        lightboxLoader.classList.remove('active');
      }
    };
    lightboxImage.onerror = () => {
      lightboxImage.classList.remove('loading');
      if (lightboxLoader) {
        lightboxLoader.classList.remove('active');
      }
      console.error('[AO Gallery] Failed to load lightbox image:', image.src);
    };
    
    // Update counter
    if (lightboxCurrent) lightboxCurrent.textContent = currentIndex + 1;
    
    // Show lightbox with CSS transition
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  
  /**
   * Close lightbox - Vanilla JS
   */
  function closeLightbox() {
    if (!isLightboxOpen || !lightbox) return;
    isLightboxOpen = false;
    
    // Hide lightbox
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    // Resume autoplay if it was playing
    if (isPlaying && !isHovered) {
      setTimeout(() => {
        initAutoplay();
      }, 300);
    }
  }
  
  /**
   * Navigate lightbox (prev/next)
   */
  function navigateLightbox(direction) {
    if (!isLightboxOpen || !lightboxImage) return;
    
    // Update index
    if (direction === 'next') {
      currentIndex = (currentIndex + 1) % images.length;
    } else {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
    }
    
    // Get new image
    const image = images[currentIndex];
    
    // Fade out current image
    lightboxImage.style.opacity = '0';
    
    setTimeout(() => {
      // Update image source
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      
      // Update counter
      if (lightboxCurrent) {
        lightboxCurrent.textContent = currentIndex + 1;
      }
      
      // Fade in new image
      setTimeout(() => {
        lightboxImage.style.opacity = '1';
      }, 50);
    }, 200);
  }
  
  // Initialize carousel
  initCarousel();
  
  // Initialize autoplay after a short delay
  setTimeout(() => {
    initAutoplay();
  }, 1000);
  
  // Event Listeners - Carousel Navigation
  if (galleryPrevBtn) {
    galleryPrevBtn.addEventListener('click', () => {
      navigateCarousel('prev');
      stopAutoplay();
      setTimeout(() => {
        if (!isHovered && !isLightboxOpen) {
          initAutoplay();
        }
      }, 2000);
    });
  }
  
  if (galleryNextBtn) {
    galleryNextBtn.addEventListener('click', () => {
      navigateCarousel('next');
      stopAutoplay();
      setTimeout(() => {
        if (!isHovered && !isLightboxOpen) {
          initAutoplay();
        }
      }, 2000);
    });
  }
  
  // Hover to pause
  if (galleryWrapper) {
    galleryWrapper.addEventListener('mouseenter', () => {
      isHovered = true;
      stopAutoplay();
    });
    
    galleryWrapper.addEventListener('mouseleave', () => {
      isHovered = false;
      if (isPlaying && !isLightboxOpen) {
        initAutoplay();
      }
    });
  }
  
  // Touch events for mobile
  if (galleryWrapper) {
    galleryWrapper.addEventListener('touchstart', (e) => {
      isTouching = true;
      touchStartX = e.touches[0].clientX;
      scrollPosition = parseInt(galleryTrack.style.transform.replace('translateX(-', '').replace('px)', '') || '0');
      stopAutoplay();
    }, { passive: true });
    
    galleryWrapper.addEventListener('touchmove', (e) => {
      if (!isTouching) return;
      const touchX = e.touches[0].clientX;
      const diff = touchStartX - touchX;
      const newScroll = scrollPosition + diff;
      galleryTrack.style.transform = `translateX(-${newScroll}px)`;
    }, { passive: true });
    
    galleryWrapper.addEventListener('touchend', () => {
      isTouching = false;
      setTimeout(() => {
        if (!isHovered && !isLightboxOpen && isPlaying) {
          initAutoplay();
        }
      }, 2000);
    }, { passive: true });
  }
  
  // Lightbox Event Listeners
  if (lightboxClose) {
    lightboxClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }
  
  if (lightboxBackdrop) {
    lightboxBackdrop.addEventListener('click', closeLightbox);
  }
  
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox('prev');
    });
  }
  
  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox('next');
    });
  }
  
  // Keyboard Navigation
  document.addEventListener('keydown', (e) => {
    if (!isLightboxOpen) return;
    
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      navigateLightbox('prev');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      navigateLightbox('next');
    }
  });
  
  // Window resize handler
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      stopAutoplay();
      if (isPlaying && !isHovered && !isLightboxOpen) {
        initAutoplay();
      }
    }, 300);
  });
}

function initCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;

  const consent = localStorage.getItem('cookie_consent_v1');
  if (!consent) {
    banner.style.display = 'block';
  }

  const accept = document.getElementById('acceptCookies');
  const configure = document.getElementById('configureCookies');

  if (accept) accept.addEventListener('click', () => {
    localStorage.setItem('cookie_consent_v1', JSON.stringify({ necessary: true, analytics: true, marketing: true, date: Date.now() }));
    banner.style.display = 'none';
  });

  if (configure) configure.addEventListener('click', () => {
    // Open cookies page
    window.location.href = 'legal/cookies.html';
  });
  
  // Update banner link to open cookies page
  const openCookiesFromBanner = document.getElementById('openCookiesFromBanner');
  if (openCookiesFromBanner) {
    openCookiesFromBanner.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'legal/cookies.html';
    });
  }
}

// Hero animations initialization
function initHeroAnimations() {
  const heroLogo = document.querySelector('.hero-logo');
  const heroInfo = document.querySelector('.hero-info');
  const heroLayout = document.querySelector('.hero-layout');
  
  if (heroLogo && heroInfo && heroLayout) {
    // Add entrance animations
    setTimeout(() => {
      heroLogo.style.opacity = '1';
      heroLogo.style.transform = 'translateY(0)';
    }, 200);
    
    setTimeout(() => {
      heroInfo.style.opacity = '1';
      heroInfo.style.transform = 'translateY(0)';
    }, 600);
    
    // Add hover effects
    heroLayout.addEventListener('mouseenter', () => {
      heroInfo.style.opacity = '0.8';
      heroInfo.style.transform = 'translateY(10px)';
    });
    
    heroLayout.addEventListener('mouseleave', () => {
      heroInfo.style.opacity = '1';
      heroInfo.style.transform = 'translateY(0)';
    });
  }
}

// Countdown Timer - Versión completamente nueva
function initCountdown() {
  console.log('🚀 Inicializando temporizador...');
  
  // Fecha del evento: 17 de julio de 2026, 10:00 AM (GMT+2)
  const eventDate = new Date('2026-07-17T10:00:00+02:00').getTime();
  console.log('📅 Fecha del evento:', new Date(eventDate));
  console.log('⏰ Fecha actual:', new Date());
  
  function updateCountdown() {
    const now = new Date().getTime();
    const timeLeft = eventDate - now;
    
    console.log('⏱️ Tiempo restante (ms):', timeLeft);
    
    // Si el evento ya pasó
    if (timeLeft < 0) {
      console.log('🎉 El evento ya comenzó!');
      const titleEl = document.querySelector('.countdown-title');
      if (titleEl) {
        titleEl.textContent = '¡El evento ha comenzado!';
      }
      return;
    }
    
    // Calcular días, horas, minutos y segundos
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    console.log('📊 Valores calculados:', { days, hours, minutes, seconds });
    
    // Obtener elementos del DOM
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    // Verificar que los elementos existen
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
      console.error('❌ No se encontraron los elementos del temporizador');
      console.log('Elementos buscados:', {
        days: !!daysEl,
        hours: !!hoursEl,
        minutes: !!minutesEl,
        seconds: !!secondsEl
      });
      return;
    }
    
    // Actualizar los valores en el DOM
    daysEl.textContent = days.toString().padStart(2, '0');
    hoursEl.textContent = hours.toString().padStart(2, '0');
    minutesEl.textContent = minutes.toString().padStart(2, '0');
    secondsEl.textContent = seconds.toString().padStart(2, '0');
    
    console.log('✅ Temporizador actualizado:', `${days}d ${hours}h ${minutes}m ${seconds}s`);
  }
  
  // Ejecutar inmediatamente
  console.log('🔄 Ejecutando primera actualización...');
  updateCountdown();
  
  // Ejecutar cada segundo
  console.log('⏰ Configurando intervalo de 1 segundo...');
  setInterval(updateCountdown, 1000);
  
  console.log('✅ Temporizador configurado correctamente');
}

// Activity Modal Functions
const activityData = {
  'trivial': {
    title: 'Trivial 4x4',
    description: 'Una competición de conocimientos sobre el mundo 4x4 donde los equipos pondrán a prueba su sabiduría sobre vehículos todo terreno, técnicas de conducción off-road, equipamiento de aventura y destinos de exploración.',
    details: [
      'Rondas eliminatorias con preguntas de opción múltiple',
      'Ronda de velocidad con respuestas rápidas',
      'Ronda final sobre destinos y aventuras reales',
      'Premio: Kit de herramientas premium valorado en 300€'
    ]
  },
  'tiro-cuerda': {
    title: 'Tiro de Cuerda por Equipos',
    description: 'La clásica competición de tiro de cuerda donde la fuerza bruta y la estrategia de equipo se combinan para determinar quién tiene el equipo más fuerte del evento.',
    details: [
      'Sistema de torneo directo',
      'Máximo 15 minutos por enfrentamiento',
      '8 personas por equipo, sin sustituciones',
      'Premio: Equipamiento de recuperación valorado en 500€'
    ]
  },
  'carrera-remolque': {
    title: 'Carrera de Remolque 4x4',
    description: '4 personas por equipo arrastrando un vehículo 4x4 hasta la meta. Una prueba que combina fuerza, coordinación y trabajo en equipo en condiciones reales de rescate.',
    details: [
      'Distancia: 50 metros en terreno variado',
      'Cuerdas y arneses proporcionados',
      'Supervisión técnica constante',
      'Premio: Kit de recuperación completo valorado en 800€'
    ]
  },
  'orientacion': {
    title: 'Orientación en Terreno',
    description: 'Una prueba de orientación real usando únicamente brújula y mapa topográfico. Los participantes deben encontrar puntos de control en el terreno asturiano demostrando sus habilidades de navegación.',
    details: [
      'Modalidad: Individual o parejas',
      'Duración: 45 minutos máximo',
      '5 puntos de control secretos',
      'Premio: Brújula profesional Suunto valorada en 200€'
    ]
  },
  'fotografia': {
    title: 'Concurso de Fotografía',
    description: 'Un concurso de fotografía que se desarrolla durante todo el evento. Los participantes deben capturar los momentos más representativos de la aventura, la comunidad y la naturaleza asturiana.',
    details: [
      '4 categorías: Aventura, Naturaleza, Comunidad, Detalles técnicos',
      'Máximo 3 fotos por categoría',
      'Resolución mínima: 1920x1080',
      'Premio: Cámara de acción GoPro Hero 11 valorada en 400€'
    ]
  },
  'masterchef': {
    title: 'MasterChef Overland',
    description: 'La competición culinaria más extrema del evento. Los equipos deben preparar un menú completo usando únicamente el equipamiento que llevan en sus vehículos, demostrando sus habilidades de supervivencia culinaria.',
    details: [
      'Equipos de 2-3 personas',
      'Duración: 60 minutos',
      'Solo ingredientes del vehículo',
      'Premio: Kit de cocina premium valorado en 600€'
    ]
  }
};

function openActivityModal(activityId) {
  const activity = activityData[activityId];
  if (!activity) return;

  const modal = document.getElementById('activityModal');
  const title = document.getElementById('modalTitle');
  const description = document.getElementById('modalDescription');
  const details = document.getElementById('modalDetails');

  title.textContent = activity.title;
  description.textContent = activity.description;
  
  details.innerHTML = '<ul>' + activity.details.map(detail => `<li>${detail}</li>`).join('') + '</ul>';

  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  
  // Re-initialize Lucide icons in the modal
  setTimeout(() => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }, 100);
}

function closeActivityModal() {
  const modal = document.getElementById('activityModal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
  const modal = document.getElementById('activityModal');
  if (event.target === modal) {
    closeActivityModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeActivityModal();
  }
});

