import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import TWEEN from 'three/addons/libs/tween.module.js';

// Initialize building data array
let buildings = [];

// Initialize variables for interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// OrbitControls for better viewing
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Load GLTF model
const loader = new GLTFLoader();
loader.load('/models/scene.gltf', (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    // Compute the bounding box of the model
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    // Scale the model to a suitable size (if needed)
    const scaleFactor = 1 / maxDim;
    model.scale.set(scaleFactor * 2.5, scaleFactor * 2.5, scaleFactor * 2.5);

    // Position the model appropriately (optional)
    box.setFromObject(model);
    box.getCenter(model.position).multiplyScalar(-1);

    // Optionally, traverse the scene to access individual objects
    gltf.scene.traverse(function (child) {
        if (child.isMesh) {
            buildings.push(child);
        }
    });

    // Populate building list (assuming you have a DOM element with id 'building-list')
    const buildingList = document.getElementById('building-list');
    buildings.forEach((building, index) => {
        const buildingItem = document.createElement('div');
        buildingItem.classList.add('building-item');
        buildingItem.textContent = `Building ${index + 1}`;
        buildingItem.addEventListener('click', function () {
            zoomToBuilding(building);
        });
        buildingList.appendChild(buildingItem);
    });

    // Adjust camera position
    camera.position.set(0, 10, 20); // Adjust initial camera position
    controls.update();
}, undefined, (error) => {
    console.error(error);
});

// Event listeners
document.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('resize', onWindowResize, false);

// Render loop
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Update controls for orbiting camera
    TWEEN.update(); // Update tween animations
    renderer.render(scene, camera);
}
animate();

// Function to handle mouse move events
function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Function to handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


// Function to zoom to a specific building
function zoomToBuilding(building) {
    // Calculate zoom target based on building position or bounding box
    const box = new THREE.Box3().setFromObject(building);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // Extract front coordinates of the building
    const frontCoordinates = extractFrontCoordinates(building, 'building');

    // If frontCoordinates is null, handle error or fallback
    if (!frontCoordinates) {
        console.error('Failed to extract front coordinates for building.');
        return;
    }

    // Example: Assuming you want to use the first face's vertices
    const vertices = frontCoordinates[0];

    // Calculate distance to the building based on its bounding box size
    const size = new THREE.Vector3();
    box.getSize(size);
    const distance = Math.max(size.x, size.y, size.z) * 5; // Adjust multiplier for zoom distance

    // Calculate new camera position based on the building's front face
    const direction = new THREE.Vector3();
    vertices.forEach(vertex => direction.add(vertex));
    direction.divideScalar(vertices.length);
    const newPosition = center.clone().add(direction.multiplyScalar(distance));

    // Animate camera movement
    new TWEEN.Tween(camera.position)
        .to(newPosition, 1000) // Adjust duration as needed
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
            camera.lookAt(center);
        })
        .start();
}


// Function to extract front coordinates
function extractFrontCoordinates(model, meshName) {
    const mesh = model.getObjectByName(meshName);
    if (!mesh) {
        console.error(`Mesh ${meshName} not found.`);
        return null;
    }

    const positions = [];

    // Ensure the mesh has geometry and that it's buffered or indexed
    let geometry = mesh.geometry;
    if (!geometry || (!geometry.isBufferGeometry)) {
        console.error(`Invalid geometry for mesh ${meshName}.`);
        return null;
    }

    // Ensure geometry.attributes.position is defined
    const positionAttribute = geometry.attributes.position;
    if (!positionAttribute) {
        console.error(`Position attribute not found for mesh ${meshName}.`);
        return null;
    }

    // Access vertex positions from geometry
    const vertices = [];
    const positionsArray = positionAttribute.array;
    const itemSize = positionAttribute.itemSize; // typically 3 for x, y, z coordinates

    for (let i = 0; i < positionsArray.length; i += itemSize) {
        vertices.push(new THREE.Vector3(
            positionsArray[i],
            positionsArray[i + 1],
            positionsArray[i + 2]
        ));
    }

    // Assuming the front face is the one facing in the direction of (0, 0, 1)
    const faceNormals = mesh.geometry.attributes.normal.array;

    for (let i = 0; i < faceNormals.length; i += 9) {
        const normal = new THREE.Vector3(faceNormals[i], faceNormals[i + 1], faceNormals[i + 2]);
        if (normal && normal.z > 0.9) { // You can adjust this threshold based on your model
            positions.push([
                vertices[i / 3],
                vertices[(i + 3) / 3],
                vertices[(i + 6) / 3]
            ]);
        }
    }

    return positions;
}
