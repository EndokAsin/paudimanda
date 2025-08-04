document.addEventListener('DOMContentLoaded', function() {
    // Header effect on scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without page jump
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    location.hash = targetId;
                }
            }
        });
    });

    // Lightbox functionality for gallery
    if (document.querySelector('.gallery-grid')) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <span class="lightbox-close">&times;</span>
            <img class="lightbox-content" src="" alt="">
            <div class="lightbox-caption"></div>
        `;
        document.body.appendChild(lightbox);

        const galleryItems = document.querySelectorAll('.gallery-item');
        const lightboxImg = lightbox.querySelector('.lightbox-content');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const closeBtn = lightbox.querySelector('.lightbox-close');

        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').src;
                const imgAlt = this.querySelector('img').alt;
                
                lightbox.style.display = 'flex';
                lightboxImg.src = imgSrc;
                lightboxCaption.textContent = imgAlt;
                document.body.style.overflow = 'hidden';
            });
        });

        closeBtn.addEventListener('click', function() {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Gallery filter
    const filterButtons = document.querySelectorAll('.gallery-filter button');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Testimonial slider
    if (document.querySelector('.testimonial-slider')) {
        let currentSlide = 0;
        const testimonials = document.querySelectorAll('.testimonial');
        const dots = document.querySelectorAll('.testimonial-dot');
        
        function showTestimonial(n) {
            testimonials.forEach(testimonial => testimonial.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            currentSlide = (n + testimonials.length) % testimonials.length;
            testimonials[currentSlide].classList.add('active');
            if (dots.length > 0) {
                dots[currentSlide].classList.add('active');
            }
        }
        
        if (dots.length > 0) {
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => showTestimonial(index));
            });
        }
        
        // Auto slide change every 5 seconds
        setInterval(() => showTestimonial(currentSlide + 1), 5000);
    }

    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            const requiredInputs = this.querySelectorAll('[required]');
            
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = '#ff4444';
                    isValid = false;
                } else {
                    input.style.borderColor = '#E8F5E9';
                }
            });

            if (!isValid) {
                e.preventDefault();
                alert('Silakan lengkapi semua field yang wajib diisi!');
                return false;
            }
            
            // Show success message
            alert('Terima kasih! Pesan Anda telah berhasil dikirim.');
            this.reset();
            e.preventDefault();
        });
    });

    // Animate elements on scroll
    const animateElements = () => {
        const elements = document.querySelectorAll('.fade-in:not(.animated)');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('animated');
                
                // Add delay based on data-delay attribute
                const delay = element.getAttribute('data-delay') || 0;
                element.style.animationDelay = `${delay}ms`;
            }
        });
    };

    // Initial check
    animateElements();
    
    // Check on scroll
    window.addEventListener('scroll', animateElements);
    
    // Check on resize
    window.addEventListener('resize', animateElements);
});

// Mobile menu toggle (add this if you want mobile menu)
function initMobileMenu() {
    const menuToggle = document.createElement('button');
    menuToggle.className = 'mobile-menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    const nav = document.querySelector('nav');
    const headerContainer = document.querySelector('.header-container');
    
    if (window.innerWidth <= 768) {
        headerContainer.prepend(menuToggle);
        nav.style.display = 'none';
        
        menuToggle.addEventListener('click', function() {
            if (nav.style.display === 'none' || !nav.style.display) {
                nav.style.display = 'block';
                this.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                nav.style.display = 'none';
                this.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                nav.style.display = 'none';
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
}

// Initialize mobile menu on load and resize
window.addEventListener('load', initMobileMenu);
window.addEventListener('resize', initMobileMenu);