class Scene3D {
    constructor() {
        this.container = document.getElementById('scene-container');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.clock = new THREE.Clock();
        this.objects = [];
        
        this.init();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        // Setup camera
        this.camera.position.z = 5;

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);

        // Create objects
        this.createClock();
        this.createLaptop();
        this.createGraphs();

        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));

        // Start animation loop
        this.animate();
    }

    createClock() {
        const clockGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
        const clockMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ff9d,
            transparent: true,
            opacity: 0.8
        });
        const clock = new THREE.Mesh(clockGeometry, clockMaterial);
        clock.position.set(-2, 1, 0);
        clock.rotation.x = Math.PI / 2;
        
        // Add clock hands
        const handMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        
        // Hour hand
        const hourGeometry = new THREE.BoxGeometry(0.05, 0.2, 0.02);
        const hourHand = new THREE.Mesh(hourGeometry, handMaterial);
        hourHand.position.y = 0.1;
        clock.add(hourHand);
        
        // Minute hand
        const minuteGeometry = new THREE.BoxGeometry(0.03, 0.3, 0.02);
        const minuteHand = new THREE.Mesh(minuteGeometry, handMaterial);
        minuteHand.position.y = 0.15;
        clock.add(minuteHand);

        this.objects.push({ mesh: clock, rotationSpeed: 0.01 });
        this.scene.add(clock);
    }

    createLaptop() {
        // Laptop base
        const baseGeometry = new THREE.BoxGeometry(1.5, 0.1, 1);
        const laptopMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        const base = new THREE.Mesh(baseGeometry, laptopMaterial);
        base.position.set(0, 0, 0);

        // Laptop screen
        const screenGeometry = new THREE.BoxGeometry(1.5, 1, 0.05);
        const screenMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(0, 0.5, -0.5);
        screen.rotation.x = -0.3;

        const laptop = new THREE.Group();
        laptop.add(base);
        laptop.add(screen);
        laptop.position.set(0, -0.5, 0);
        laptop.rotation.y = -0.3;

        this.objects.push({ mesh: laptop, rotationSpeed: 0.005 });
        this.scene.add(laptop);
    }

    createGraphs() {
        const graphGeometry = new THREE.BoxGeometry(0.1, 0.8, 0.1);
        const graphMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff9d });
        
        for (let i = 0; i < 4; i++) {
            const height = 0.3 + Math.random() * 0.5;
            const bar = new THREE.Mesh(
                new THREE.BoxGeometry(0.1, height, 0.1),
                graphMaterial
            );
            bar.position.set(2, height/2 - 0.5, i * 0.3 - 0.45);
            this.scene.add(bar);
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const delta = this.clock.getDelta();

        // Animate objects
        this.objects.forEach(obj => {
            obj.mesh.rotation.y += obj.rotationSpeed;
        });

        // Add subtle floating motion
        this.objects.forEach(obj => {
            obj.mesh.position.y += Math.sin(this.clock.getElapsedTime()) * 0.001;
        });

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the 3D scene when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Scene3D();
});
