document.addEventListener('DOMContentLoaded', () => {
    initializeAnimations();
    initializeFAQ();
    initializeTestimonials();
    initializePricing();
    initializeWorkflowSteps();
    initializeFeatureCards();
});

// Animation Initialization
function initializeAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });

    // Observe all animated elements
    const elements = document.querySelectorAll(
        '.feature-card, .workflow-step, .spec-item, .pricing-card, .testimonial-card'
    );
    
    elements.forEach(element => {
        observer.observe(element);
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
    });
}

// Feature Cards Animation
function initializeFeatureCards() {
    const cards = document.querySelectorAll('.feature-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.feature-icon i');
            gsap.to(icon, {
                scale: 1.2,
                rotation: 5,
                duration: 0.2,
                yoyo: true,
                repeat: 1
            });
        });
    });
}

// Workflow Steps Animation
function initializeWorkflowSteps() {
    const steps = document.querySelectorAll('.workflow-step');
    
    gsap.from(steps, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".workflow-section",
            start: "top center+=100",
            toggleActions: "play none none reverse"
        }
    });

    steps.forEach(step => {
        step.addEventListener('mouseenter', () => {
            const number = step.querySelector('.step-number');
            gsap.to(number, {
                scale: 1.2,
                duration: 0.2,
                yoyo: true,
                repeat: 1
            });
        });
    });
}

// FAQ Accordion
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    gsap.to(otherAnswer, {
                        height: 0,
                        duration: 0.3,
                        ease: "power2.inOut"
                    });
                    gsap.to(otherItem.querySelector('i'), {
                        rotation: 0,
                        duration: 0.3
                    });
                }
            });
            
            // Toggle clicked item
            if (!isActive) {
                item.classList.add('active');
                gsap.to(answer, {
                    height: "auto",
                    duration: 0.3,
                    ease: "power2.inOut"
                });
                gsap.to(icon, {
                    rotation: 180,
                    duration: 0.3
                });
            } else {
                item.classList.remove('active');
                gsap.to(answer, {
                    height: 0,
                    duration: 0.3,
                    ease: "power2.inOut"
                });
                gsap.to(icon, {
                    rotation: 0,
                    duration: 0.3
                });
            }
        });
    });
}

// Testimonials Carousel
function initializeTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.prev-testimonial');
    const nextBtn = document.querySelector('.next-testimonial');
    let currentIndex = 0;
    let isAnimating = false;

    function showTestimonial(index, direction) {
        if (isAnimating) return;
        isAnimating = true;

        const currentCard = testimonials[currentIndex];
        const nextCard = testimonials[index];
        const xOffset = direction === 'next' ? 100 : -100;

        gsap.timeline()
            .to(currentCard, {
                opacity: 0,
                x: -xOffset,
                duration: 0.5
            })
            .set(nextCard, {
                display: 'block',
                x: xOffset
            })
            .to(nextCard, {
                opacity: 1,
                x: 0,
                duration: 0.5,
                onComplete: () => {
                    currentCard.style.display = 'none';
                    isAnimating = false;
                }
            });

        currentIndex = index;
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
            showTestimonial(newIndex, 'prev');
        });

        nextBtn.addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % testimonials.length;
            showTestimonial(newIndex, 'next');
        });

        // Auto-rotate testimonials
        let autoRotate = setInterval(() => {
            const newIndex = (currentIndex + 1) % testimonials.length;
            showTestimonial(newIndex, 'next');
        }, 5000);

        // Pause auto-rotation on hover
        const testimonialContainer = document.querySelector('.testimonials-container');
        testimonialContainer.addEventListener('mouseenter', () => clearInterval(autoRotate));
        testimonialContainer.addEventListener('mouseleave', () => {
            autoRotate = setInterval(() => {
                const newIndex = (currentIndex + 1) % testimonials.length;
                showTestimonial(newIndex, 'next');
            }, 5000);
        });
    }
}

// Pricing Section
function initializePricing() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    const buttons = document.querySelectorAll('.pre-order-btn, .request-demo-btn');

    pricingCards.forEach(card => {
        if (!card.classList.contains('featured')) {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -10,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        }
    });

    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            gsap.to(button, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1
            });

            const plan = button.closest('.pricing-card').querySelector('h3').textContent;
            if (button.classList.contains('pre-order-btn')) {
                alert(`Starting pre-order process for ${plan}. This feature will be available soon!`);
            } else {
                alert('Thank you for your interest! Our team will contact you shortly to schedule a demo.');
            }
        });
    });
}

// Add animation styles
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
`;
document.head.appendChild(style);
