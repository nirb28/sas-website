document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('.fade-in');

    // Function to check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9;
    }

    // Function to handle fade-in on scroll
    function handleScroll() {
        sections.forEach(section => {
            if (isElementInViewport(section)) {
                section.classList.add('visible');
            }
        });
    }

    // Initial check on load
    handleScroll();

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Contact form submission logic
    document.addEventListener('DOMContentLoaded', function () {
        const contactForm = document.getElementById('contactForm'); // The form element
        const formContainer = document.querySelector('.contact-form'); // Wrapper around the form
    
        // Add event listener to intercept the form submission
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Stop the default form submission (page reload)
    
            // Clear any existing error messages
            clearErrors();
    
            // Form field values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            let isValid = true;
    
            // Validate fields
            if (!name) {
                showError('name', 'Name is required.');
                isValid = false;
            }
            if (!email || !validateEmail(email)) {
                showError('email', 'A valid email is required.');
                isValid = false;
            }
            if (!message) {
                showError('message', 'Message is required.');
                isValid = false;
            }
    
            // If valid, replace the form with a "Thank You" message
            if (isValid) {
                formContainer.innerHTML = `
                    <div class="thank-you-message">
                        <h2>Thank you for your message!</h2>
                        <p>Watch your inbox for a response. We'll get back to you as soon as possible.</p>
                    </div>
                `;
            }
        });
    
        // Function to show an error message below the input
        function showError(fieldId, message) {
            const field = document.getElementById(fieldId);
            const error = document.createElement('div');
            error.className = 'error-message';
            error.textContent = message;
            field.parentNode.appendChild(error); // Add error message below the field
            field.classList.add('error'); // Highlight the field with an error
        }
    
        // Function to clear all error messages
        function clearErrors() {
            document.querySelectorAll('.error-message').forEach((error) => error.remove());
            document.querySelectorAll('.error').forEach((field) => field.classList.remove('error'));
        }
    
        // Function to validate email format
        function validateEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
    });
    
    
    
    // end submission logic
});
//stary background 
document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const wrapper = document.querySelector('.contact-wrapper');
    wrapper.insertBefore(canvas, wrapper.firstChild); // Changed to insert at beginning
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    canvas.style.minHeight = '100vh';

    const stars = [];
    const maxStars = 7; // Maximum number of stars
    const starSize = 100; // Base size for stars

    // Helper function to draw a 3D polyhedron star
    function drawPolyhedronStar(x, y, size, rotation) {
        const edges = [];
        const radius = size / 2;

        // Define vertices of a 3D star-like polyhedron
        const vertices = [];
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2; // Divide into 12 points
            const z = i % 2 === 0 ? radius : -radius; // Alternate "z" for 3D effect
            vertices.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
                z,
            });
        }

        // Connect vertices to form edges
        for (let i = 0; i < vertices.length; i++) {
            for (let j = i + 1; j < vertices.length; j++) {
                edges.push([vertices[i], vertices[j]]);
            }
        }

        ctx.save();
        ctx.translate(x, y); // Move to the star's position
        ctx.rotate(rotation); // Apply rotation

        // Draw edges with gray dots
        edges.forEach(([v1, v2]) => {
            const p1 = project3D(v1);
            const p2 = project3D(v2);

            ctx.beginPath();
            ctx.arc(p1.x, p1.y, 2, 0, Math.PI * 2); // Draw first vertex as a dot
            ctx.fillStyle = '#999999'; // Gray color
            ctx.fill();

            ctx.beginPath();
            ctx.arc(p2.x, p2.y, 2, 0, Math.PI * 2); // Draw second vertex as a dot
            ctx.fillStyle = '#999999';
            ctx.fill();

            // Optionally connect dots with lines for debugging
            // ctx.strokeStyle = '#999999';
            // ctx.lineWidth = 0.5;
            // ctx.beginPath();
            // ctx.moveTo(p1.x, p1.y);
            // ctx.lineTo(p2.x, p2.y);
            // ctx.stroke();
        });

        ctx.restore();
    }

    // Project 3D point into 2D space
    function project3D(vertex) {
        const perspective = 500; // Perspective distance
        const scale = perspective / (perspective - vertex.z);
        return {
            x: vertex.x * scale,
            y: vertex.y * scale,
        };
    }

    // Initialize stars
    function createStars() {
        stars.length = 0;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        for (let i = 0; i < maxStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: starSize,
                dx: Math.random() * 2 - 1, // Faster movement
                dy: Math.random() * 2 - 1, // Faster movement
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: Math.random() * 0.05 - 0.025, // Spin speed
            });
        }
    }

    // Draw stars
    function drawStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

        stars.forEach((star) => {
            drawPolyhedronStar(star.x, star.y, star.size, star.rotation);
        });
    }

    // Update star positions and rotation
    function updateStars() {
        stars.forEach((star) => {
            // Update position
            star.x += star.dx;
            star.y += star.dy;

            // Update rotation
            star.rotation += star.rotationSpeed;

            // Wrap around edges
            if (star.x < -star.size) star.x = canvas.width + star.size;
            if (star.x > canvas.width + star.size) star.x = -star.size;
            if (star.y < -star.size) star.y = canvas.height + star.size;
            if (star.y > canvas.height + star.size) star.y = -star.size;
        });
    }

    // Animation loop
    function animate() {
        updateStars();
        drawStars();
        requestAnimationFrame(animate);
    }

    // Initialize and start animation
    createStars();
    animate();

    // Resize canvas on window resize
    window.addEventListener('resize', createStars);
});

document.addEventListener('DOMContentLoaded', function () {
    // Select all elements with the 'fade-in' class
    const fadeInElements = document.querySelectorAll('.fade-in');

    // Add the 'visible' class to each element with a delay
    fadeInElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, index * 150); // Stagger animations by 150ms
    });
});

