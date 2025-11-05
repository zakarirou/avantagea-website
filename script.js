// script.js
class AvantageaApp {
    constructor() {
        this.init();
    }

    init() {
        this.initNavbar();
        this.initAnimations();
        this.initCounters();
        this.initSmoothScroll();
    }

    // Navigation responsive
    initNavbar() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });


                        // Fermer le menu quand on clique sur un lien (mobile)
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });

        }

        // Changement de style au scroll
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 4px 20px rgba(45, 140, 255, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });
    }

    // Animations au scroll
    initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observer les éléments à animer
        document.querySelectorAll('.solution-card, .stat-card, .benefit-item, .app-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }

    // Compteurs animés
    initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    counters.forEach(counter => {
                        const updateCount = () => {
                            const target = +counter.getAttribute('data-count');
                            const count = +counter.innerText;
                            const increment = target / speed;

                            if (count < target) {
                                counter.innerText = Math.ceil(count + increment);
                                setTimeout(updateCount, 1);
                            } else {
                                counter.innerText = target;
                            }
                        };
                        updateCount();
                    });
                }
            });
        });

        const statsSection = document.querySelector('.stats');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    // Scroll fluide
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Gestion du changement de langue
class LanguageManager {
    constructor() {
        this.currentLang = 'fr';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSavedLanguage();
    }

    setupEventListeners() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.getAttribute('data-lang');
                this.switchLanguage(lang);
            });
        });
    }

    switchLanguage(lang) {
        if (lang === this.currentLang) return;
        
        this.currentLang = lang;
        
        // Mettre à jour les boutons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });

        // Sauvegarder la préférence
        localStorage.setItem('preferredLang', lang);
        
        // Rediriger vers la bonne version
        if (lang === 'ar') {
            window.location.href = 'index-ar.html';
        } else {
            window.location.href = 'index.html';
        }
    }

    loadSavedLanguage() {
        const savedLang = localStorage.getItem('preferredLang');
        if (savedLang) {
            this.currentLang = savedLang;
            // Mettre à jour le bouton actif
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-lang') === savedLang) {
                    btn.classList.add('active');
                }
            });
        }
    }
}

// Gestion des formulaires
class ContactForm {
    constructor() {
        this.init();
    }

    init() {
        this.handleFormSubmission();
    }

    handleFormSubmission() {
        const form = document.querySelector('.contact-form form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitForm(form);
            });
        }
    }

    submitForm(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Simulation d'envoi
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;

        // Ici vous intégrerez Formspree ou autre service
        setTimeout(() => {
            alert('Message envoyé avec succès ! Nous vous recontacterons rapidement.');
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
}

// Animation des formes flottantes
function animateShapes() {
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        shape.style.animationDelay = `${index * 2}s`;
    });
}

// Initialisation quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    new AvantageaApp();
    new ContactForm();
    new LanguageManager();
    animateShapes();
});