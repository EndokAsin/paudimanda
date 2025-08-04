/**
 * PAUD Imanda - Main JavaScript File
 * Mengatur semua interaktivitas dan fungsionalitas website
 */

document.addEventListener('DOMContentLoaded', function() {
    // ==================== HEADER EFFECT ON SCROLL ====================
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        });
    }

    // ==================== SMOOTH SCROLLING ====================
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

    // ==================== LIGHTBOX GALLERY ====================
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

    // ==================== GALLERY FILTER ====================
    const filterButtons = document.querySelectorAll('.gallery-filter button');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length > 0 && galleryItems.length > 0) {
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
                        setTimeout(() => {
                            item.style.opacity = '1';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // ==================== TESTIMONIAL SLIDER ====================
    if (document.querySelector('.testimonial-slider')) {
        let currentSlide = 0;
        let slideInterval;
        const slides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.testimonial-dot');
        const slider = document.querySelector('.testimonial-slider');

        function showSlide(n) {
            // Reset semua slide dan dots
            slides.forEach(slide => slide.classList.remove('active'));
            if (dots.length > 0) {
                dots.forEach(dot => dot.classList.remove('active'));
            }
            
            // Hitung slide yang akan ditampilkan
            currentSlide = (n + slides.length) % slides.length;
            
            // Aktifkan slide dan dot yang sesuai
            slides[currentSlide].classList.add('active');
            if (dots.length > 0 && dots[currentSlide]) {
                dots[currentSlide].classList.add('active');
            }
        }

        // Hanya jalankan jika ada slide
        if (slides.length > 0) {
            // Tambahkan event listener untuk dots jika ada
            if (dots.length > 0) {
                dots.forEach((dot, index) => {
                    dot.addEventListener('click', () => showSlide(index));
                });
            }

            // Auto slide change setiap 5 detik
            function startSlider() {
                slideInterval = setInterval(() => {
                    showSlide(currentSlide + 1);
                }, 5000);
            }

            // Hentikan interval ketika mouse masuk ke slider
            if (slider) {
                slider.addEventListener('mouseenter', () => {
                    clearInterval(slideInterval);
                });

                // Lanjutkan interval ketika mouse keluar
                slider.addEventListener('mouseleave', startSlider);
            }

            // Inisialisasi slide pertama dan mulai slider
            showSlide(0);
            startSlider();
        }
    }

    // ==================== FORM VALIDATION ====================
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            const requiredInputs = this.querySelectorAll('[required]');
            
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = '#ff4444';
                    isValid = false;
                    
                    // Tambahkan efek shake pada input yang kosong
                    input.classList.add('shake');
                    setTimeout(() => {
                        input.classList.remove('shake');
                    }, 500);
                } else {
                    input.style.borderColor = '#E8F5E9';
                }
            });

            if (!isValid) {
                e.preventDefault();
                
                // Buat elemen pesan error jika belum ada
                let errorMsg = this.querySelector('.error-message');
                if (!errorMsg) {
                    errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.style.color = '#ff4444';
                    errorMsg.style.marginTop = '10px';
                    this.appendChild(errorMsg);
                }
                errorMsg.textContent = 'Silakan lengkapi semua field yang wajib diisi!';
                
                return false;
            }
            
            // Jika form valid, tampilkan pesan sukses
            e.preventDefault();
            alert('Terima kasih! Pesan Anda telah berhasil dikirim.');
            this.reset();
            
            // Hapus pesan error jika ada
            const errorMsg = this.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        });
    });

    // ==================== ANIMATE ON SCROLL ====================
    const animateElements = () => {
        const elements = document.querySelectorAll('.fade-in:not(.animated)');
        const windowHeight = window.innerHeight;
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('animated');
                
                // Tambahkan delay berdasarkan atribut data-delay
                const delay = element.getAttribute('data-delay') || 0;
                element.style.animationDelay = `${delay}ms`;
            }
        });
    };

    // Jalankan saat pertama kali dimuat
    animateElements();
    
    // Jalankan saat scroll
    window.addEventListener('scroll', animateElements);
    
    // Jalankan saat resize
    window.addEventListener('resize', animateElements);

    // ==================== MOBILE MENU TOGGLE ====================
    function initMobileMenu() {
        const nav = document.querySelector('nav');
        const headerContainer = document.querySelector('.header-container');
        
        if (!nav || !headerContainer) return;
        
        // Cek lebar layar
        if (window.innerWidth <= 768) {
            // Cek apakah toggle button sudah ada
            let menuToggle = document.querySelector('.mobile-menu-toggle');
            
            if (!menuToggle) {
                // Buat toggle button jika belum ada
                menuToggle = document.createElement('button');
                menuToggle.className = 'mobile-menu-toggle';
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                headerContainer.prepend(menuToggle);
                
                // Sembunyikan menu awal
                nav.style.display = 'none';
                
                // Tambahkan event listener
                menuToggle.addEventListener('click', function() {
                    if (nav.style.display === 'none' || !nav.style.display) {
                        nav.style.display = 'block';
                        this.innerHTML = '<i class="fas fa-times"></i>';
                    } else {
                        nav.style.display = 'none';
                        this.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                });
                
                // Tutup menu saat mengklik link
                document.querySelectorAll('nav a').forEach(link => {
                    link.addEventListener('click', () => {
                        nav.style.display = 'none';
                        if (menuToggle) {
                            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                        }
                    });
                });
            }
        } else {
            // Untuk layar besar, pastikan menu ditampilkan
            nav.style.display = '';
            
            // Hapus toggle button jika ada
            const menuToggle = document.querySelector('.mobile-menu-toggle');
            if (menuToggle) {
                menuToggle.remove();
            }
        }
    }

    // Inisialisasi mobile menu
    initMobileMenu();
    window.addEventListener('resize', initMobileMenu);

    // ==================== BACK TO TOP BUTTON ====================
    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTopButton);

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.visibility = 'visible';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.visibility = 'hidden';
        }
    });
});

// ==================== CSS UNTUK BACK TO TOP BUTTON ====================
const backToTopCSS = `
.back-to-top {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
}

.back-to-top:hover {
    background-color: #388E3C;
    transform: translateY(-3px);
}

.shake {
    animation: shake 0.5s;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}
`;

// Tambahkan CSS ke dalam dokumen
const styleElement = document.createElement('style');
styleElement.textContent = backToTopCSS;
document.head.appendChild(styleElement);
