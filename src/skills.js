const canvas = document.getElementById('skills-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let bubbles = [];
    const skills = [
        'React', 'JavaScript', 'Node.js', 'CSS', 'HTML', 'Next.js', 'Vite', 
        'Docker', 'AWS', 'Python', 'Figma',  'SQL', 'Git', 'MongoDB', 'Kubernetes','Java','C','DSA'
        ];

    const resize = () => {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class Bubble {
        constructor(text) {
            this.text = text;
            this.radius = text.length * 4 + 15;
            this.x = Math.random() * (width - this.radius * 2) + this.radius;
            this.y = Math.random() * (height - this.radius * 2) + this.radius;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.color = `hsla(${Math.random() * 360}, 60%, 60%, 0.1)`;
            this.borderColor = `hsla(${Math.random() * 360}, 60%, 60%, 0.5)`;
        }

        update(mouse) {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off walls
            if (this.x < this.radius || this.x > width - this.radius) this.vx *= -1;
            if (this.y < this.radius || this.y > height - this.radius) this.vy *= -1;

            // Mouse interaction
            if (mouse.x && mouse.y) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const angle = Math.atan2(dy, dx);
                    const force = (150 - dist) / 150;
                    this.vx += Math.cos(angle) * force * 0.5;
                    this.vy += Math.sin(angle) * force * 0.5;
                }
            }

            // Friction
            this.vx *= 0.99;
            this.vy *= 0.99;
            
            // Limit speed
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > 5) {
                this.vx = (this.vx / speed) * 5;
                this.vy = (this.vy / speed) * 5;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.strokeStyle = this.borderColor;
            ctx.lineWidth = 2;
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = 'white';
            ctx.font = '500 14px Outfit';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.text, this.x, this.y);
        }
    }

    skills.forEach(skill => bubbles.push(new Bubble(skill)));

    let mouse = { x: null, y: null };
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        bubbles.forEach(b => {
            b.update(mouse);
            b.draw();
        });
        requestAnimationFrame(animate);
    };

    animate();
}
