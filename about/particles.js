class ParticleAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;  // Keep the same count for now
        
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.handleResize());
    }
    
    init() {
        this.handleResize();
        
        // Create particles with darker colors
        for (let i = 0; i < this.particleCount; i++) {
            const greyShade = Math.floor(Math.random() * 100);  // 0-100 for darker greys
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                opacity: Math.random() * 0.4 + 0.4,  // Range from 0.4 to 0.8
                greyShade: greyShade  // Store the grey shade
            });
        }
    }
    
    handleResize() {
        const section = this.canvas.parentElement;
        this.canvas.width = section.offsetWidth;
        this.canvas.height = section.offsetHeight;
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, i) => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.y > this.canvas.height) particle.y = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            
            // Draw particle with grey shade
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${particle.greyShade}, ${particle.greyShade}, ${particle.greyShade}, ${particle.opacity})`;
            this.ctx.fill();
            
            // Draw connections with darker colors
            this.particles.forEach((particle2, j) => {
                if (i === j) return;
                const dx = particle.x - particle2.x;
                const dy = particle.y - particle2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(particle2.x, particle2.y);
                    const opacity = (100 - distance) / 500;  // Increased opacity for connections
                    const connectionShade = Math.floor((particle.greyShade + particle2.greyShade) / 2);
                    this.ctx.strokeStyle = `rgba(${connectionShade}, ${connectionShade}, ${connectionShade}, ${opacity})`;
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ParticleAnimation('particleCanvasAbout');
});