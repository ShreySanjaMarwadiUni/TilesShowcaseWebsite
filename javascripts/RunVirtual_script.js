// Basic Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 10, 7.5).normalize();
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5, 100);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Camera Position
camera.position.set(0, 5, 3);

// Load GLTF Model
const loader = new THREE.GLTFLoader();
loader.load('emptyroom.glb', (gltf) => {
    model = gltf.scene;

    document.getElementById('btn-select').click();

    scene.add(model);
}, undefined, (error) => {
    console.error(error);
});

// Pointer Lock Controls
const controls = new THREE.PointerLockControls(camera, document.body);
document.body.addEventListener('click', () => {
  controls.lock();
});

const instructions = document.getElementById('instructions');
controls.addEventListener('lock', () => {
  instructions.style.display = 'none';
});

controls.addEventListener('unlock', () => {
  instructions.style.display = '';
});

scene.add(controls.getObject());

// Movement
const moveSpeed = 0.1;
const keys = {};

document.addEventListener('keydown', (event) => {
  keys[event.code] = true;
});

document.addEventListener('keyup', (event) => {
  keys[event.code] = false;
});

function move() {
  if (keys['KeyW']) controls.moveForward(moveSpeed);
  if (keys['KeyS']) controls.moveForward(-moveSpeed);
  if (keys['KeyA']) controls.moveRight(-moveSpeed);
  if (keys['KeyD']) controls.moveRight(moveSpeed);
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  move();
  renderer.render(scene, camera);
}
animate();

// Image Handling
const imageFiles = [
  'tilesamples/sample1.jpg',
  'tilesamples/sample2.jpg',
  'tilesamples/sample3.jpg',
  'tilesamples/sample4.jpg',
  'tilesamples/sample5.jpg',
  'tilesamples/sample6.jpg',
  'tilesamples/sample7.jpg',
  'tilesamples/sample8.jpg'
  // Add all your image paths here
];
let currentIndex = 0;

function updateImages() {
  const imageLeft = document.getElementById('image-left');
  const imageCenter = document.getElementById('image-center');
  const imageRight = document.getElementById('image-right');

  imageLeft.src = imageFiles[(currentIndex - 1 + imageFiles.length) % imageFiles.length];
  imageCenter.src = imageFiles[currentIndex];
  imageRight.src = imageFiles[(currentIndex + 1) % imageFiles.length];
}

document.getElementById('btn-prev').addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + imageFiles.length) % imageFiles.length;
  updateImages();
});

document.getElementById('btn-next').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % imageFiles.length;
  updateImages();
});

document.getElementById('btn-select').addEventListener('click', () => {
	// Replace Texture
    const textureLoader = new THREE.TextureLoader();
    const newTexture = textureLoader.load(`${imageFiles[currentIndex]}`);

    model.traverse((child) => {
        if (child.isMesh && child.material.name === 'Material.002') {
            child.material.map = newTexture;
            child.material.needsUpdate = true;
        }
    });
	//alert(`Selected texture: ${imageFiles[currentIndex]}`);
  
});

// Initial image load
updateImages();
