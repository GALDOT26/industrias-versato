// ══════════════════════════════════════════════
// VERSATO — Interactive Script
// ══════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

    // ── Sticky Nav scroll effect ──
    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ── Mobile menu toggle ──
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    if (toggle) {
        toggle.addEventListener('click', () => links.classList.toggle('open'));
        links.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => links.classList.remove('open'));
        });
    }

    // ── Active nav link on scroll ──
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
        });
        navLinks.forEach(l => {
            l.classList.remove('active');
            if (l.getAttribute('href') === '#' + current) l.classList.add('active');
        });
    });

    // ── Counter animation ──
    const counters = document.querySelectorAll('.hero-stat-number[data-count]');
    let counted = false;
    const animateCounters = () => {
        if (counted) return;
        counted = true;
        counters.forEach(el => {
            const target = +el.dataset.count;
            const duration = 1500;
            const start = performance.now();
            const tick = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(target * eased);
                if (progress < 1) requestAnimationFrame(tick);
                else el.textContent = target;
            };
            requestAnimationFrame(tick);
        });
    };
    // Trigger after a short delay
    setTimeout(animateCounters, 800);

    // ── Lightbox ──
    window.openLightbox = function(imageSrc) {
        if (!imageSrc) return;
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        if (lightbox && lightboxImg) {
            lightboxImg.src = imageSrc;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };
    
    window.closeLightbox = function() {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // ── Reveal on scroll ──
    const reveals = document.querySelectorAll(
        '.section-about, .section-brands, .section-video, .section-contact, .section-newsletter, .brand-image-card, .contact-info-card, .contact-map'
    );
    reveals.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));

    // ── Brand cards stagger ──
    const brandCards = document.querySelectorAll('.brand-image-card');
    const brandObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 100);
                brandObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    brandCards.forEach(c => brandObserver.observe(c));

    // ── Smooth scroll for anchors ──
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ── Form submit handler ──
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const btn = document.getElementById('btn-submit');
            btn.textContent = '✓ ENVIADO';
            btn.style.background = '#2a6e3f';
            btn.style.color = '#fff';
            setTimeout(() => {
                btn.textContent = 'ENVIAR CONSULTA';
                btn.style.background = '';
                btn.style.color = '';
                contactForm.reset();
            }, 3000);
        });
    }

    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', e => {
            e.preventDefault();
            const btn = document.getElementById('btn-subscribe');
            btn.textContent = '✓ SUBSCRIPTO';
            setTimeout(() => {
                btn.textContent = 'SUBSCRIBIRSE';
                newsletterForm.reset();
            }, 3000);
        });
    }

    // ── Audio Player Logic ──
    const audioBtn = document.getElementById('audio-toggle');
    const audioIcon = document.getElementById('audio-icon');
    const bgMusic = document.getElementById('bg-music');
    
    if (audioBtn && bgMusic) {
        bgMusic.volume = 1.0;
        let isPlaying = false;
        let userMuted = false;

        const tryPlay = () => {
            if (userMuted) return; // Si el usuario lo silenció manual, no insistir
            const playPromise = bgMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    audioIcon.className = 'fas fa-volume-up';
                    isPlaying = true;
                }).catch(() => {
                    // Sigue bloqueado por el navegador
                    isPlaying = false;
                });
            }
        };

        // Intentar apenas carga
        tryPlay();

        // Enlazar eventos de interacción real para destrabar el audio
        const interactionEvents = ['click', 'touchstart', 'keydown'];
        interactionEvents.forEach(evt => {
            document.addEventListener(evt, () => {
                if (!isPlaying && !userMuted) {
                    tryPlay();
                }
            }, { passive: true });
        });

        // Botón manual
        audioBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isPlaying) {
                bgMusic.pause();
                audioIcon.className = 'fas fa-volume-mute';
                isPlaying = false;
                userMuted = true; // El usuario lo apagó a propósito
            } else {
                userMuted = false;
                bgMusic.play().then(() => {
                    audioIcon.className = 'fas fa-volume-up';
                    isPlaying = true;
                });
            }
        });
    }
});
