// script.js
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import TWEEN from 'three/addons/libs/tween.module.js';
import {setupGUI} from "./gui.js";

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const checkpoints = [
    {
        position: new THREE.Vector3(0.7, 0.6, -0.5),
        label: '<i class="fa-solid fa-map-pin"></i>',
        info: 'Information about Building A.'
    },
    {position: new THREE.Vector3(0.3, 0.6, 0.1), label: '2', info: 'Information about Building B.'},
    // Add more checkpoints as needed
];

// Store initial screen positions for markers
const initialMarkerPositions = [];

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({canvas: document.getElementById('rendererCanvas'), antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x121212);

// OrbitControls for better viewing
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Call setupGUI function to setup GUI controls
setupGUI(camera, controls);

// Load GLTF model
const loader = new GLTFLoader();
let mixer;

loader.load('/models/mafer_city/scene.gltf', (gltf) => {
    const model = gltf.scene;
    const animations = gltf.animations;

    if (animations && animations.length) {
        mixer = new THREE.AnimationMixer(model);
        animations.forEach((clip) => {
            mixer.clipAction(clip).play();
        });
    }

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

    // Adjust camera position
    camera.position.set(0, 1, 1.75); // Adjust initial camera position
    controls.update();
}, undefined, (error) => {
    console.error(error);
});

// Create HTML markers
checkpoints.forEach((checkpoint, index) => {
    createMarker(checkpoint.position, checkpoint.label, checkpoint.info, index);
});

function createMarker(position, label, info, index) {
    const marker = document.createElement('div');
    marker.className = 'marker';
    marker.innerHTML = label;
    marker.style.left = `0px`;
    marker.style.top = `0px`;
    marker.dataset.info = info;

    marker.addEventListener('click', () => {
        displayInfo(label, info);
        moveToPosition(position); // Move camera to the marker position
    });

    document.getElementById('container').appendChild(marker);

    // Store marker for later updates
    marker.userData = {
        position,
        label,
        index
    };

    // Update marker position
    updateMarkerPosition(marker);
}

function moveToPosition(targetPosition, zoomFactor = 0.5, duration = 1000) {
    const startPosition = camera.position.clone();
    const target = targetPosition.clone();

    // Calculate direction vector towards target (optional)
    const direction = target.clone().sub(startPosition).normalize();

    // Calculate the new camera position based on zoom factor
    const zoomedPosition = startPosition.clone().lerp(targetPosition, zoomFactor);

    // Animate camera position
    new TWEEN.Tween(camera.position)
        .to(zoomedPosition, duration)
        .easing(TWEEN.Easing.Quadratic.InOut)  // Use any easing function you prefer
        .onUpdate(() => {
            // Update camera's orientation to look at the target
            camera.lookAt(target);

            // If using OrbitControls, update target to maintain orbit center
            if (controls.target) {
                controls.target.copy(target);
            }

            // Update controls if used
            controls.update();
        })
        .start();
}


function displayInfo(label, info) {
    const buildingList = document.getElementById('building-list');
    buildingList.innerHTML = `<h5>${label}</h5><p>${info}</p>`;

    // Create a revert button
    const revertButton = document.createElement('button');
    revertButton.textContent = 'Revert';
    revertButton.addEventListener('click', () => {
        // Call moveToInitialPosition to zoom out and reset
        moveToInitialPosition();
    });
    buildingList.appendChild(revertButton);
}


function moveToInitialPosition(duration = 1000) {
    const initialPosition = new THREE.Vector3(0, 1, 1.75); // Replace with your initial camera position

    // Animate camera to initial position
    new TWEEN.Tween(camera.position)
        .to(initialPosition, duration)
        .easing(TWEEN.Easing.Quadratic.InOut)  // Use any easing function you prefer
        .onUpdate(() => {
            camera.lookAt(new THREE.Vector3()); // Look at scene origin (0, 0, 0)

            // If using OrbitControls, update target to maintain orbit center
            if (controls.target) {
                controls.target.set(0, 0, 0); // Set orbit center to scene origin
            }

            // Update controls if used
            controls.update();
        })
        .start();
}

function updateMarkerPosition(marker) {
    const position = marker.userData.position.clone();

    // Project marker position directly using camera projection
    const screenPosition = position.clone().project(camera);

    // Convert screen coordinates from normalized device coordinates to actual pixels
    const x = (screenPosition.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-screenPosition.y * 0.5 + 0.5) * window.innerHeight;

    // Update marker's CSS position
    marker.style.left = `${x - marker.clientWidth / 2}px`;
    marker.style.top = `${y - marker.clientHeight / 2}px`;
}


// Event listeners
document.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('resize', onWindowResize, false);
window.addEventListener('click', onMouseClick, false);

// Render loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    if (mixer) {
        mixer.update(0.01); // Update animation mixer with a small delta time
    }
    renderer.render(scene, camera);

    // Update marker positions
    document.querySelectorAll('.marker').forEach(marker => {
        updateMarkerPosition(marker);
    });
    TWEEN.update();
}

// Mouse move event handler
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Window resize event handler
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Mouse click event handler
function onMouseClick(event) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const object = intersects[0].object;

        // Check if the intersected object is a checkpoint marker
        if (object.onClick) {
            object.onClick();
        }
    }
}

// Start animation loop
animate();

