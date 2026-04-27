const canvas = document.getElementById('globe-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size (high DPI support)
const size = 600;
canvas.width = size;
canvas.height = size;
canvas.style.width = size + 'px';
canvas.style.height = size + 'px';

const centerX = size / 2;
const centerY = size / 2;
const radius = 220;
const dots = [];
const numDots = 800; // Number of dots on the globe

// Initialize dots on a sphere
for (let i = 0; i < numDots; i++) {
    // Golden angle for even distribution
    const phi = Math.acos(-1 + (2 * i) / numDots);
    const theta = Math.sqrt(numDots * Math.PI) * phi;

    dots.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.cos(phi),
        z: radius * Math.sin(phi) * Math.sin(theta),
        baseX: radius * Math.sin(phi) * Math.cos(theta),
        baseZ: radius * Math.sin(phi) * Math.sin(theta)
    });
}

let rotation = 0;

function animate() {
    ctx.clearRect(0, 0, size, size);
    
    // Rotate the globe
    rotation += 0.005; // Adjust speed here

    dots.forEach(dot => {
        // Rotate around Y axis
        const x = dot.baseX * Math.cos(rotation) - dot.baseZ * Math.sin(rotation);
        const z = dot.baseX * Math.sin(rotation) + dot.baseZ * Math.cos(rotation);
        
        // 3D projection to 2D
        // Visual 'perspective' scale, dots closer are larger/brighter
        const scale = 400 / (400 - z); 
        const x2d = centerX + x * scale;
        const y2d = centerY + dot.y * scale;

        // Draw only if dot is on the 'front' half
        if (scale > 0.6) { // z is less than roughly radius/2 from behind
            const alpha = Math.max(0, (scale - 0.5)); // Fade out dots at the back
            ctx.fillStyle = `rgba(100, 200, 100, ${alpha * 0.6})`; // Greenish tint
            
            ctx.beginPath();
            ctx.arc(x2d, y2d, 1.5 * scale, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    requestAnimationFrame(animate);
}

animate();
