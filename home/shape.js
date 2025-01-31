document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    document.getElementById('shapeCanvas').appendChild(canvas);

    // Configuration
    const config = {
        shapes: 4,
        dotsPerEdge: 8,
        dotSize: 1.5,
        dotOpacity: 0.2,
        rotationSpeed: 0.0015,
        floatSpeed: 0.7,
        shapeSize: 80,
        minDistance: 200  // Minimum distance between shapes
    };

    let width, height;
    let shapes = [];

    const shapeTypes = {
        cube: {
            vertices: [
                [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
                [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
            ],
            edges: [
                [0,1], [1,2], [2,3], [3,0],
                [4,5], [5,6], [6,7], [7,4],
                [0,4], [1,5], [2,6], [3,7]
            ]
        },
        pyramid: {
            vertices: [
                [-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1], [0, 1, 0]
            ],
            edges: [
                [0,1], [1,2], [2,3], [3,0],
                [0,4], [1,4], [2,4], [3,4]
            ]
        },
        octahedron: {
            vertices: [
                [1,0,0], [-1,0,0], [0,1,0],
                [0,-1,0], [0,0,1], [0,0,-1]
            ],
            edges: [
                [4,0], [4,1], [4,2], [4,3],
                [5,0], [5,1], [5,2], [5,3],
                [0,2], [2,1], [1,3], [3,0]
            ]
        },
        dodecahedron: {
            vertices: [
                // The golden ratio ≈ 1.618
                // Coordinates are based on (±1, ±1/φ, ±0), (±1/φ, ±0, ±1), (±0, ±1, ±1/φ)
                // First set
                [1, 1, 1], [-1, 1, 1], [1, -1, 1], [-1, -1, 1],
                [1, 1, -1], [-1, 1, -1], [1, -1, -1], [-1, -1, -1],
                
                // Second set
                [0, 0.618, 1.618], [0, -0.618, 1.618],
                [0, 0.618, -1.618], [0, -0.618, -1.618],
                
                // Third set
                [1.618, 0, 0.618], [-1.618, 0, 0.618],
                [1.618, 0, -0.618], [-1.618, 0, -0.618],
                
                // Fourth set
                [0.618, 1.618, 0], [-0.618, 1.618, 0],
                [0.618, -1.618, 0], [-0.618, -1.618, 0]
            ],
            edges: [
                // Connecting vertices to form the pentagonal faces
                [0,8], [8,1], [1,17], [17,16], [16,0],  // Upper front pentagon
                [2,9], [9,3], [3,19], [19,18], [18,2],  // Lower front pentagon
                [4,10], [10,5], [5,17], [17,16], [16,4], // Upper back pentagon
                [6,11], [11,7], [7,19], [19,18], [18,6], // Lower back pentagon
                
                // Connecting the pentagons
                [0,12], [12,2], [1,13], [13,3],   // Front edges
                [4,14], [14,6], [5,15], [15,7],   // Back edges
                [8,9], [10,11],                   // Middle connecting edges
                [16,18], [17,19]                  // Side connecting edges
            ]
        }
    };

    function getRandomEdgePosition() {
        const margin = config.minDistance;
        const edge = Math.floor(Math.random() * 4);
        const pos = Math.random();
        
        switch(edge) {
            case 0: return { x: width * pos, y: -margin, angle: Math.PI * (0.25 + Math.random() * 0.5) };
            case 1: return { x: width + margin, y: height * pos, angle: Math.PI * (0.75 + Math.random() * 0.5) };
            case 2: return { x: width * pos, y: height + margin, angle: Math.PI * (1.25 + Math.random() * 0.5) };
            case 3: return { x: -margin, y: height * pos, angle: Math.PI * (1.75 + Math.random() * 0.5) };
        }
    }

    class Shape {
        constructor(type) {
            this.type = type;
            this.resetPosition();
            this.scale = config.shapeSize * (0.8 + Math.random() * 0.4);
            this.rotationX = Math.random() * Math.PI * 2;
            this.rotationY = Math.random() * Math.PI * 2;
            this.rotationZ = Math.random() * Math.PI * 2;
            this.rotationSpeedX = (Math.random() - 0.5) * config.rotationSpeed;
            this.rotationSpeedY = (Math.random() - 0.5) * config.rotationSpeed;
            this.rotationSpeedZ = (Math.random() - 0.5) * config.rotationSpeed;
        }

        checkCollision(otherShape) {
            const dx = this.x - otherShape.x;
            const dy = this.y - otherShape.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < config.minDistance;
        }

        resetPosition() {
            let attempts = 0;
            let validPosition = false;
            
            while (!validPosition && attempts < 10) {
                const newPos = getRandomEdgePosition();
                this.x = newPos.x;
                this.y = newPos.y;
                this.moveAngle = newPos.angle;
                this.speed = 1 + Math.random() * 0.5;

                validPosition = true;
                for (let shape of shapes) {
                    if (shape !== this && this.checkCollision(shape)) {
                        validPosition = false;
                        break;
                    }
                }
                attempts++;
            }
            
            if (!validPosition) {
                setTimeout(() => this.resetPosition(), 16);
            }
        }

        update() {
            this.rotationX += this.rotationSpeedX;
            this.rotationY += this.rotationSpeedY;
            this.rotationZ += this.rotationSpeedZ;

            const oldX = this.x;
            const oldY = this.y;

            this.x += Math.cos(this.moveAngle) * this.speed;
            this.y += Math.sin(this.moveAngle) * this.speed;

            let hasCollision = false;
            for (let shape of shapes) {
                if (shape !== this && this.checkCollision(shape)) {
                    hasCollision = true;
                    break;
                }
            }

            if (hasCollision) {
                this.x = oldX;
                this.y = oldY;
                this.resetPosition();
            }

            const margin = config.minDistance;
            if (this.x < -margin || this.x > width + margin || 
                this.y < -margin || this.y > height + margin) {
                this.resetPosition();
            }
        }

        rotatePoint(point) {
            let [x, y, z] = point;
            
            let temp = y;
            y = y * Math.cos(this.rotationX) - z * Math.sin(this.rotationX);
            z = temp * Math.sin(this.rotationX) + z * Math.cos(this.rotationX);
            
            temp = x;
            x = x * Math.cos(this.rotationY) + z * Math.sin(this.rotationY);
            z = -temp * Math.sin(this.rotationY) + z * Math.cos(this.rotationY);
            
            temp = x;
            x = x * Math.cos(this.rotationZ) - y * Math.sin(this.rotationZ);
            y = temp * Math.sin(this.rotationZ) + y * Math.cos(this.rotationZ);
            
            return [x, y, z];
        }

        draw() {
            const shapeData = shapeTypes[this.type];
            const rotatedVertices = shapeData.vertices.map(v => this.rotatePoint(v));

            shapeData.edges.forEach(edge => {
                const start = rotatedVertices[edge[0]];
                const end = rotatedVertices[edge[1]];
                
                for (let i = 0; i <= config.dotsPerEdge; i++) {
                    const t = i / config.dotsPerEdge;
                    const x = start[0] + (end[0] - start[0]) * t;
                    const y = start[1] + (end[1] - start[1]) * t;
                    const z = start[2] + (end[2] - start[2]) * t;

                    const projectedX = this.x + x * this.scale;
                    const projectedY = this.y + y * this.scale;

                    ctx.beginPath();
                    ctx.arc(projectedX, projectedY, config.dotSize, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(0, 0, 0, ${config.dotOpacity})`;
                    ctx.fill();
                }
            });
        }
    }

    function init() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        shapes = [];
        const types = Object.keys(shapeTypes);
        for (let i = 0; i < config.shapes; i++) {
            shapes.push(new Shape(types[i % types.length]));
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        shapes.forEach(shape => {
            shape.update();
            shape.draw();
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', init);

    init();
    animate();
});