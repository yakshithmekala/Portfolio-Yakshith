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
    initContactModal();
    renderCertifications();
    initAnimations();
    initMagneticText();
    initHeroBackground();
    initActiveNav();
    initGlobalScrollNav();
    initParallax();
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
            const currentX = gsap.getProperty(el, "x") || 0;
            const currentY = gsap.getProperty(el, "y") || 0;
            const rect = el.getBoundingClientRect();
            
            const originalLeft = rect.left - currentX;
            const originalTop = rect.top - currentY;
            
            const x = clientX - (originalLeft + rect.width / 2);
            const y = clientY - (originalTop + rect.height / 2);

            // Follows the mouse extremely closely, allowing it to be dragged across the screen
            gsap.to(el, {
                x: x * 0.9,
                y: y * 0.9,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 1,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
}
// --- Parallax Effect ---
function initParallax() {
    const rocket = document.querySelector('.floating-rocket');
    const planet = document.querySelector('.myth-planet');
    
    if (!rocket && !planet) return;

    window.addEventListener('mousemove', (e) => {
        // Calculate offset from the center of the screen
        const xOffset = e.clientX - window.innerWidth / 2;
        const yOffset = e.clientY - window.innerHeight / 2;
        
        // Move the rocket
        if (rocket) {
            gsap.to(rocket, {
                marginLeft: xOffset * 1.5,
                marginTop: yOffset * 1.5,
                duration: 1.5,
                ease: 'power2.out'
            });
        }
        
        // Move the saturn planet
        if (planet) {
            gsap.to(planet, {
                marginLeft: xOffset * -0.5,
                marginTop: yOffset * -0.5,
                duration: 2,
                ease: 'power2.out'
            });
        }
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

// --- Global Scroll Navigation ---
function initGlobalScrollNav() {
    const pages = [
        '/',
        '/about.html',
        '/projects.html',
        '/education.html',
        '/skills.html',
        '/certifications.html',
        '/contact.html'
    ];
    
    let currentPath = window.location.pathname;
    if (currentPath === '' || currentPath.endsWith('index.html')) currentPath = '/';
    
    const currentIndex = pages.indexOf(currentPath);
    if (currentIndex === -1) return;
    
    let isNavigating = false;
    let accumulatedDelta = 0;
    let resetTimer = null;
    
    window.addEventListener('wheel', (e) => {
        if (isNavigating) return;
        
        const atBottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 5;
        const atTop = window.scrollY <= 5;
        const delta = e.deltaY;
        
        // Reset the accumulator feeling after a short pause of not scrolling
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => accumulatedDelta = 0, 150);
        
        if (delta > 0 && atBottom) {
            accumulatedDelta += delta;
            if (accumulatedDelta > 100) { // Threshold reached
                if (currentIndex < pages.length - 1) {
                    isNavigating = true;
                    document.body.style.opacity = '0';
                    document.body.style.transition = 'opacity 0.4s ease';
                    setTimeout(() => window.location.href = pages[currentIndex + 1], 400);
                }
            }
        } else if (delta < 0 && atTop) {
            accumulatedDelta += delta;
            if (accumulatedDelta < -100) { // Threshold reached
                if (currentIndex > 0) {
                    isNavigating = true;
                    document.body.style.opacity = '0';
                    document.body.style.transition = 'opacity 0.4s ease';
                    setTimeout(() => window.location.href = pages[currentIndex - 1], 400);
                }
            }
        }
    }, { passive: true });

    let touchstartY = 0;
    window.addEventListener('touchstart', e => {
        touchstartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    window.addEventListener('touchend', e => {
        if (isNavigating) return;
        
        const touchendY = e.changedTouches[0].screenY;
        const atBottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 5;
        const atTop = window.scrollY <= 5;
        const dist = touchstartY - touchendY;
        
        if (dist > 50 && atBottom) { // Swipe up
            if (currentIndex < pages.length - 1) {
                isNavigating = true;
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.4s ease';
                setTimeout(() => window.location.href = pages[currentIndex + 1], 400);
            }
        } else if (dist < -50 && atTop) { // Swipe down
            if (currentIndex > 0) {
                isNavigating = true;
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.4s ease';
                setTimeout(() => window.location.href = pages[currentIndex - 1], 400);
            }
        }
    }, { passive: true });
}

// --- Custom Cursor ---
function initCustomCursor() {
    const cursorDot = document.createElement('div');
    const cursorOutline = document.createElement('div');
    const cursorGlow = document.createElement('div');
    
    cursorDot.classList.add('cursor-dot');
    cursorOutline.classList.add('cursor-outline');
    cursorGlow.classList.add('cursor-glow');
    
    document.body.appendChild(cursorGlow);
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);
    
    let isMoving = false;
    let timeout;
    
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards", easing: "ease-out" });
        
        cursorGlow.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 1200, fill: "forwards", easing: "ease-out" });
        
        isMoving = true;
        cursorOutline.style.opacity = '1';
        cursorGlow.style.opacity = '1';
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            isMoving = false;
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorGlow.style.opacity = '0';
        }, 150);
    });
    
    window.addEventListener('mouseout', () => {
        cursorDot.style.opacity = '0';
        cursorOutline.style.opacity = '0';
        cursorGlow.style.opacity = '0';
    });
    
    window.addEventListener('mouseover', () => {
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '1';
    });
    
    document.querySelectorAll('a, button, .magnetic-text, .bento-card, .social-link').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.borderColor = 'transparent';
            cursorOutline.style.background = 'rgba(167, 139, 250, 0.4)'; // Violet accent
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(2)';
            
            // Generate some particle trails just for visual flair when interacting
            for(let i=0; i<3; i++) {
                createTrailPixel(el.getBoundingClientRect());
            }
        });
        
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.borderColor = 'rgba(167, 139, 250, 0.7)';
            cursorOutline.style.background = 'transparent';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

