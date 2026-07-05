/* ==========================================================================
   ALIANÇA DELTA ENGENHARIA - INTERACTIVE JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. DOM Elements ---
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('back-to-top');
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const statNumbers = document.querySelectorAll('.stat-number');
  const sections = document.querySelectorAll('section');

  // --- 2. Sticky Header ---
  const handleHeaderScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // --- 3. Mobile Navigation Menu Toggle ---
  const toggleMobileMenu = () => {
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  };

  const closeMobileMenu = () => {
    mobileToggle.classList.remove('active');
    navMenu.classList.remove('active');
  };

  mobileToggle.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when clicking on nav links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
      
      // Update active state manually on click
      navLinks.forEach(item => item.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Close menu when clicking outside of nav
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target) && navMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // --- 4. Navigation Link Active Scroll Spy ---
  const scrollSpy = () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120; // offset for sticky nav

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  // --- 5. Back to Top Button Control ---
  const handleBackToTopVisibility = () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  };

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // --- 6. Stats Section Counter Animation ---
  let animatedStats = false;

  const animateStats = () => {
    statNumbers.forEach(stat => {
      const targetStr = stat.getAttribute('data-target');
      if (!targetStr) return; // For stats like '24/7' or '100%' that don't need counting up

      const target = parseFloat(targetStr);
      let current = 0;
      const duration = 2000; // 2 seconds
      const steps = 50;
      const increment = target / steps;
      const stepTime = duration / steps;

      const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
          stat.textContent = targetStr.includes('+') ? `+${Math.round(target)}` : `${Math.round(target)}+`;
          clearInterval(counter);
        } else {
          stat.textContent = targetStr.includes('+') ? `+${Math.round(current)}` : `${Math.round(current)}+`;
        }
      }, stepTime);
    });
    animatedStats = true;
  };

  // IntersectionObserver for Stats Section
  const statsSection = document.querySelector('.stats-section');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animatedStats) {
          animateStats();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
  } else {
    // Fallback if IntersectionObserver is not supported
    setTimeout(animateStats, 1000);
  }

  // --- 7. Contact Form Submission (Simulated) ---
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      
      // Show loading status in button
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Enviando...';
      
      // Clear previous status
      formStatus.className = 'form-status';
      formStatus.textContent = '';

      // Get values for possible custom success message or verification
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const service = document.getElementById('service').value;
      const message = document.getElementById('message').value;

      // Simulate API call (1.5 seconds)
      setTimeout(() => {
        try {
          // In a real application, you would send this to a backend server (e.g. via fetch)
          console.log('Dados do Form de Contato:', { name, email, phone, service, message });

          // Show Success Status
          formStatus.classList.add('success');
          formStatus.innerHTML = `<strong>Sucesso!</strong> Olá ${name.split(' ')[0]}, sua mensagem foi enviada. Entraremos em contato em breve pelo telefone/WhatsApp informado ou e-mail!`;
          
          // Clear Form Fields
          contactForm.reset();
        } catch (error) {
          // Show Error Status
          formStatus.classList.add('error');
          formStatus.innerHTML = '<strong>Erro!</strong> Ocorreu um problema ao enviar sua mensagem. Por favor, tente novamente ou entre em contato pelo WhatsApp.';
        } finally {
          // Restore button state
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
          
          // Fade out status message after 10 seconds
          setTimeout(() => {
            formStatus.style.transition = 'opacity 0.5s ease';
            formStatus.style.opacity = '0';
            setTimeout(() => {
              formStatus.className = 'form-status';
              formStatus.innerHTML = '';
              formStatus.style.opacity = '1';
            }, 500);
          }, 10000);
        }
      }, 1500);
    });
  }

  // --- 8. Event Listeners ---
  window.addEventListener('scroll', () => {
    handleHeaderScroll();
    scrollSpy();
    handleBackToTopVisibility();
  });

  // Call on load to initialize correct states
  handleHeaderScroll();
  scrollSpy();
  handleBackToTopVisibility();
});
