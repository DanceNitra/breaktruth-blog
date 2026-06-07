// Breaktruth Blog — Main JavaScript (decorative only)

document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initParticles();
    renderHeroDiagram();
});

// === CURSOR ===
function initCursor() {
    const glow = document.querySelector('.cursor-glow');
    if (!glow) return;
    let x = 0, y = 0;
    document.addEventListener('mousemove', (e) => {
        x = e.clientX;
        y = e.clientY;
        glow.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    });
    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
}

// === PARTICLES ===
function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(108, 92, 231, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < 80; i++) particles.push(new Particle());
    let mouseX = w/2, mouseY = h/2;
    document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });

    function animate() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => { p.update(); p.draw(); });
        particles.forEach((a, i) => {
            for (let j = i + 1; j < particles.length; j++) {
                const b = particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const dxM = a.x - mouseX;
                const dyM = a.y - mouseY;
                const distM = Math.sqrt(dxM * dxM + dyM * dyM);
                if (dist < 120 && distM < 250) {
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(108, 92, 231, ${0.08 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// === HERO DIAGRAM ===
function renderHeroDiagram() {
    const canvas = document.getElementById('featured-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;
    
    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        w = canvas.width = rect.width || 500;
        h = canvas.height = rect.height || 300;
        draw();
    }
    resize();
    window.addEventListener('resize', resize);
    
    function draw() {
        ctx.clearRect(0, 0, w, h);
        const cx = w / 2, cy = h / 2;
        const outerR = Math.min(w, h) * 0.35;
        
        const nodes = [];
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
            nodes.push({
                x: cx + Math.cos(angle) * outerR,
                y: cy + Math.sin(angle) * outerR,
                label: ['Neuroscience', 'AI', 'Finance', 'Physics', 'Complexity', 'Biology', 'Philosophy', 'Networks'][i],
                color: ['#6c5ce7','#a855f7','#00d4aa','#f59e0b','#ef4444','#3b82f6','#8b5cf6','#10b981'][i]
            });
        }
        
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const alpha = 0.1 + Math.random() * 0.15;
                ctx.beginPath();
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
                ctx.strokeStyle = `rgba(108, 92, 231, ${alpha})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
        
        nodes.forEach(n => {
            const gradient = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 20);
            gradient.addColorStop(0, n.color);
            gradient.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(n.x, n.y, 20, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(n.x, n.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = n.color;
            ctx.fill();
            
            ctx.fillStyle = '#9898b0';
            ctx.font = '10px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(n.label, n.x, n.y + 32);
        });
        
        const cGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30);
        cGradient.addColorStop(0, 'rgba(108,92,231,0.6)');
        cGradient.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(cx, cy, 30, 0, Math.PI * 2);
        ctx.fillStyle = cGradient;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#6c5ce7';
        ctx.fill();
        ctx.fillStyle = '#e8e8f0';
        ctx.font = 'bold 9px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Φ', cx, cy + 3);
    }
}
