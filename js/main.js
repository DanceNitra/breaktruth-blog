// Breaktruth Blog — Main JavaScript

document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initParticles();
    renderArticles();
    renderHeroDiagram();
    initStats();
});

// === CURSOR ===
function initCursor() {
    const glow = document.querySelector('.cursor-glow');
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
        constructor() {
            this.reset();
        }
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
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        // Connection lines near cursor
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

// === RENDER ARTICLES ===
function renderArticles() {
    const grid = document.getElementById('article-grid');
    if (!grid) return;
    
    // Fallback article data if articles.js didn't load
    const articles = window.ARTICLES || [
        {
            id: "breaktruth-21-grid-brain-criticality",
            title: "The Grid and the Brain Share One Criticality",
            subtitle: "Blackout and Seizure Prediction Are the Same Problem",
            date: "2026-06-07", readTime: "25 min", lines: 592,
            excerpt: "The electricity grid and the brain both operate near criticality — small perturbations cascade into system-wide events.",
            tags: ["Complex Systems", "Neuroscience", "Criticality", "Energy"],
            domains: 4, heroColor: "#6c5ce7"
        }
    ];
    
    // Featured
    const latest = articles[0];
    if (latest) {
        document.getElementById('featured-date').textContent = latest.date;
        document.getElementById('featured-read').textContent = latest.readTime;
        document.getElementById('featured-lines').textContent = `${latest.lines} lines`;
        document.getElementById('featured-title').textContent = `${latest.title}: ${latest.subtitle}`;
        document.getElementById('featured-excerpt').textContent = latest.excerpt;
        document.getElementById('featured-tags').innerHTML = latest.tags.map(t => `<span>${t}</span>`).join('');
        document.getElementById('featured-img').style.background = `radial-gradient(circle at 50% 50%, ${latest.heroColor}22, transparent)`;
        document.getElementById('featured-link').href = `articles/${latest.id}/`;
    }
    
    // Grid
    grid.innerHTML = articles.map(a => `
        <article class="article-card">
            <div class="card-image">
                <div class="card-img-placeholder" style="background: radial-gradient(circle at 50% 50%, ${a.heroColor}22, transparent); min-height:200px;"></div>
            </div>
            <div class="card-content">
                <div class="card-meta">
                    <span class="card-date">${a.date}</span>
                    <span class="card-read-time">${a.readTime}</span>
                    <span class="card-lines">${a.lines} lines</span>
                </div>
                <h3 class="card-title">${a.title}</h3>
                <p class="card-excerpt">${a.excerpt.substring(0, 150)}...</p>
                <div class="card-tags">${a.tags.map(t => `<span>${t}</span>`).join('')}</div>
                <a class="card-link" href="articles/${a.id}/">Read Analysis →</a>
            </div>
        </article>
    `).join('');
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
        
        // Draw interconnected nodes (structural isomorphism visual)
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
        
        // Connection lines
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
        
        // Nodes
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
        
        // Center
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

// === STATS ===
function initStats() {
    const articles = window.ARTICLES || [];
    if (!articles.length) return;
    const count = document.getElementById('article-count');
    const lines = document.getElementById('total-lines');
    const domains = document.getElementById('domains-covered');
    if (count) {
        let c = 0, l = 0, d = new Set();
        const interval = setInterval(() => {
            if (c < articles.length) {
                c++; l += articles[c-1].lines;
                articles[c-1].tags.forEach(t => d.add(t));
            }
            count.textContent = c;
            lines.textContent = l.toLocaleString();
            domains.textContent = d.size;
            if (c >= articles.length) clearInterval(interval);
        }, 100);
    }
}
