document.addEventListener("DOMContentLoaded", () => {
  // 1. Inicializar iconos Lucide
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Menú desplegable accesible y animado
  const menuButton = document.getElementById("menu-button");
  const dropdownMenu = document.getElementById("dropdown-menu");

  if (menuButton && dropdownMenu) {
    menuButton.addEventListener("click", () => {
      const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isExpanded));
      menuButton.classList.toggle("active");
      dropdownMenu.classList.toggle("is-open");

      if (!isExpanded) {
        dropdownMenu.querySelector('a')?.focus();
      }
    });

    document.addEventListener('click', (event) => {
      if (!menuButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
        if (dropdownMenu.classList.contains('is-open')) {
          menuButton.setAttribute('aria-expanded', 'false');
          menuButton.classList.remove("active");
          dropdownMenu.classList.remove("is-open");
        }
      }
    });
  }

  // 3. Animación de "Fade In" en secciones al hacer scroll
  const fadeInElements = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  fadeInElements.forEach(el => observer.observe(el));
  
  // 4. LÓGICA DE SCROLL PARA LA ANIMACIÓN DEL LOGO
  const siteLogo = document.getElementById('site-logo');
  const SCROLL_THRESHOLD = 50;

  if (siteLogo) {
    const handleLogoAnimation = () => {
      if (window.scrollY > SCROLL_THRESHOLD) {
        siteLogo.classList.add('enlarged');
      } else {
        siteLogo.classList.remove('enlarged');
      }
    };
    window.addEventListener('scroll', handleLogoAnimation, { passive: true });
    handleLogoAnimation(); 
  }

  // 5. Validación del Formulario de Contacto
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');
      let isValid = true;

      clearErrors();

      if (name.value.trim() === '') {
        showError(name, 'El nombre es obligatorio.');
        isValid = false;
      }
      if (email.value.trim() === '') {
        showError(email, 'El correo electrónico es obligatorio.');
        isValid = false;
      } else if (!isValidEmail(email.value.trim())) {
        showError(email, 'Por favor, introduce un correo electrónico válido.');
        isValid = false;
      }
      if (message.value.trim() === '') {
        showError(message, 'El mensaje no puede estar vacío.');
        isValid = false;
      }

      if (isValid) {
        displayStatus('success', '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
        contactForm.reset();
      } else {
        displayStatus('error', 'Por favor, corrige los errores del formulario.');
      }
    });

    function showError(input, message) {
      input.classList.add('input-error');
      const formGroup = input.parentElement;
      const errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      errorElement.innerText = message;
      formGroup.appendChild(errorElement);
    }

    function clearErrors() {
      document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
      document.querySelectorAll('.error-message').forEach(el => el.remove());
      const statusMessage = document.getElementById('status-message');
      statusMessage.textContent = '';
      statusMessage.className = 'status-message';
    }
    
    function isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function displayStatus(type, message) {
      const statusEl = document.getElementById('status-message');
      statusEl.textContent = message;
      statusEl.className = `status-message ${type}`;

      setTimeout(() => {
          statusEl.style.opacity = 0;
          statusEl.style.visibility = 'hidden';
          statusEl.className = 'status-message';
      }, 5000);
    }
  }

  // 6. Smooth scroll para enlaces de ancla
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      let href = this.getAttribute('href');
      if (href.length > 1 && href !== "#") {
        let targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          if (dropdownMenu?.classList.contains("is-open")) {
            menuButton.click();
          }
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });
});