function createTrailPixel(rect) {
    const pixel = document.createElement('div');
    pixel.className = 'cursor-trail';
    
    const x = rect.left + Math.random() * rect.width;
    const y = rect.top + Math.random() * rect.height;
    
    const colors = ['#6366f1', '#a78bfa', '#f472b6']; // Indigo, Violet, Pink
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    pixel.style.left = `${x}px`;
    pixel.style.top = `${y}px`;
    pixel.style.background = color;
    
    document.body.appendChild(pixel);
    
    gsap.to(pixel, {
        y: y - 50 - Math.random() * 50,
        x: x + (Math.random() - 0.5) * 50,
        opacity: 0,
        scale: 0,
        duration: 0.5 + Math.random() * 0.5,
        ease: 'power1.out',
        onComplete: () => pixel.remove()
    });
}

// --- Contact Modal ---
function initContactModal() {
    // 1. Inject Modal HTML into the page
    const modalHTML = `
        <div class="modal-overlay" id="contact-modal">
            <div class="modal-content">
                <button class="close-btn" id="close-modal">&times;</button>
                <div class="section-header" style="margin-bottom: 20px;">
                    <div class="glass-pill" style="margin-bottom: 10px;">Get in Touch</div>
                    <h2 style="font-size: 2rem;">Let's Create Magic</h2>
                </div>
                <form id="popup-contact-form">
                    <div class="form-group">
                        <label for="popup-name">Name</label>
                        <input type="text" id="popup-name" name="name" placeholder="Yakshith" required>
                    </div>
                    <div class="form-group">
                        <label for="popup-email">Email</label>
                        <input type="email" id="popup-email" name="email" placeholder="google@example.com" required>
                    </div>
                    <div class="form-group">
                        <label for="popup-message">Message</label>
                        <textarea id="popup-message" name="message" rows="4" placeholder="Your message here..." required></textarea>
                    </div>
                    <button type="submit" id="popup-submit-btn" class="btn btn-primary" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;">
                        <span class="btn-text">Send Message</span>
                        <div class="loader" style="display: none; width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    </button>
                </form>
                <div id="popup-form-status" style="display: none; text-align: center; margin-top: 20px;">
                    <div class="glass-pill" style="background: rgba(34, 197, 94, 0.1); border-color: #22c55e; color: #22c55e; padding: 10px 20px; width: 100%;">
                        Message sent successfully! ✨
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('contact-modal');
    const closeBtn = document.getElementById('close-modal');
    
    // 2. Intercept Contact Links
    const contactLinks = document.querySelectorAll('a[href="/contact.html"], a[href="contact.html"]');
    contactLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    // 3. Close Modal Logic
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // 4. Form Submission Logic
    const form = document.getElementById('popup-contact-form');
    const submitBtn = document.getElementById('popup-submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loader = submitBtn.querySelector('.loader');
    const status = document.getElementById('popup-form-status');
    const FORMSPREE_ID = 'xgonkaog';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        submitBtn.disabled = true;
        btnText.textContent = 'Sending...';
        loader.style.display = 'block';
        
        const formData = new FormData(form);
        
        try {
            const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                gsap.to(form, { opacity: 0, scale: 0.9, duration: 0.5, onComplete: () => {
                    form.style.display = 'none';
                    status.style.display = 'block';
                    gsap.fromTo(status, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' });
                }});
            } else {
                throw new Error('Failed to send');
            }
        } catch (error) {
            alert('Oops! There was a problem sending your message. Please try again.');
            submitBtn.disabled = false;
            btnText.textContent = 'Send Message';
            loader.style.display = 'none';
        }
    });
}
