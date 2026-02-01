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
        const navLinks = document.querySelectorAll('.nav-link');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Fermer le menu quand on clique sur un lien (mobile)
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }

        // Marquer le lien actif
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // Changement de style au scroll
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (window.scrollY > 100) {
                    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                    navbar.style.boxShadow = '0 4px 20px rgba(45, 140, 255, 0.1)';
                } else {
                    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                    navbar.style.boxShadow = 'none';
                }
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
                    // Arrêter d'observer après animation
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observer les éléments à animer
        const animatedElements = document.querySelectorAll(
            '.solution-card, .stat-card, .benefit-item, .app-card, .offer-card'
        );
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }

    // Compteurs animés
    initCounters() {
        const counters = document.querySelectorAll('[data-count]');
        if (counters.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    counters.forEach(counter => {
                        const target = parseInt(counter.getAttribute('data-count'));
                        if (isNaN(target)) return;
                        
                        const currentText = counter.textContent.trim();
                        const currentValue = parseInt(currentText) || 0;
                        
                        // Ne pas relancer l'animation si déjà faite
                        if (currentValue >= target) return;
                        
                        this.animateCounter(counter, target);
                    });
                    observer.disconnect(); // Arrêter après première animation
                }
            });
        }, { threshold: 0.5 });

        const statsSection = document.querySelector('.stats') || document.querySelector('.hero');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    animateCounter(counter, target) {
        const duration = 2000; // 2 secondes
        const frameDuration = 1000 / 60; // 60fps
        const totalFrames = Math.round(duration / frameDuration);
        let frame = 0;

        const easeOutQuad = t => t * (2 - t);

        const updateCounter = () => {
            frame++;
            const progress = frame / totalFrames;
            const easedProgress = easeOutQuad(progress);
            const currentValue = Math.round(target * easedProgress);

            counter.textContent = currentValue;

            if (frame < totalFrames) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        requestAnimationFrame(updateCounter);
    }

    // Scroll fluide
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 80; // Hauteur de la navbar
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
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
            // Vérifier si on est déjà sur la page arabe
            if (!window.location.pathname.includes('-ar.html')) {
                const currentPage = window.location.pathname.split('/').pop();
                const arabicPage = currentPage.replace('.html', '-ar.html') || 'index-ar.html';
                window.location.href = arabicPage;
            }
        } else {
            // Vérifier si on est déjà sur la page française
            if (window.location.pathname.includes('-ar.html')) {
                const currentPage = window.location.pathname.split('/').pop();
                const frenchPage = currentPage.replace('-ar.html', '.html') || 'index.html';
                window.location.href = frenchPage;
            }
        }
    }

    loadSavedLanguage() {
        const savedLang = localStorage.getItem('preferredLang') || 'fr';
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

// Animation des formes flottantes
function animateShapes() {
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        shape.style.animationDelay = `${index * 2}s`;
    });
}

// Gestion des formulaires de contact
class ContactForm {
    constructor() {
        this.init();
    }

    init() {
        const form = document.getElementById('contactForm');
        if (form) {
            this.handleFormSubmission(form);
        }
    }

    handleFormSubmission(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const responseElement = document.getElementById('formResponse');
            const originalText = submitBtn.innerHTML;
            
            // Afficher le chargement
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            submitBtn.disabled = true;
            
            if (responseElement) {
                responseElement.style.display = 'none';
            }

            try {
                // Récupérer les données du formulaire
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                // Envoyer les données à l'API
                const response = await fetch('https://avantagea.vercel.app/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                // Afficher le résultat
                if (responseElement) {
                    responseElement.style.display = 'block';
                    responseElement.style.color = result.success ? 'green' : 'red';
                    responseElement.textContent = result.message;
                }

                if (result.success) {
                    form.reset();
                }
            } catch (error) {
                console.error('Erreur:', error);
                if (responseElement) {
                    responseElement.style.display = 'block';
                    responseElement.style.color = 'red';
                    responseElement.textContent = 'Une erreur est survenue. Veuillez réessayer.';
                }
            } finally {
                // Restaurer le bouton
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// Effet de parallaxe léger
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-background');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });
}

// Initialisation quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    const app = new AvantageaApp();
    const contactForm = new ContactForm();
    const languageManager = new LanguageManager();
    
    animateShapes();
    initParallax();
    
    // Préchargement des polices (amélioration de performance)
    if ('fonts' in document) {
        document.fonts.load('1em Inter').then(() => {
            document.body.style.opacity = '1';
        });
    } else {
        document.body.style.opacity = '1';
    }
});

// Gestion du redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    // Fermer le menu mobile si on redimensionne vers desktop
    if (window.innerWidth > 768 && navMenu && hamburger) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});