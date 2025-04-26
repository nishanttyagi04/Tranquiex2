// Initialize Three.js scene
let scene, camera, renderer, watch;

function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    // Create camera
    camera = new THREE.PerspectiveCamera(75, 300 / 300, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(300, 300);
    document.querySelector('.hardware-image').appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x00ff9d, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create watch body
    const watchGeometry = new THREE.BoxGeometry(2, 2, 0.3);
    const watchMaterial = new THREE.MeshPhongMaterial({
        color: 0x2c2c2c,
        specular: 0x00ff9d,
        shininess: 100
    });
    watch = new THREE.Mesh(watchGeometry, watchMaterial);
    scene.add(watch);

    // Create watch screen
    const screenGeometry = new THREE.PlaneGeometry(1.8, 1.8);
    const screenMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff9d,
        opacity: 0.3,
        transparent: true,
        emissive: 0x00ff9d,
        emissiveIntensity: 0.2
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = 0.151;
    watch.add(screen);

    // Create watch band
    const bandGeometry = new THREE.BoxGeometry(0.5, 2.5, 0.1);
    const bandMaterial = new THREE.MeshPhongMaterial({
        color: 0x2c2c2c,
        specular: 0x00ff9d,
        shininess: 50
    });
    
    const topBand = new THREE.Mesh(bandGeometry, bandMaterial);
    topBand.position.y = 2.2;
    watch.add(topBand);

    const bottomBand = new THREE.Mesh(bandGeometry, bandMaterial);
    bottomBand.position.y = -2.2;
    watch.add(bottomBand);

    // Add details
    const buttonGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 32);
    const buttonMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ff9d,
        specular: 0xffffff,
        shininess: 100
    });

    const button1 = new THREE.Mesh(buttonGeometry, buttonMaterial);
    button1.rotation.z = Math.PI / 2;
    button1.position.set(1.1, 0.5, 0);
    watch.add(button1);

    const button2 = new THREE.Mesh(buttonGeometry, buttonMaterial);
    button2.rotation.z = Math.PI / 2;
    button2.position.set(1.1, -0.5, 0);
    watch.add(button2);

    // Animation loop
    animate();

    // Add mouse interaction
    let isDragging = false;
    let previousMousePosition = {
        x: 0,
        y: 0
    };

    renderer.domElement.addEventListener('mousedown', (e) => {
        isDragging = true;
    });

    renderer.domElement.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaMove = {
                x: e.offsetX - previousMousePosition.x,
                y: e.offsetY - previousMousePosition.y
            };

            watch.rotation.y += deltaMove.x * 0.01;
            watch.rotation.x += deltaMove.y * 0.01;
        }

        previousMousePosition = {
            x: e.offsetX,
            y: e.offsetY
        };
    });

    renderer.domElement.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Add touch interaction
    renderer.domElement.addEventListener('touchstart', (e) => {
        isDragging = true;
        previousMousePosition = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    });

    renderer.domElement.addEventListener('touchmove', (e) => {
        if (isDragging) {
            const deltaMove = {
                x: e.touches[0].clientX - previousMousePosition.x,
                y: e.touches[0].clientY - previousMousePosition.y
            };

            watch.rotation.y += deltaMove.x * 0.01;
            watch.rotation.x += deltaMove.y * 0.01;

            previousMousePosition = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        }
    });

    renderer.domElement.addEventListener('touchend', () => {
        isDragging = false;
    });
}

function animate() {
    requestAnimationFrame(animate);

    // Auto-rotation when not interacting
    if (!isDragging) {
        watch.rotation.y += 0.005;
    }

    renderer.render(scene, camera);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
});
