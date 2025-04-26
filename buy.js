document.addEventListener('DOMContentLoaded', () => {
    // Initialize 3D wearable
    initializeWearable3D();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize FAQ accordion
    initializeFAQ();
    
    // Initialize smooth scroll
    initializeSmoothScroll();
    
    // Initialize demo video placeholder
    initializeDemoVideo();
    
    // Initialize pricing card hover effects
    initializePricingCards();
});

// 3D Wearable Device
function initializeWearable3D() {
    const container = document.getElementById('wearable-3d');
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Create wearable device
    const geometry = new THREE.BoxGeometry(1, 0.3, 0.15);
    const material = new THREE.MeshPhongMaterial({
        color: 0x00ff9d,
        specular: 0x555555,
        shininess: 30
    });
    const watch = new THREE.Mesh(geometry, material);
    scene.add(watch);

    // Add strap
    const strapGeometry = new THREE.BoxGeometry(1.2, 0.1, 0.15);
    const strapMaterial = new THREE.MeshPhongMaterial({
        color: 0x333333,
        specular: 0x222222,
        shininess: 20
    });
    
    const topStrap = new THREE.Mesh(strapGeometry, strapMaterial);
    topStrap.position.y = 0.2;
    scene.add(topStrap);
    
    const bottomStrap = new THREE.Mesh(strapGeometry, strapMaterial);
    bottomStrap.position.y = -0.2;
    scene.add(bottomStrap);

    // Add screen details
    const screenGeometry = new THREE.PlaneGeometry(0.8, 0.2);
    const screenMaterial = new THREE.MeshBasicMaterial({
        color: 0x111111,
        side: THREE.DoubleSide
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = 0.08;
    watch.add(screen);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 3;

    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate the watch
        watch.rotation.y += 0.01;
        topStrap.rotation.y = watch.rotation.y;
        bottomStrap.rotation.y = watch.rotation.y;
        
        // Add floating animation
        const time = Date.now() * 0.001;
        watch.position.y = Math.sin(time) * 0.1;
        topStrap.position.y = 0.2 + Math.sin(time) * 0.1;
        bottomStrap.position.y = -0.2 + Math.sin(time) * 0.1;
        
        renderer.render(scene, camera);
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    animate();
}

// Animation Initialization
function initializeAnimations() {
    // Animate elements on scroll
    const observeElements = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        // Observe feature cards
        document.querySelectorAll('.feature-card').forEach(card => {
            observer.observe(card);
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
        });

        // Observe tech cards
        document.querySelectorAll('.tech-card').forEach(card => {
            observer.observe(card);
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
        });

        // Observe dataset cards
        document.querySelectorAll('.dataset-card').forEach(card => {
            observer.observe(card);
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
        });
    };

    observeElements();
}

// FAQ Accordion
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                otherAnswer.style.height = '0';
            });
            
            // Toggle clicked item
            if (!isActive) {
                item.classList.add('active');
                answer.style.height = answer.scrollHeight + 'px';
            }
        });
    });
}

// Smooth Scroll
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Demo Video Placeholder
function initializeDemoVideo() {
    const demoPlaceholder = document.querySelector('.demo-placeholder');
    const watchDemoBtn = document.querySelector('.watch-demo-btn');
    
    if (demoPlaceholder && watchDemoBtn) {
        const handleDemoClick = () => {
            // Placeholder for demo video functionality
            // This could be replaced with actual video player implementation
            alert('Demo video coming soon!');
        };
        
        demoPlaceholder.addEventListener('click', handleDemoClick);
        watchDemoBtn.addEventListener('click', handleDemoClick);
    }
}

// Pricing Cards
function initializePricingCards() {
    const buyButtons = document.querySelectorAll('.buy-now-btn');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const plan = e.target.closest('.pricing-card').querySelector('h3').textContent;
            
            if (plan.includes('Individual')) {
                // Handle individual license purchase
                alert('Redirecting to payment gateway...');
            } else {
                // Handle institution license inquiry
                alert('Opening demo request form...');
            }
        });
    });
}

// Add animation class for elements
document.addEventListener('scroll', () => {
    const elements = document.querySelectorAll('.feature-card, .tech-card, .dataset-card');
    
    elements.forEach(element => {
        const position = element.getBoundingClientRect();
        
        // Check if element is in viewport
        if (position.top < window.innerHeight && position.bottom >= 0) {
            element.classList.add('animate-in');
        }
    });
});

// Add styles for animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .feature-card, .tech-card, .dataset-card {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);
