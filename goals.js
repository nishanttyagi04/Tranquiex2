document.addEventListener('DOMContentLoaded', () => {
    // Initialize progress rings
    const progressRings = document.querySelectorAll('.progress-ring-circle');
    progressRings.forEach(ring => {
        const radius = ring.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        
        ring.style.strokeDasharray = `${circumference} ${circumference}`;
        
        const percent = ring.dataset.progress;
        const offset = circumference - (percent / 100 * circumference);
        ring.style.strokeDashoffset = offset;

        // Animate progress on load
        gsap.from(ring, {
            strokeDashoffset: circumference,
            duration: 1.5,
            ease: 'power2.out'
        });
    });

    // Modal handling
    const modal = document.getElementById('goalModal');
    const addGoalCard = document.querySelector('.add-goal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const goalForm = document.getElementById('goalForm');

    addGoalCard.addEventListener('click', () => {
        modal.style.display = 'flex';
        gsap.from('.modal-content', {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    cancelBtn.addEventListener('click', () => {
        gsap.to('.modal-content', {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                modal.style.display = 'none';
                goalForm.reset();
            }
        });
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            gsap.to('.modal-content', {
                scale: 0.8,
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    modal.style.display = 'none';
                    goalForm.reset();
                }
            });
        }
    });

    // Form submission
    goalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simulate goal creation
        const goalType = document.getElementById('goalType').value;
        const goalTarget = document.getElementById('goalTarget').value;
        const goalPeriod = document.getElementById('goalPeriod').value;

        // Create new goal card
        const newGoal = createGoalCard(goalType, goalTarget, goalPeriod);
        
        // Add to grid before the "Add Goal" card
        addGoalCard.parentNode.insertBefore(newGoal, addGoalCard);

        // Animate new goal card
        gsap.from(newGoal, {
            scale: 0.8,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out'
        });

        // Close modal
        gsap.to('.modal-content', {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                modal.style.display = 'none';
                goalForm.reset();
            }
        });
    });

    // Create new goal card
    function createGoalCard(type, target, period) {
        const div = document.createElement('div');
        div.className = 'goal-card';
        div.innerHTML = `
            <div class="goal-progress">
                <svg class="progress-ring" width="120" height="120">
                    <circle class="progress-ring-circle-bg" cx="60" cy="60" r="54"/>
                    <circle class="progress-ring-circle" cx="60" cy="60" r="54" data-progress="0"/>
                </svg>
                <span class="progress-text">0%</span>
            </div>
            <h3>${type} Goal</h3>
            <p>0 / ${target} ${type === 'focus' ? 'hours' : 'tasks'}</p>
            <div class="goal-footer">
                <span class="goal-streak"><i class="fas fa-fire"></i> 0 ${period}</span>
                <button class="update-btn">Update</button>
            </div>
        `;

        // Initialize progress ring animation
        const ring = div.querySelector('.progress-ring-circle');
        const radius = ring.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        ring.style.strokeDasharray = `${circumference} ${circumference}`;
        ring.style.strokeDashoffset = circumference;

        // Add update functionality
        const updateBtn = div.querySelector('.update-btn');
        updateBtn.addEventListener('click', () => updateGoalProgress(div));

        return div;
    }

    // Update goal progress
    function updateGoalProgress(goalCard) {
        const ring = goalCard.querySelector('.progress-ring-circle');
        const progressText = goalCard.querySelector('.progress-text');
        const currentProgress = parseInt(ring.dataset.progress || 0);
        const newProgress = Math.min(100, currentProgress + 20);

        // Update progress ring
        const radius = ring.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        const offset = circumference - (newProgress / 100 * circumference);

        gsap.to(ring, {
            strokeDashoffset: offset,
            duration: 0.5,
            ease: 'power2.out'
        });

        ring.dataset.progress = newProgress;
        progressText.textContent = `${newProgress}%`;

        // Check for achievement
        if (newProgress === 100) {
            showCelebration();
        }
    }

    // Achievement celebration
    function showCelebration() {
        const celebration = document.querySelector('.celebration-overlay');
        celebration.style.display = 'flex';

        gsap.from('.celebration-content', {
            scale: 0.5,
            opacity: 0,
            duration: 0.5,
            ease: 'back.out(1.7)'
        });

        // Confetti effect (simulated with emojis)
        const emojis = ['🎉', '🎊', '⭐', '🌟'];
        for (let i = 0; i < 20; i++) {
            const emoji = document.createElement('div');
            emoji.className = 'celebration-emoji';
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.position = 'absolute';
            emoji.style.left = `${Math.random() * 100}%`;
            emoji.style.top = '-20px';
            emoji.style.fontSize = '24px';
            celebration.appendChild(emoji);

            gsap.to(emoji, {
                y: `${Math.random() * 100 + 100}vh`,
                rotation: Math.random() * 360,
                duration: Math.random() * 2 + 1,
                ease: 'power1.out',
                onComplete: () => emoji.remove()
            });
        }

        // Close celebration
        const shareBtn = celebration.querySelector('.share-btn');
        shareBtn.addEventListener('click', () => {
            gsap.to('.celebration-content', {
                scale: 0.5,
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    celebration.style.display = 'none';
                }
            });
        });
    }

    // Hover animations for achievement cards
    const achievementCards = document.querySelectorAll('.achievement-card');
    achievementCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.achievement-icon i');
            gsap.to(icon, {
                rotate: 360,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
});
