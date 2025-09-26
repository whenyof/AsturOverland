// ASTUR OVERLAND — Interactions

const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Smooth scroll for internal links (basic, native)
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      console.log('Clicked link:', targetId); // Debug
      const el = document.querySelector(targetId);
      console.log('Target element found:', el); // Debug
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
        console.log('Scrolling to:', targetId); // Debug
      } else {
        console.error('Target element not found:', targetId); // Debug
      }
    });
  });
});

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

// Gallery Carousel functionality with modal support
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

// Reviews Carousel functionality
class ReviewsCarousel {
  constructor() {
    this.track = document.querySelector('.reviews-track');
    if (!this.track) return;
    
    this.cards = this.track.querySelectorAll('.review-card');
    this.isPaused = false;
    this.animationDuration = 30; // seconds
    this.isAnimating = false;
    
    this.init();
  }
  
  init() {
    this.duplicateCards();
    this.bindEvents();
    this.startInfiniteAnimation();
  }
  
  duplicateCards() {
    // Duplicate cards for seamless loop - we need exactly the same set again
    const cardsHTML = Array.from(this.cards).map(card => card.outerHTML).join('');
    this.track.insertAdjacentHTML('beforeend', cardsHTML);
    
    // Update the cards reference to include the duplicated ones
    this.cards = this.track.querySelectorAll('.review-card');
  }
  
  bindEvents() {
    // Pause on hover
    this.track.addEventListener('mouseenter', () => {
      this.pauseAnimation();
    });
    
    this.track.addEventListener('mouseleave', () => {
      this.resumeAnimation();
    });
    
    // Pause on touch
    this.track.addEventListener('touchstart', () => {
      this.pauseAnimation();
    }, { passive: true });
    
    this.track.addEventListener('touchend', () => {
      setTimeout(() => this.resumeAnimation(), 1000);
    }, { passive: true });
  }
  
  startInfiniteAnimation() {
    // Reset position to start
    this.track.style.transform = 'translateX(0)';
    this.track.style.animation = 'none';
    
    // Force reflow
    this.track.offsetHeight;
    
    // Calculate the exact distance to move (half of total content width)
    const totalWidth = this.track.scrollWidth;
    const halfWidth = totalWidth / 2;
    
    // Create a custom animation that moves exactly half the distance
    const keyframes = `
      @keyframes slideReviewsSeamless {
        0% { transform: translateX(0); }
        100% { transform: translateX(-${halfWidth}px); }
      }
    `;
    
    // Add the keyframes to the document
    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);
    
    // Start animation with the custom keyframes
    this.track.style.animation = `slideReviewsSeamless ${this.animationDuration}s linear infinite`;
  }
  
  pauseAnimation() {
    this.track.style.animationPlayState = 'paused';
    this.isPaused = true;
  }
  
  resumeAnimation() {
    if (this.isPaused) {
      this.track.style.animationPlayState = 'running';
      this.isPaused = false;
    }
  }
}

// Gallery Expand functionality
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

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new GalleryCarousel();
  new ReviewsCarousel();
  new GalleryExpand();
  
  // Inicializar animaciones de popup para el logo y la información
  initHeroAnimations();
});

// Hero animations initialization
function initHeroAnimations() {
  const logoCenter = document.querySelector('.hero-logo-center');
  const heroInfo = document.querySelector('.hero-info-static');
  const heroLayout = document.querySelector('.hero-layout');
  
  if (logoCenter && heroInfo && heroLayout) {
    // Activar animaciones de popup al cargar la página
    setTimeout(() => {
      logoCenter.classList.add('popup-animation');
    }, 100);
    
    setTimeout(() => {
      heroInfo.classList.add('popup-animation');
    }, 400);
    
    // Deshabilitar completamente el click en el logo
    logoCenter.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
    
    // Prevenir todos los eventos de interacción del logo
    logoCenter.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    
    logoCenter.addEventListener('mouseup', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    
    logoCenter.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    
    // Hacer que el logo no sea clickeable pero permita hover
    logoCenter.style.pointerEvents = 'none';
    logoCenter.style.cursor = 'default';
    
    // Manejar el hover a nivel del layout para ocultar la información
    heroLayout.addEventListener('mouseenter', () => {
      heroInfo.style.opacity = '0';
      heroInfo.style.transform = 'translateY(20px)';
      // No deshabilitar pointer events para mantener los botones clickeables
    });
    
    heroLayout.addEventListener('mouseleave', () => {
      heroInfo.style.opacity = '1';
      heroInfo.style.transform = 'translateY(0)';
      // No necesitamos restaurar pointer events ya que no los deshabilitamos
    });
  }
}


