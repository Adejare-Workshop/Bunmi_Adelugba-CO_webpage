document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Optional: Animate hamburger into an 'X'
            hamburger.classList.toggle('toggle');
        });
    }

    // 2. Scroll Animation (Fade in & Slide up)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once it has animated
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => observer.observe(el));

    // 3. Number Counter Animation for Stats
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the slower

    const startCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target.querySelector('.counter') || entry.target;
                
                if (counter.classList.contains('counter')) {
                    const updateCount = () => {
                        const target = +counter.getAttribute('data-target');
                        const count = +counter.innerText;
                        
                        // Calculate increment
                        const inc = target / speed;

                        if (count < target) {
                            counter.innerText = Math.ceil(count + inc);
                            setTimeout(updateCount, 15);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCount();
                    // Stop observing to only count up once
                    observer.unobserve(entry.target);
                }
            }
        });
    };

    const counterObserver = new IntersectionObserver(startCounters, {
        threshold: 0.5 
    });

    // Observe each stat item container
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => counterObserver.observe(item));

});
// 4. Form Handling Logic (Append inside the DOMContentLoaded event listener)
    const contactForm = document.getElementById('bac-contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submit-btn');
            const originalBtnText = submitBtn.innerText;
            
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            // Collect form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                service: document.getElementById('service').value,
                message: document.getElementById('message').value
            };

            try {
                // Change URL to your deployed FastAPI backend later
                const response = await fetch('http://127.0.0.1:8000/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    formStatus.style.display = 'block';
                    formStatus.style.color = '#10b981'; // Success green
                    formStatus.innerText = 'Message sent successfully! We will get back to you soon.';
                    contactForm.reset();
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error('Error:', error);
                formStatus.style.display = 'block';
                formStatus.style.color = '#ef4444'; // Error red
                formStatus.innerText = 'An error occurred. Please try again later.';
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                
                // Hide status message after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
            }
        });
    }

// 5. Interactive Canvas Background (Data Network)
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray;

        // Resize canvas to fit the hero section
        canvas.width = window.innerWidth;
        canvas.height = canvas.parentElement.offsetHeight;

        // Get mouse position
        let mouse = {
            x: null,
            y: null,
            radius: 120 // Distance for lines to connect to the mouse
        };

        // Track mouse movement over the hero section
        canvas.parentElement.addEventListener('mousemove', function(event) {
            const rect = canvas.getBoundingClientRect();
            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;
        });

        // Reset mouse position when it leaves the hero area
        canvas.parentElement.addEventListener('mouseout', function() {
            mouse.x = null;
            mouse.y = null;
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            canvas.width = window.innerWidth;
            canvas.height = canvas.parentElement.offsetHeight;
            init(); // Re-initialize to adjust particle density
        });

        // Create the Particle object
        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }
            // Draw individual particle
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = '#3B82F6'; // BAC Secondary Blue
                ctx.globalAlpha = 0.4; // Keep it subtle
                ctx.fill();
            }
            // Move particle and check boundaries
            update() {
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        // Populate the particle array
        function init() {
            particlesArray = [];
            // Control density based on screen size
            let numberOfParticles = (canvas.height * canvas.width) / 10000;
            
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 1) - 0.5; // Very slow movement
                let directionY = (Math.random() * 1) - 0.5;
                let color = '#3B82F6';
                
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        // Draw lines connecting nearby particles and the mouse
        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                                   ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    
                    // Connect particles to each other
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 12000);
                        ctx.strokeStyle = 'rgba(59, 130, 246,' + (opacityValue * 0.2) + ')'; // Very faint blue lines
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
                
                // Connect particles to the mouse
                if (mouse.x != null && mouse.y != null) {
                    let mouseDistance = ((particlesArray[a].x - mouse.x) * (particlesArray[a].x - mouse.x)) + 
                                        ((particlesArray[a].y - mouse.y) * (particlesArray[a].y - mouse.y));
                    
                    if (mouseDistance < mouse.radius * mouse.radius) {
                        let mouseOpacity = 1 - (mouseDistance / (mouse.radius * mouse.radius));
                        ctx.strokeStyle = 'rgba(15, 23, 42, ' + (mouseOpacity * 0.3) + ')'; // Primary navy color for mouse connection
                        ctx.lineWidth = 1.5;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
        }

        // The animation loop
        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        }

        init();
        animate();
    }