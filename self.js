document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('selfAssessmentForm');
    const resultSection = document.querySelector('.result-section');
    const questionnaireSection = document.querySelector('.questionnaire-section');
    const retakeBtn = document.querySelector('.retake-btn');

    // Personality traits mapping
    const traitMappings = {
        problem_solving: {
            analytical: { trait: 'Analytical Thinker', suggestions: ['Data Analysis', 'Research', 'Strategic Planning'] },
            creative: { trait: 'Creative Problem Solver', suggestions: ['Design', 'Innovation', 'Creative Direction'] },
            intuitive: { trait: 'Intuitive Decision Maker', suggestions: ['Leadership', 'Counseling', 'Entrepreneurship'] }
        },
        learning_style: {
            visual: { trait: 'Visual Learner', suggestions: ['Visual Design', 'Architecture', 'Video Production'] },
            practical: { trait: 'Hands-on Learner', suggestions: ['Engineering', 'Crafts', 'Physical Training'] },
            theoretical: { trait: 'Theoretical Thinker', suggestions: ['Academic Research', 'Philosophy', 'Writing'] }
        },
        group_role: {
            leader: { trait: 'Natural Leader', suggestions: ['Project Management', 'Team Leadership', 'Business Development'] },
            creative: { trait: 'Innovation Driver', suggestions: ['Product Design', 'Creative Strategy', 'Art Direction'] },
            supporter: { trait: 'Team Facilitator', suggestions: ['Team Coordination', 'Support Services', 'Community Management'] }
        },
        expression: {
            verbal: { trait: 'Verbal Communicator', suggestions: ['Public Speaking', 'Sales', 'Teaching'] },
            written: { trait: 'Written Communicator', suggestions: ['Content Creation', 'Technical Writing', 'Journalism'] },
            visual: { trait: 'Visual Communicator', suggestions: ['Graphic Design', 'UI/UX Design', 'Photography'] }
        },
        energy_source: {
            social: { trait: 'Social Energizer', suggestions: ['Event Planning', 'Community Building', 'Public Relations'] },
            solo: { trait: 'Independent Worker', suggestions: ['Research', 'Content Creation', 'Technical Development'] },
            mixed: { trait: 'Adaptable Collaborator', suggestions: ['Project Management', 'Consulting', 'Freelancing'] }
        },
        challenge_approach: {
            plan: { trait: 'Strategic Planner', suggestions: ['Project Planning', 'Business Strategy', 'Systems Design'] },
            adapt: { trait: 'Adaptive Problem Solver', suggestions: ['Agile Development', 'Crisis Management', 'Innovation'] },
            collaborate: { trait: 'Collaborative Problem Solver', suggestions: ['Team Leadership', 'Consulting', 'Partnership Management'] }
        }
    };

    // Add animation to question cards on scroll
    const observeElements = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.question-card').forEach(card => {
            observer.observe(card);
        });
    };

    // Calculate dominant traits based on answers
    const calculateTraits = (formData) => {
        let traits = {};
        let traitCounts = {};

        // Process each answer
        for (let [question, answer] of formData.entries()) {
            const mapping = traitMappings[question][answer];
            if (mapping) {
                const trait = mapping.trait;
                traitCounts[trait] = (traitCounts[trait] || 0) + 1;
                traits[question] = mapping;
            }
        }

        // Find primary trait (most frequent)
        const primaryTrait = Object.entries(traitCounts)
            .sort(([,a], [,b]) => b - a)[0][0];

        // Get supporting traits (excluding primary)
        const supportingTraits = Object.values(traits)
            .map(t => t.trait)
            .filter(t => t !== primaryTrait)
            .slice(0, 3);

        // Collect all relevant suggestions
        const suggestions = Object.values(traits)
            .flatMap(t => t.suggestions)
            .filter((v, i, a) => a.indexOf(v) === i)
            .slice(0, 3);

        return {
            primaryTrait,
            supportingTraits,
            suggestions
        };
    };

    // Display results with animation
    const displayResults = (results) => {
        const primaryTraitElement = document.querySelector('.primary-trait .trait-text');
        const traitsListElement = document.querySelector('.traits-list');
        const suggestionTextElement = document.querySelector('.suggestion-text');

        // Update content
        primaryTraitElement.textContent = results.primaryTrait;
        traitsListElement.innerHTML = results.supportingTraits
            .map(trait => `<li>${trait}</li>`)
            .join('');
        suggestionTextElement.textContent = `Consider exploring fields such as ${results.suggestions.join(', ')}.`;

        // Hide questionnaire and show results with animation
        gsap.to(questionnaireSection, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            onComplete: () => {
                questionnaireSection.style.display = 'none';
                resultSection.style.display = 'block';
                gsap.from(resultSection, {
                    opacity: 0,
                    y: 20,
                    duration: 0.5
                });
            }
        });
    };

    // Form submission handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const results = calculateTraits(formData);
        displayResults(results);
    });

    // Retake button handler
    retakeBtn.addEventListener('click', () => {
        form.reset();
        gsap.to(resultSection, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            onComplete: () => {
                resultSection.style.display = 'none';
                questionnaireSection.style.display = 'block';
                gsap.from(questionnaireSection, {
                    opacity: 0,
                    y: 20,
                    duration: 0.5
                });
            }
        });
    });

    // Initialize animations
    observeElements();
});
