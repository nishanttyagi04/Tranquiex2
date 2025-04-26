document.addEventListener('DOMContentLoaded', () => {
    // Initialize 3D Model Viewer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const container = document.getElementById('model-viewer');
    
    // Set renderer size and properties
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Create smart band model
    const geometry = new THREE.CylinderGeometry(1, 1, 0.3, 32, 1, false);
    const material = new THREE.MeshPhongMaterial({
        color: 0x00ff9d,
        transparent: true,
        opacity: 0.9,
        shininess: 100
    });
    const band = new THREE.Mesh(geometry, material);
    scene.add(band);

    // Add display screen to the band
    const screenGeometry = new THREE.PlaneGeometry(1.5, 0.8);
    const screenMaterial = new THREE.MeshPhongMaterial({
        color: 0x222222,
        transparent: true,
        opacity: 0.95,
        shininess: 90
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.y = 0.01;
    screen.rotation.x = -Math.PI / 2;
    band.add(screen);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x00ff9d, 0.5);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    // Position camera
    camera.position.z = 5;

    // Animation variables
    let targetRotation = { x: 0, y: 0 };
    let currentRotation = { x: 0, y: 0 };

    // Render loop
    function animate() {
        requestAnimationFrame(animate);

        // Smooth rotation
        currentRotation.x += (targetRotation.x - currentRotation.x) * 0.1;
        currentRotation.y += (targetRotation.y - currentRotation.y) * 0.1;

        band.rotation.x = currentRotation.x;
        band.rotation.y = currentRotation.y;

        renderer.render(scene, camera);
    }
    animate();

    // Handle view controls
    const controlBtns = document.querySelectorAll('.control-btn');
    controlBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            switch(view) {
                case 'front':
                    targetRotation = { x: 0, y: 0 };
                    break;
                case 'side':
                    targetRotation = { x: 0, y: Math.PI / 2 };
                    break;
                case 'back':
                    targetRotation = { x: 0, y: Math.PI };
                    break;
            }
            
            // Update active button state
            controlBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height);
    });

    // Order form handling
    const orderForm = document.querySelector('.order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Animate button
            const submitBtn = orderForm.querySelector('.submit-btn');
            submitBtn.innerHTML = 'Processing...';
            submitBtn.disabled = true;

            // Simulate order processing
            setTimeout(() => {
                submitBtn.innerHTML = 'Order Complete!';
                submitBtn.style.background = '#00ff9d';
                
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.className = 'success-message';
                successMsg.innerHTML = `
                    <h3>🎉 Order Placed Successfully!</h3>
                    <p>Check your email for order confirmation.</p>
                `;
                orderForm.appendChild(successMsg);

                // Reset form
                setTimeout(() => {
                    orderForm.reset();
                    submitBtn.innerHTML = 'Complete Order';
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                    successMsg.remove();
                }, 3000);
            }, 1500);
        });
    }

    // Authenticator connection simulation
    const connectBtns = document.querySelectorAll('.connect-btn');
    connectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Connecting...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = 'Connected ✓';
                btn.style.background = '#00ff9d';
                btn.style.color = '#2a2a2a';

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    btn.style.background = '';
                    btn.style.color = '';
                }, 2000);
            }, 1500);
        });
    });

    // Animate features on scroll
    const features = document.querySelectorAll('.feature');
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

    features.forEach(feature => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateX(-20px)';
        feature.style.transition = 'all 0.5s ease-out';
        observer.observe(feature);
    });

    // Rotating box animation enhancement
    const rotatingBoxes = document.querySelectorAll('.rotating-box');
    rotatingBoxes.forEach(box => {
        box.addEventListener('mouseover', () => {
            box.style.animationPlayState = 'paused';
        });

        box.addEventListener('mouseout', () => {
            box.style.animationPlayState = 'running';
        });
    });
});
