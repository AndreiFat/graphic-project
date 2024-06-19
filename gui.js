import * as dat from 'dat.gui';

export function setupGUI(camera, controls) {
    // Create GUI object
    // In setupGUI function
    const gui = new dat.GUI({autoPlace: false}); // Create GUI without automatically placing it
    const guiContainer = document.getElementById('gui-container'); // Replace 'gui-container' with your container ID
    guiContainer.appendChild(gui.domElement); // Append GUI to your custom container
    

    console.log("GUI LOADED")

    // Add controls to GUI
    const cameraFolder = gui.addFolder('Camera'); // Create a folder for camera controls

    // Define initial camera parameters
    const initialCameraPosition = {x: 0, y: 1, z: 1.75};
    const initialCameraRotation = {x: 0, y: 0, z: 0};

    // Add controls for camera position
    cameraFolder.add(initialCameraPosition, 'x', -5, 5).name('Position X').onChange(updateCamera);
    cameraFolder.add(initialCameraPosition, 'y', -5, 5).name('Position Y').onChange(updateCamera);
    cameraFolder.add(initialCameraPosition, 'z', -5, 5).name('Position Z').onChange(updateCamera);

    // Add controls for camera rotation
    cameraFolder.add(initialCameraRotation, 'x', -Math.PI, Math.PI).name('Rotation X').onChange(updateCamera);
    cameraFolder.add(initialCameraRotation, 'y', -Math.PI, Math.PI).name('Rotation Y').onChange(updateCamera);
    cameraFolder.add(initialCameraRotation, 'z', -Math.PI, Math.PI).name('Rotation Z').onChange(updateCamera);

    // Function to update camera position and rotation
    function updateCamera() {
        camera.position.set(initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z);
        camera.rotation.set(initialCameraRotation.x, initialCameraRotation.y, initialCameraRotation.z);
        controls.update(); // If using OrbitControls, update it after camera changes
    }
}
