document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       0. Mobile Navigation Toggle
       ========================================= */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    /* =========================================
       0.5 Contact Form Submission Handling
       ========================================= */
    const contactForm = document.getElementById('bac-contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submit-btn');
            const originalBtnText = submitBtn.innerText;
            
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                service: document.getElementById('service').value,
                message: document.getElementById('message').value
            };

            try {
                // Connects to your FastAPI backend
                const response = await fetch('http://127.0.0.1:8000/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    formStatus.style.display = 'block';
                    formStatus.style.color = '#38BDF8'; // Success accent color
                    formStatus.innerText = 'Message sent successfully! We will get back to you soon.';
                    contactForm.reset();
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error('Error:', error);
                formStatus.style.display = 'block';
                formStatus.style.color = '#ef4444'; // Error red
                formStatus.innerText = 'An error occurred. Make sure your Python backend is running.';
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);
            }
        });
    }

    /* =========================================
       1. Advanced Scroll Reveal Animations
       ========================================= */
    const revealOptions = { root: null, rootMargin: '0px', threshold: 0.15 };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Handle staggered animations within a group
                if (entry.target.classList.contains('stagger-group')) {
                    const elements = entry.target.querySelectorAll('.stagger-element');
                    elements.forEach((el, index) => {
                        setTimeout(() => {
                            el.classList.add('active');
                        }, index * 150); // 150ms delay between each card
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    // Observe standard reveals
    document.querySelectorAll('.reveal-up, .reveal-scale, .stagger-group').forEach(el => {
        revealObserver.observe(el);
    });

    /* =========================================
       2. Parallax Scroll Effect
       ========================================= */
    const parallaxElements = document.querySelectorAll('[data-speed]');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        parallaxElements.forEach(el => {
            const speed = el.getAttribute('data-speed');
            el.style.transform = `translateY(${scrolled * speed}px) perspective(1000px) rotateY(-5deg)`;
        });
    });

    /* =========================================
       3. Magnetic Buttons Effect
       ========================================= */
    const magneticButtons = document.querySelectorAll('.magnetic');
    
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const position = btn.getBoundingClientRect();
            const x = e.pageX - position.left - position.width / 2;
            const y = e.pageY - position.top - position.height / 2;
            const strength = btn.getAttribute('data-strength') || 10;
            
            btn.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
        });

        btn.addEventListener('mouseout', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    /* =========================================
       4. Dynamic Counter Animation
       ========================================= */
    const counters = document.querySelectorAll('.counter');
    const startCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target.querySelector('.counter') || entry.target;
                if (counter.classList.contains('counter')) {
                    const updateCount = () => {
                        const target = +counter.getAttribute('data-target');
                        const count = +counter.innerText;
                        const inc = target / 100; // Speed of counter

                        if (count < target) {
                            counter.innerText = Math.ceil(count + inc);
                            setTimeout(updateCount, 20);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCount();
                    observer.unobserve(entry.target);
                }
            }
        });
    };
    const counterObserver = new IntersectionObserver(startCounters, { threshold: 0.5 });
    document.querySelectorAll('.stat-item').forEach(item => counterObserver.observe(item));

    /* =========================================
       5. Interactive Node Network Background
       ========================================= */
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let mouse = { x: null, y: null, radius: 150 };

        window.addEventListener('mousemove', function(event) {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        window.addEventListener('mouseout', function() {
            mouse.x = null;
            mouse.y = null;
        });

        window.addEventListener('resize', function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        });

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
                
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function initParticles() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 12000;
            
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 0.5;
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 0.8) - 0.4;
                let directionY = (Math.random() * 0.8) - 0.4;
                let color = 'rgba(56, 189, 248, 0.4)'; // Light blue accent
                
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        function connectParticles() {
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                                   ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    
                    if (distance < (canvas.width / 10) * (canvas.height / 10)) {
                        let opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = `rgba(59, 130, 246, ${opacityValue * 0.15})`; // Faint blue connections
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
                
                if (mouse.x != null && mouse.y != null) {
                    let mouseDistance = ((particlesArray[a].x - mouse.x) * (particlesArray[a].x - mouse.x)) + 
                                        ((particlesArray[a].y - mouse.y) * (particlesArray[a].y - mouse.y));
                    
                    if (mouseDistance < mouse.radius * mouse.radius) {
                        let mouseOpacity = 1 - (mouseDistance / (mouse.radius * mouse.radius));
                        ctx.strokeStyle = `rgba(56, 189, 248, ${mouseOpacity * 0.5})`; // Glow on hover
                        ctx.lineWidth = 1.5;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            requestAnimationFrame(animateParticles);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connectParticles();
        }

        initParticles();
        animateParticles();
    }
});