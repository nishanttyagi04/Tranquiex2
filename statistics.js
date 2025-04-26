document.addEventListener('DOMContentLoaded', () => {
    // Time Distribution Pie Chart
    const timeCtx = document.getElementById('timeDistributionChart').getContext('2d');
    new Chart(timeCtx, {
        type: 'doughnut',
        data: {
            labels: ['Deep Focus', 'Light Work', 'Breaks'],
            datasets: [{
                data: [45, 35, 20],
                backgroundColor: [
                    '#00ff9d',
                    '#4d7fff',
                    '#ff4d4d'
                ],
                borderWidth: 0,
                cutout: '70%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });

    // Productivity Trend Line Chart
    const productivityTrendChart = new ApexCharts(document.querySelector("#productivityTrendChart"), {
        series: [{
            name: 'Productivity Score',
            data: [65, 72, 68, 75, 80, 82, 85]
        }],
        chart: {
            type: 'line',
            height: 300,
            background: 'transparent',
            toolbar: {
                show: false
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800
            }
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        colors: ['#00ff9d'],
        grid: {
            borderColor: 'rgba(255, 255, 255, 0.1)',
            strokeDashArray: 5
        },
        markers: {
            size: 5,
            colors: ['#00ff9d'],
            strokeColors: '#2a2a2a',
            strokeWidth: 2
        },
        xaxis: {
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            labels: {
                style: {
                    colors: 'rgba(255, 255, 255, 0.7)'
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: 'rgba(255, 255, 255, 0.7)'
                }
            }
        },
        tooltip: {
            theme: 'dark',
            x: {
                show: false
            }
        }
    });
    productivityTrendChart.render();

    // Comparison Chart
    const comparisonCtx = document.getElementById('comparisonChart').getContext('2d');
    const comparisonData = {
        weekly: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            current: [4, 5, 3, 6, 4, 5, 4],
            previous: [3, 4, 3, 5, 3, 4, 3]
        },
        monthly: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            current: [22, 25, 28, 30],
            previous: [20, 22, 24, 25]
        }
    };

    let comparisonChart = new Chart(comparisonCtx, {
        type: 'bar',
        data: {
            labels: comparisonData.weekly.labels,
            datasets: [
                {
                    label: 'Current Period',
                    data: comparisonData.weekly.current,
                    backgroundColor: '#00ff9d',
                    borderRadius: 5
                },
                {
                    label: 'Previous Period',
                    data: comparisonData.weekly.previous,
                    backgroundColor: 'rgba(0, 255, 157, 0.3)',
                    borderRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                }
            },
            scales: {
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                }
            }
        }
    });

    // Focus Hours Heatmap
    const heatmapData = generateHeatmapData();
    const focusHeatmap = new ApexCharts(document.querySelector("#focusHeatmap"), {
        series: [{
            name: 'Focus Hours',
            data: heatmapData
        }],
        chart: {
            height: 250,
            type: 'heatmap',
            background: 'transparent',
            toolbar: {
                show: false
            }
        },
        dataLabels: {
            enabled: false
        },
        colors: ["#00ff9d"],
        plotOptions: {
            heatmap: {
                colorScale: {
                    ranges: [{
                        from: 0,
                        to: 2,
                        color: 'rgba(0, 255, 157, 0.2)'
                    }, {
                        from: 3,
                        to: 4,
                        color: 'rgba(0, 255, 157, 0.4)'
                    }, {
                        from: 5,
                        to: 6,
                        color: 'rgba(0, 255, 157, 0.6)'
                    }, {
                        from: 7,
                        to: 8,
                        color: 'rgba(0, 255, 157, 0.8)'
                    }, {
                        from: 9,
                        to: 10,
                        color: '#00ff9d'
                    }]
                }
            }
        },
        xaxis: {
            labels: {
                style: {
                    colors: 'rgba(255, 255, 255, 0.7)'
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: 'rgba(255, 255, 255, 0.7)'
                }
            }
        }
    });
    focusHeatmap.render();

    // Tab Switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const period = btn.dataset.period;
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            comparisonChart.data.labels = comparisonData[period].labels;
            comparisonChart.data.datasets[0].data = comparisonData[period].current;
            comparisonChart.data.datasets[1].data = comparisonData[period].previous;
            comparisonChart.update();
        });
    });

    // Helper function to generate heatmap data
    function generateHeatmapData() {
        const data = [];
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        const timeSlots = ['9AM', '11AM', '1PM', '3PM', '5PM'];

        days.forEach(day => {
            timeSlots.forEach(time => {
                data.push({
                    x: time,
                    y: day,
                    value: Math.floor(Math.random() * 10) + 1
                });
            });
        });

        return data;
    }

    // Animate suggestions on scroll
    const suggestions = document.querySelectorAll('.suggestion-container');
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

    suggestions.forEach(suggestion => {
        suggestion.style.opacity = '0';
        suggestion.style.transform = 'translateX(-20px)';
        suggestion.style.transition = 'all 0.5s ease-out';
        observer.observe(suggestion);
    });
});
