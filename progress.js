document.addEventListener('DOMContentLoaded', () => {
    // Initialize Circular Progress Chart
    const ctx = document.getElementById('progressChart').getContext('2d');
    const progressChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [75, 25],
                backgroundColor: [
                    '#00ff9d',
                    'rgba(255, 255, 255, 0.1)'
                ],
                borderWidth: 0,
                cutout: '80%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    });

    // Animate Timeline Items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
    });

    // Initialize Milestone Celebration
    const confettiConfig = {
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    };

    const shareBtn = document.querySelector('.share-btn');
    shareBtn.addEventListener('click', () => {
        confetti(confettiConfig);
    });

    // Animate Log Items on Scroll
    const logItems = document.querySelectorAll('.log-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, {
        threshold: 0.2
    });

    logItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'all 0.5s ease-out';
        observer.observe(item);
    });

    // Update Active Timeline Item
    function updateActiveTimelineItem() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const currentTime = hours * 100 + minutes;

        timelineItems.forEach(item => {
            const timeText = item.querySelector('.time').textContent;
            const itemHours = parseInt(timeText.split(':')[0]);
            const itemMinutes = parseInt(timeText.split(':')[1]);
            const itemTime = itemHours * 100 + itemMinutes;

            if (currentTime >= itemTime) {
                item.classList.add('completed');
            }
        });
    }

    updateActiveTimelineItem();
    setInterval(updateActiveTimelineItem, 60000); // Update every minute

    // Navigation Scroll Effect
    let lastScroll = 0;
    const nav = document.querySelector('.nav-container');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            nav.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !nav.classList.contains('scroll-down')) {
            nav.classList.remove('scroll-up');
            nav.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && nav.classList.contains('scroll-down')) {
            nav.classList.remove('scroll-down');
            nav.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Progress Stats Animation
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        const finalValue = parseFloat(stat.textContent);
        let currentValue = 0;
        const duration = 1500;
        const increment = finalValue / (duration / 16); // 60fps

        function updateValue() {
            if (currentValue < finalValue) {
                currentValue += increment;
                if (currentValue > finalValue) currentValue = finalValue;
                stat.textContent = currentValue.toFixed(1);
                requestAnimationFrame(updateValue);
            }
        }

        updateValue();
    });

    // Add hover effect to log items
    logItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                x: 10,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                x: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Milestone celebration animation
    const milestoneSection = document.querySelector('.milestone-section');
    milestoneSection.addEventListener('mouseenter', () => {
        confetti({
            ...confettiConfig,
            particleCount: 30,
            spread: 45
        });
    });
});
