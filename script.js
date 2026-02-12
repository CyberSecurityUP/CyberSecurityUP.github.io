/* ============================================
   JOAS ANTONIO DOS SANTOS - PORTFOLIO
   Interactive Effects & Animations
   ============================================ */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initParticles();
    initMatrixRain();
    initCursorTrail();
    initNavbar();
    initTypewriter();
    initCounters();
    initRevealAnimations();
    initSmoothScroll();
});

/* ============================================
   PRELOADER
   ============================================ */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }, 1500);
    });
    // Fallback
    setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 4000);
}

/* ============================================
   PARTICLE SYSTEM
   ============================================ */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.color = Math.random() > 0.7 ? '#00f0ff' : Math.random() > 0.5 ? '#7b2fff' : '#ff0066';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;

            // Mouse interaction
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= dx * force * 0.02;
                    this.y -= dy * force * 0.02;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    // Create particles
    const particleCount = Math.min(80, Math.floor(window.innerWidth / 15));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 240, 255, ${0.08 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
    }
    animate();
}

/* ============================================
   MATRIX RAIN
   ============================================ */
function initMatrixRain() {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(1);

    function draw() {
        ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00f0ff';
        ctx.font = fontSize + 'px JetBrains Mono, monospace';

        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(draw, 50);
}

/* ============================================
   CURSOR TRAIL
   ============================================ */
function initCursorTrail() {
    const cursor = document.getElementById('cursor-trail');
    if (window.innerWidth < 768) return;

    let cursorVisible = false;

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        if (!cursorVisible) {
            cursor.classList.add('visible');
            cursorVisible = true;
        }
    });

    document.addEventListener('mouseout', () => {
        cursor.classList.remove('visible');
        cursorVisible = false;
    });

    // Enlarge on hover over links and buttons
    const interactiveElements = document.querySelectorAll('a, button, .btn, .repo-card, .skill-card, .project-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursor.style.borderColor = '#ff0066';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = '#00f0ff';
        });
    });
}

/* ============================================
   NAVBAR
   ============================================ */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Hamburger menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = navLinks.querySelector(`a[href="#${id}"]`);
            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    link.style.color = 'var(--primary)';
                } else {
                    link.style.color = '';
                }
            }
        });
    });
}

/* ============================================
   TYPEWRITER EFFECT
   ============================================ */
function initTypewriter() {
    const element = document.getElementById('typewriter');
    const texts = [
        'Red Team Operations Expert',
        'MITRE ATT&CK Contributor',
        'Cybersecurity Researcher',
        'Author of 15+ Books',
        'AI & Machine Learning Engineer',
        'iBest 2025 Top Influencer',
        'DevSecOps Specialist',
        'University Teacher',
        'International Speaker',
        'Blue Team Leader',
        'Creator of Yen Programming Language'
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let speed = 60;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            element.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            speed = 30;
        } else {
            element.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            speed = 60;
        }

        if (!isDeleting && charIndex === currentText.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            speed = 300;
        }

        setTimeout(type, speed);
    }

    type();
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let triggered = false;

    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;

            function updateCounter() {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }
            updateCounter();
        });
    }

    // Trigger on scroll to hero stats
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !triggered) {
                    triggered = true;
                    animateCounters();
                }
            });
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    }
}

/* ============================================
   REVEAL ANIMATIONS (Scroll)
   ============================================ */
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
}

/* ============================================
   TILT EFFECT ON CARDS (Desktop only)
   ============================================ */
if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.skill-card, .project-card');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            } else {
                card.style.transform = '';
            }
        });
    });
}

/* ============================================
   MAGNETIC BUTTON EFFECT
   ============================================ */
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

/* ============================================
   PARALLAX EFFECT ON SCROLL
   ============================================ */
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const hero = document.querySelector('.hero-grid-bg');
    if (hero) {
        hero.style.transform = `perspective(500px) rotateX(5deg) translateY(${scrolled * 0.3}px)`;
    }
});

/* ============================================
   TEXT SCRAMBLE EFFECT ON SECTION TITLES
   ============================================ */
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}--=+*^?#________';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.textContent;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise(resolve => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.chars[Math.floor(Math.random() * this.chars.length)];
                    this.queue[i].char = char;
                }
                output += char;
            } else {
                output += from;
            }
        }
        this.el.textContent = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
}

// Apply text scramble to section titles on scroll
const sectionTitles = document.querySelectorAll('.section-title');
const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const originalText = el.getAttribute('data-text') || el.textContent;
            const scramble = new TextScramble(el);
            scramble.setText(originalText);
            titleObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

sectionTitles.forEach(title => titleObserver.observe(title));

/* ============================================
   KONAMI CODE EASTER EGG
   ============================================ */
const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.keyCode === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            document.body.style.animation = 'rainbow 2s ease-in-out';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 2000);
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});
