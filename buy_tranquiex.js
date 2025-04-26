// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    initializeAnimations();
    initializeFeatureCards();
    initializeWorkflowSteps();
    initializeHardwareSection();
    initializePricingCards();
    initializeFAQ();
    initializeTestimonials();
});

// General Animations
function initializeAnimations() {
    // Hero section animations
    gsap.from('.hero-title', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
    });

    // Animate sections on scroll
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 30,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'top 50%',
                toggleActions: 'play none none reverse'
            }
        });
    });
}

// Feature Cards Animation
function initializeFeatureCards() {
    const cards = document.querySelectorAll('.feature-card');
    
    cards.forEach((card, index) => {
        // Initial animation on scroll
        gsap.from(card, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            delay: index * 0.2,
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                end: 'top 50%',
                toggleActions: 'play none none reverse'
            }
        });

        // Hover animations
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });

            const icon = card.querySelector('.feature-icon i');
            gsap.to(icon, {
                scale: 1.2,
                rotate: 5,
                duration: 0.3,
                ease: 'back.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });

            const icon = card.querySelector('.feature-icon i');
            gsap.to(icon, {
                scale: 1,
                rotate: 0,
                duration: 0.3,
                ease: 'back.out'
            });
        });
    });
}

// Workflow Steps Animation
function initializeWorkflowSteps() {
    const steps = document.querySelectorAll('.workflow-step');
    
    steps.forEach((step, index) => {
        // Staggered entrance animation
        gsap.from(step, {
            opacity: 0,
            x: index % 2 === 0 ? -50 : 50,
            duration: 0.8,
            scrollTrigger: {
                trigger: step,
                start: 'top 80%',
                end: 'top 50%',
                toggleActions: 'play none none reverse'
            }
        });

        // Number bounce animation on hover
        step.addEventListener('mouseenter', () => {
            const number = step.querySelector('.step-number');
            gsap.to(number, {
                scale: 1.2,
                duration: 0.3,
                ease: 'back.out'
            });
        });

        step.addEventListener('mouseleave', () => {
            const number = step.querySelector('.step-number');
            gsap.to(number, {
                scale: 1,
                duration: 0.3,
                ease: 'back.out'
            });
        });
    });
}

// Hardware Section Animation
function initializeHardwareSection() {
    const specItems = document.querySelectorAll('.spec-item');
    
    specItems.forEach((item, index) => {
        gsap.from(item, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            delay: index * 0.2,
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                end: 'top 50%',
                toggleActions: 'play none none reverse'
            }
        });

        // Hover animation
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                y: -5,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// Pricing Cards Animation
function initializePricingCards() {
    const cards = document.querySelectorAll('.pricing-card');
    
    cards.forEach(card => {
        if (!card.classList.contains('featured')) {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -10,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        }

        // Button click animation
        const button = card.querySelector('button');
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            gsap.to(button, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    const plan = card.querySelector('h3').textContent;
                    if (button.classList.contains('pre-order-btn')) {
                        alert(`Starting pre-order process for ${plan}. This feature will be available soon!`);
                    } else {
                        alert('Thank you for your interest! Our team will contact you shortly to schedule a demo.');
                    }
                }
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
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('i');
                    
                    otherItem.classList.remove('active');
                    gsap.to(otherAnswer, {
                        height: 0,
                        duration: 0.3,
                        ease: 'power2.inOut'
                    });
                    gsap.to(otherIcon, {
                        rotation: 0,
                        duration: 0.3
                    });
                }
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
                gsap.to(answer, {
                    height: 'auto',
                    duration: 0.3,
                    ease: 'power2.inOut'
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
                    ease: 'power2.inOut'
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

        // Animate out current testimonial
        gsap.to(currentCard, {
            opacity: 0,
            x: -xOffset,
            duration: 0.5,
            ease: 'power2.inOut',
            onComplete: () => {
                currentCard.style.display = 'none';
            }
        });

        // Animate in next testimonial
        nextCard.style.display = 'block';
        gsap.fromTo(nextCard,
            { opacity: 0, x: xOffset },
            {
                opacity: 1,
                x: 0,
                duration: 0.5,
                ease: 'power2.inOut',
                onComplete: () => {
                    isAnimating = false;
                }
            }
        );

        currentIndex = index;
    }

    // Initialize controls
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
