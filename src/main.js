import { gsap } from 'gsap';

// --- Data ---
const certs = [
    { title: "AWS Cloud Practitioner ", issuer: "Amazon Web Services", date: "DEC 2025", link: "https://www.credly.com/badges/0dbe9c9d-09fb-4e9d-8e5a-cf70e275ec41/public_url" },
    { title: "MongoDB Associate Developer", issuer: "MongoDB", date: "DEC 2024", link: "https://www.credly.com/badges/56f8a116-1806-4985-b54a-238d5b4c903a/public_url" },
    { title: "Automation Anywhere Advanced", issuer: "Automation Anywhere", date: "JUL 2025", link: "https://certificates.automationanywhere.com/2990a7c7-2f79-4e9d-a305-4cd169432b73#acc.MjSgqEZ4" },
    { title: "Meta Front-End Developer", issuer: "Meta", date: "Jun 2023", link: "#" }
];

function renderCertifications() {
    const container = document.getElementById('certifications-container');
    if (!container) return;

    container.innerHTML = certs.map(cert => `
        <div class="bento-card" style="display: flex; justify-content: space-between; align-items: center; opacity: 0;">
            <div>
                <h3>${cert.title}</h3>
                <p style="color: var(--text-secondary); margin-top: 5px;">${cert.issuer} | Issued ${cert.date}</p>
            </div>
            <a href="${cert.link}" target="_blank" class="btn btn-primary">Verify</a>
        </div>
    `).join('');
}

// --- Initialization ---
const init = () => {
    renderCertifications();
    initAnimations();
    initMagneticText();
    initHeroBackground();
    initActiveNav();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// --- Animations ---
function initAnimations() {
    // 1. Reveal page headers and static reveal elements
    gsap.to('.reveal', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.2
    });

    // 2. Gravity effect for certification cards (independent of .reveal)
    gsap.to('.bento-card', {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        stagger: 0.1,
        ease: 'power4.out',
        delay: 0.4,
        startAt: { y: 100, scale: 0.9, opacity: 0 }
    });
}

// --- Magnetic Text ---
function initMagneticText() {
    const magneticElements = document.querySelectorAll('.magnetic-text');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = el.getBoundingClientRect();

            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);

            gsap.to(el, {
                x: x * 0.4,
                y: y * 0.4,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
}

// --- Hero Background (Canvas Particles) ---
function initHeroBackground() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    const resize = () => {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', resize);
    resize();
    // Initial delay to wait for layout
    setTimeout(resize, 100);

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 1.5 + 0.5; // Smaller stars
            this.vx = (Math.random() - 0.5) * 0.2; // Slower drift
            this.vy = (Math.random() - 0.5) * 0.2;
            this.twinkleSpeed = Math.random() * 0.05 + 0.01;
            this.alpha = Math.random();
            this.color = `rgba(255, 255, 255, ${this.alpha})`;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Twinkle effect
            this.alpha += this.twinkleSpeed;
            if (this.alpha > 1 || this.alpha < 0.2) this.twinkleSpeed *= -1;

            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
            ctx.fill();
            
            // Subtle glow for larger stars
            if (this.size > 1.2) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'var(--accent-primary)';
            } else {
                ctx.shadowBlur = 0;
            }
        }
    }

    for (let i = 0; i < 150; i++) { // More stars
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();
}

// --- Navbar Active State ---
function initActiveNav() {
    const path = window.location.pathname;
    const links = document.querySelectorAll('.nav-links a');

    links.forEach(link => {
        if (link.getAttribute('href') === path) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}
