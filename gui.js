// Importarea modulului dat.GUI și a anumitor componente Three.js necesare
import * as dat from 'dat.gui'; // Import dat.GUI
import {
    TextureLoader,
    HemisphereLight
} from 'three';

// Definirea luminii de tip Hemisphere global
const hemisphereLight = new HemisphereLight(0xffffbb, 0x080820, 2); // Iluminare ambientală suavă

// Funcția pentru setarea interfeței grafice (GUI)
export function setupGUI(camera, controls, sun, sunLight, sunMaterial, scene, renderer) {
    // Crearea obiectului GUI fără plasarea automată
    const gui = new dat.GUI({autoPlace: false});
    const guiContainer = document.getElementById('gui-container'); // Înlocuiți 'gui-container' cu ID-ul containerului dvs.
    guiContainer.appendChild(gui.domElement); // Adăugarea GUI la containerul personalizat

    console.log("GUI LOADED");

    // Activarea hărții de umbră în renderer
    renderer.shadowMap.enabled = true;

    // Adăugarea controlurilor în GUI
    const cameraFolder = gui.addFolder('Camera'); // Crearea unui folder pentru controlul camerei

    // Definirea parametrilor inițiali pentru cameră
    const initialCameraPosition = {x: 0, y: 1, z: 1.75};
    const initialCameraRotation = {x: 0, y: 0, z: 0};

    // Adăugarea controlurilor pentru poziția camerei
    cameraFolder.add(initialCameraPosition, 'x', -5, 5).name('Position X').onChange(updateCamera);
    cameraFolder.add(initialCameraPosition, 'y', -5, 5).name('Position Y').onChange(updateCamera);
    cameraFolder.add(initialCameraPosition, 'z', -5, 5).name('Position Z').onChange(updateCamera);

    // Funcția pentru actualizarea poziției camerei și a rotației
    function updateCamera() {
        camera.position.set(initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z);
        camera.rotation.set(initialCameraRotation.x, initialCameraRotation.y, initialCameraRotation.z);
        controls.update(); // În cazul în care se utilizează OrbitControls, se actualizează după schimbările camerei
    }

    // Parametrii pentru gradientul de fundal și funcția pentru actualizarea acestuia
    const backgroundParams = {
        color1: "#1e1e1e",
        color2: "#121212"
    };

    // Funcția pentru actualizarea gradientului de fundal
    function updateBackground(colorMode = 'default') {
        let color1, color2, color3;

        // Setarea culorilor în funcție de modul de culoare
        if (colorMode === 'blue') {
            color1 = "#0d47a1"; // Albastru închis
            color2 = "#2196f3"; // Albastru deschis
            color3 = "#62b9ff"; // Albastru deschis
            document.body.style.background = `linear-gradient(5deg, ${color1}, ${color2}, ${color3})`;
        } else {
            document.body.style.background = `linear-gradient(5deg, ${backgroundParams.color1}, ${backgroundParams.color2})`;
        }
    }

    // Adăugarea controlurilor pentru gradientul de fundal în GUI
    const backgroundFolder = gui.addFolder('Background Gradient');
    backgroundFolder.addColor(backgroundParams, 'color1').name('Color 1').onChange(updateBackground);
    backgroundFolder.addColor(backgroundParams, 'color2').name('Color 2').onChange(updateBackground);

    // Funcția pentru activarea/dezactivarea vizibilității soarelui și a umbrelor
    function toggleSun(visible) {
        sun.visible = visible;
        sunLight.visible = visible;
        hemisphereLight.visible = visible; // Activarea/dezactivarea luminii hemisferice cu soarele
    }

    // Funcția pentru activarea/dezactivarea texturii soarelui și a gradientului de fundal
    function toggleSunTexture(applyTexture) {
        if (applyTexture) {
            sunMaterial.map = new TextureLoader().load('/images/textures/sun.png');
            updateBackground('blue'); // Schimbarea fundalului la gradientul albastru
            // Adăugarea luminii hemisferice la scenă
            scene.add(hemisphereLight);
        } else {
            sunMaterial.map = null;
            updateBackground(); // Restaurarea gradientului de fundal original
            // Înlăturarea luminii hemisferice din scenă
            scene.remove(hemisphereLight);
        }
        sunMaterial.needsUpdate = true; // Asigurarea actualizării materialelor
    }

    // Adăugarea controlurilor pentru soare în GUI
    const sunFolder = gui.addFolder('Sun');
    sunFolder.add({visible: false}, 'visible').name('Enable Sun').onChange(toggleSun);
    sunFolder.add({applyTexture: false}, 'applyTexture').name('Sun Texture').onChange(toggleSunTexture);

    // Controluri pentru poziția soarelui
    const sunPositionFolder = sunFolder.addFolder('Sun Position');
    sunPositionFolder.add(sun.position, 'x', -1, 1.5).name('Position X');
    sunPositionFolder.add(sun.position, 'y', 0, 1.25).name('Position Y');
    sunPositionFolder.add(sun.position, 'z', -1, 1.5).name('Position Z');

    // Controluri pentru rotația soarelui
    const sunRotationFolder = sunFolder.addFolder('Sun Rotation');
    const sunRotationControls = {
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0
    };
    sunRotationFolder.add(sunRotationControls, 'rotationX', -Math.PI, Math.PI).name('Rotation X').onChange(() => {
        sun.rotation.x = sunRotationControls.rotationX;
        renderer.render(scene, camera); // Opțional: se randează scena la schimbarea rotației dacă este necesar
    });
    sunRotationFolder.add(sunRotationControls, 'rotationY', -Math.PI, Math.PI).name('Rotation Y').onChange(() => {
        sun.rotation.y = sunRotationControls.rotationY;
        renderer.render(scene, camera); // Opțional: se randează scena la schimbarea rotației dacă este necesar
    });
    sunRotationFolder.add(sunRotationControls, 'rotationZ', -Math.PI, Math.PI).name('Rotation Z').onChange(() => {
        sun.rotation.z = sunRotationControls.rotationZ;
        renderer.render(scene, camera); // Opțional: se randează scena la schimbarea rotației dacă este necesar
    });

    // Controluri pentru scalarea soarelui
    const sunScaleFolder = sunFolder.addFolder('Sun Scale');
    const sunScaleControls = {
        scaleX: 1,
        scaleY: 1,
        scaleZ: 1
    };
    sunScaleFolder.add(sunScaleControls, 'scaleX', 0.1, 1.5).name('Scale X').onChange(() => {
        sun.scale.x = sunScaleControls.scaleX;
        renderer.render(scene, camera); // Opțional: se randează scena la schimbarea scalării dacă este necesar
    });
    sunScaleFolder.add(sunScaleControls, 'scaleY', 0.1, 1.5).name('Scale Y').onChange(() => {
        sun.scale.y = sunScaleControls.scaleY;
        renderer.render(scene, camera); // Opțional: se randează scena la schimbarea scalării dacă este necesar
    });
    sunScaleFolder.add(sunScaleControls, 'scaleZ', 0.1, 1.5).name('Scale Z').onChange(() => {
        sun.scale.z = sunScaleControls.scaleZ;
        renderer.render(scene, camera); // Opțional: se randează scena la schimbarea scalării dacă este necesar
    });

    // Actualizarea inițială a fundalului
    updateBackground();

    // Ascunderea inițială a soarelui în scenă
    sun.visible = false;
    sunLight.visible = false;
    hemisphereLight.visible = false; // Ascunderea inițială a luminii hemisferice

}