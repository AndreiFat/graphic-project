// Importuri necesare din Three.js și alte module personalizate
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import TWEEN from 'three/addons/libs/tween.module.js';
import {setupGUI} from "./gui.js";
import {setupSketchGUI} from "./sketchGUI.js";
import {checkpoints} from "./checkpoints.js";
import {HemisphereLight, Mesh, MeshStandardMaterial, PointLight, SphereGeometry, TextureLoader} from "three";


// Inițializare raycaster pentru detectarea intersecțiilor
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let play = true;  // Variabilă globală pentru controlul animației

// Inițializare scena, cameră și renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('rendererCanvas'),
    antialias: true,
    alpha: true  // Transparentă activată pentru renderer
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);  // Setare culoare de fundal la negru cu transparență

// Configurare OrbitControls pentru o vizualizare mai bună
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;  // Activare amortizare pentru mișcarea camerei
controls.listenToKeyEvents(window);  // Ascultare evenimente de la tastatură (opțional)

// Setare factor de amortizare pentru mișcarea camerei
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Inițializare iluminare ambientală
const ambientLight = new THREE.AmbientLight(0xffffff, 2);  // Lumină ambientală albă cu intensitate 2
scene.add(ambientLight);

// Adăugare lumini, geometrii etc. în scenă (inclusiv configurarea soarelui)
const sunTexture = new TextureLoader().load('/images/textures/sun.png');  // Încărcare textură soare
sunTexture.wrapS = THREE.RepeatWrapping;  // Configurare mod de repetare pe axa S
sunTexture.wrapT = THREE.RepeatWrapping;  // Configurare mod de repetare pe axa T
sunTexture.repeat.set(1, 1);  // Setare repetare textură

// Inițializare geometrie sferică pentru soare și material standard
const sunGeometry = new SphereGeometry(0.1, 100, 100);
const sunMaterial = new MeshStandardMaterial({
    emissive: 0xffdd40,  // Culoare emisivă
    emissiveIntensity: 0.5,  // Intensitate emisivă
    roughness: 1,  // Rugozitate
    metalness: 0  // Metalicitate
});
const sun = new Mesh(sunGeometry, sunMaterial);  // Creare obiect Mesh pentru soare
const sunLight = new PointLight(0xFEE050, 1.5, 10);  // Lumină galbenă intensă pentru soare
sun.add(sunLight);  // Atașare lumină la obiectul soare
sun.position.set(0.25, 1.1, -0.75);  // Poziționare soare în scenă
sunLight.position.set(0, -0.10, 0.30);  // Poziționare lumină soare

scene.add(sun);  // Adăugare soare în scenă

// Configurare interfață grafică (GUI)
setupGUI(camera, controls, sun, sunLight, sunMaterial, scene, renderer);

// Încărcare model GLTF
const loader = new GLTFLoader();
let mixer;  // Inițializare mixer pentru animații
loader.load('/models/mafer_city/scene.gltf', (gltf) => {
    const model = gltf.scene; // Extrage scena modelului din obiectul gltf
    const animations = gltf.animations; // Extrage animațiile modelului din obiectul gltf

    // Verifică dacă există animații și le activează
    if (animations && animations.length) {
        mixer = new THREE.AnimationMixer(model); // Creează un mixer de animații pentru model
        animations.forEach((clip) => {
            mixer.clipAction(clip).play(); // Adaugă și pornește fiecare clip de animație
        });
    }

    scene.add(model); // Adaugă modelul în scenă

    // Calculează bounding box-ul modelului
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    // Scalează modelul la o dimensiune adecvată (dacă este necesar)
    const scaleFactor = 1 / maxDim;
    model.scale.set(scaleFactor * 2.5, scaleFactor * 2.5, scaleFactor * 2.5);

    // Poziționează modelul în mod corespunzător (opțional)
    box.setFromObject(model);
    box.getCenter(model.position).multiplyScalar(-1);

    // Ajustează poziția camerei
    camera.position.set(0, 1, 1.75); // Ajustează poziția inițială a camerei
    controls.update(); // Actualizează controalele camerei pentru a reflecta modificările
}, undefined, (error) => {
    console.error(error); // În caz de eroare la încărcare, afișează eroarea în consolă
});

// Creează marcatori HTML pentru fiecare checkpoint dintr-o listă dată
checkpoints.forEach((checkpoint, index) => {
    createMarker(checkpoint.position, checkpoint.label, checkpoint.info, index, checkpoint.color, checkpoint.image);
});

function createMarker(position, label, info, index, color = "rgba(255,255,255,0.1)", image = "") {
    const marker = document.createElement('div'); // Creează un element HTML <div> pentru marcator
    marker.className = 'marker'; // Asignează clasa CSS 'marker' pentru stilizare
    marker.innerHTML = index + 1; // Setează numărul de ordine al marcatorului
    marker.style.left = `0px`; // Setează poziția pe axa X
    marker.style.top = `0px`; // Setează poziția pe axa Y
    marker.dataset.info = info; // Adaugă informații suplimentare ca atribut de dataset
    marker.style.backgroundColor = color; // Setează culoarea de fundal a marcatorului

    // Adaugă un eveniment de click care afișează informațiile corespunzătoare și mută camera la poziția marcatorului
    marker.addEventListener('click', () => {
        displayInfo(label, info, image, position); // Afisează informațiile în funcția displayInfo
        moveToPosition(position); // Mută camera la poziția marcatorului
        removeSketch(); // Elimină orice schiță existentă
    });

    document.getElementById('container').appendChild(marker); // Adaugă marcatorul în containerul specificat

    // Stochează marcatorul pentru actualizări ulterioare
    marker.userData = {
        position,
        label,
        index
    };

    // Actualizează poziția marcatorului
    updateMarkerPosition(marker);
}

// Mută camera către o anumită poziție cu animație
function moveToPosition(targetPosition, zoomFactor = 0.5, duration = 1000) {
    const startPosition = camera.position.clone(); // Stochează poziția actuală a camerei
    const target = targetPosition.clone(); // Stochează poziția țintă

    // Calculează vectorul de direcție către țintă (opțional)
    const direction = target.clone().sub(startPosition).normalize();

    // Calculează noua poziție a camerei bazată pe factorul de zoom
    const zoomedPosition = startPosition.clone().lerp(targetPosition, zoomFactor);

    // Animație pentru poziția camerei
    new TWEEN.Tween(camera.position)
        .to(zoomedPosition, duration) // Animare până la poziția zoomată
        .easing(TWEEN.Easing.Quadratic.InOut) // Funcția de easing folosită pentru animație
        .onUpdate(() => {
            // Actualizează orientarea camerei pentru a privi către țintă
            camera.lookAt(target);

            // Dacă se folosește OrbitControls, actualizează ținta pentru a menține centrul orbitei
            if (controls.target) {
                controls.target.copy(target);
            }

            // Actualizează controalele dacă sunt utilizate
            controls.update();
        })
        .start(); // Pornirea animației
}

// Definiție shader material pentru efectul de schiță
const sketchShader = {
    uniforms: {
        "tDiffuse": {value: null}, // Textura de intrare
        "resolution": {value: new THREE.Vector2()} // Rezoluția texturii
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec2 resolution;
        varying vec2 vUv;

        void main() {
            vec3 color = texture2D(tDiffuse, vUv).rgb;

            // Reduce detaliile și crește contrastul pentru efectul de schiță
            float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
            float sketchValue = smoothstep(0.35, 0.65, gray); // Ajustează pragurile pentru intensitatea schiței

            // Afișează culoarea similară unei schițe cu contrast crescut
            color = vec3(sketchValue);

            gl_FragColor = vec4(color, 1.0);
        }
    `
};

// Variabila globala apentru a salva mesh-ul schitei
let sketchMesh = null;

// Materialul shader pentru efectul de schiță
const sketchMaterial = new THREE.ShaderMaterial(sketchShader);

// Funcție pentru eliminarea schiței din scenă
function removeSketch() {
    if (sketchMesh) {
        scene.remove(sketchMesh); // Elimină mesh-ul schiței din scenă
        sketchMesh = null; // Resetarea referinței globale sketchMesh
        const guiContainer = document.getElementById('sketch-gui-container');
        guiContainer.innerHTML = ''; // Șterge elementele GUI când se elimină schița
    }
}

// Funcție pentru afișarea informațiilor și gestionarea conversiei la schiță
function displayInfo(label, info, image, position) {
    // Afișează lista de clădiri dacă există și este vizibilă
    const buildingList = document.getElementById('building-list');
    if (buildingList && buildingList.parentNode) {
        buildingList.parentNode.style.display = 'block';
    }

    // Actualizează conținutul listei de clădiri cu informațiile specifice
    buildingList.innerHTML = `
        <div>
            <img class="image mb-3 rounded-3" src="${image}" alt="" width="100%" height="auto">
            <h4>${label}</h4>
            <p>${info.info}</p>
            <h5>Informații sustenabile</h5>
            <ul class="gap-3 font-light">
                <li>${info.information1}</li>
                <li>${info.information2}</li>
                <li>${info.information3}</li>
                <li>${info.information4}</li>
                <li>${info.information5}</li>
            </ul>
            <div class="d-flex gap-2" id="info-buttons">
                <button id="sketchButton" class="btn btn-warning px-3 rounded-3 py-2">Creează Schiță</button>
            </div>
        </div>`;

    // Crează un buton pentru revenire
    const revertButton = document.createElement('button');
    revertButton.textContent = 'Explorează';
    revertButton.className = "btn btn-dark px-3 rounded-3 py-2";
    revertButton.addEventListener('click', () => {
        moveToInitialPosition(); // Apel pentru a reveni la poziția inițială
        if (buildingList && buildingList.parentNode) {
            buildingList.parentNode.style.display = 'none'; // Ascunde lista de clădiri
            removeSketch(); // Elimină schița dacă există
        }
    });
    const infoContainerButtons = document.getElementById('info-buttons');
    infoContainerButtons.appendChild(revertButton); // Adaugă butonul de revenire

    // Eveniment pentru butonul de schiță
    document.getElementById('sketchButton').addEventListener('click', () => {
        const imageUrl = `${image}`; // URL-ul imaginii pentru conversia la schiță
        convertToSketch(imageUrl, position); // Conversia imaginii la schiță
    });
}

// Funcția pentru a converti imaginea în schiță
function convertToSketch(imageUrl, position) {
    removeSketch(); // Elimină orice schiță existentă

    const loader = new THREE.TextureLoader();
    loader.load(imageUrl, texture => {
        const planeGeometry = new THREE.PlaneGeometry(2, 2); // Plan 2D sub forma imaginii care va fi un dreptunghi
        const planeMesh = new THREE.Mesh(planeGeometry, sketchMaterial);

        // Setează poziția și scalarea
        planeMesh.position.set(0, 1, -1.5);
        planeMesh.scale.set(1, 1, 1);

        // Adaugă plasa pe scenă
        scene.add(planeMesh);

        // Atribuie textura încărcată materialului shader
        sketchMaterial.uniforms.tDiffuse.value = texture;

        const duration = 12000; // Durata animației în milisecunde
        let startTime = null;

        // Funcție pentru animarea camerei
        function animateCamera(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1); // Limitarea progresului la [0, 1]

            // // Actualizează poziția camerei și privește spre țintă
            // camera.position.set(0, 1, 0);
            camera.lookAt(0, 1, -1.5);

            // Randează scena
            renderer.render(scene, camera);

            // Continuă animația dacă nu s-a terminat
            if (progress < 1) {
                // Actualizează pozițiile marcatorilor
                document.querySelectorAll('.marker').forEach(marker => {
                    updateMarkerPosition(marker);
                });
                requestAnimationFrame(animateCamera);
            }
        }

        // Pornirea animației
        requestAnimationFrame(animateCamera);

        // Actualizarea referinței globale sketchMesh
        sketchMesh = planeMesh;
        setupSketchGUI(planeMesh, scene, camera, renderer, imageUrl); // Setare interfață grafică pentru schiță
    });
}

// Funcția pentru a muta camera la poziția inițială
function moveToInitialPosition(duration = 1000) {
    const initialPosition = new THREE.Vector3(0, 1, 1.75); // Poziția inițială a camerei

    // Animație pentru a muta camera la poziția inițială
    new TWEEN.Tween(camera.position)
        .to(initialPosition, duration)
        .easing(TWEEN.Easing.Quadratic.InOut)  // Funcția de easing utilizată pentru animație
        .onUpdate(() => {
            camera.lookAt(new THREE.Vector3()); // Privirea camerei către originea scenei (0, 0, 0)

            // Dacă se folosește OrbitControls, actualizează ținta pentru a menține centrul orbitei
            if (controls.target) {
                controls.target.set(0, 0, 0); // Setare centrul orbitei la originea scenei
            }

            // Actualizare controale dacă sunt folosite
            controls.update();
        })
        .start(); // Pornirea animației
}

// Funcția pentru actualizarea poziției marcatorului pe ecran
function updateMarkerPosition(marker) {
    const position = marker.userData.position.clone();

    // Proiectarea poziției markerului folosind proiecția camerei
    const screenPosition = position.clone().project(camera);

    // Convertirea coordonatelor ecranului din coordonatele dispozitivului normalizate în pixeli reali
    const x = (screenPosition.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-screenPosition.y * 0.5 + 0.5) * window.innerHeight;

    // Actualizarea poziției CSS a marcatorului
    marker.style.left = `${x - marker.clientWidth / 2}px`;
    marker.style.top = `${y - marker.clientHeight / 2}px`;
}

document.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('resize', onWindowResize, false);
window.addEventListener('click', onMouseClick, false);

// Buclă pentru randare
function animate() {
    requestAnimationFrame(animate); // Solicită următorul cadru de animație

    controls.update(); // Actualizează controalele de cameră (de exemplu, OrbitControls)
    if (mixer) {
        mixer.update(0.01); // Actualizează mixerul de animație cu un delta time mic
    }
    renderer.render(scene, camera); // Randare scenei folosind camera și renderer-ul

    controls.autoRotate = play; // Setează auto-rotirea controalelor în funcție de variabila 'play'

    // Updatează pozițiile marcatorilor pe ecran
    document.querySelectorAll('.marker').forEach(marker => {
        updateMarkerPosition(marker);
    });

    TWEEN.update(); // Actualizează toate animațiile TWEEN în curs
}

// Mouse move event handler (Handler pentru mișcarea mouse-ului)
function onMouseMove(event) {
    // Normalizează coordonatele mouse-ului la intervalul [-1, 1]
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Window resize event handler (Handler pentru redimensionarea ferestrei)
function onWindowResize() {
    // Ajustează raportul de aspect al camerei la cel al ferestrei
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); // Actualizează matricea de proiecție a camerei
    renderer.setSize(window.innerWidth, window.innerHeight); // Redimensionează renderer-ul
}

// Mouse click event handler (Handler pentru click-ul mouse-ului)
function onMouseClick(event) {
    // Setează razele de la raycaster bazate pe poziția normalizată a mouse-ului și camera curentă
    raycaster.setFromCamera(mouse, camera);

    // Realizează raycasting pentru a găsi obiectele intersectate în scena
    const intersects = raycaster.intersectObjects(scene.children, true);

    // Dacă există intersectări, gestionează primul obiect intersectat
    if (intersects.length > 0) {
        const object = intersects[0].object;

        // Verifică dacă obiectul intersectat are o metodă onClick definită
        if (object.onClick) {
            object.onClick(); // Apelul metodei onClick a obiectului pentru a gestiona evenimentul de click
        }
    }
}


// Get references to the buttons
const leftBtn = document.getElementById('left-btn');
const upBtn = document.getElementById('up-btn');
const rightBtn = document.getElementById('right-btn');
const downBtn = document.getElementById('down-btn');
const wBtn = document.getElementById('w-btn');
const aBtn = document.getElementById('a-btn');
const sBtn = document.getElementById('s-btn');
const dBtn = document.getElementById('d-btn');
const toggleAutoUpdateBtn = document.getElementById('toggle-auto-update-btn');
const restoreCamera = document.getElementById('restore-camera');
// Event listener pentru butonul de restaurare a poziției camerei
restoreCamera.addEventListener('click', () => {
    moveToInitialPosition();
});

// Funcție pentru rotirea camerei în plan orizontal
function rotateCameraHorizontally(angle) {
    const target = controls.target.clone(); // Copiază ținta controalelor camerei
    const radius = camera.position.distanceTo(target); // Calculează distanța camerei față de țintă

    // Convertș unghiul la coordonate sferice
    const theta = Math.atan2(camera.position.z - target.z, camera.position.x - target.x);
    const phi = Math.acos((camera.position.y - target.y) / radius);

    // Actualizează unghiul theta pentru rotația orizontală
    const newTheta = theta + angle;

    // Actualizează poziția camerei bazată pe noile unghiuri
    camera.position.x = target.x + radius * Math.sin(phi) * Math.cos(newTheta);
    camera.position.z = target.z + radius * Math.sin(phi) * Math.sin(newTheta);
    camera.position.y = target.y + radius * Math.cos(phi);

    camera.lookAt(target); // Ajustează orientarea camerei către țintă
}

// Funcție pentru rotirea camerei în plan vertical
function rotateCameraVertically(angle) {
    const target = controls.target.clone(); // Copiază ținta controalelor camerei
    const radius = camera.position.distanceTo(target); // Calculează distanța camerei față de țintă

    // Convertș unghiul la coordonate sferice
    const theta = Math.atan2(camera.position.z - target.z, camera.position.x - target.x);
    const phi = Math.acos((camera.position.y - target.y) / radius);

    // Actualizează unghiul phi pentru rotația verticală
    const newPhi = phi + angle;

    // Limitează unghiul phi pentru a evita inversarea camerei
    const clampedPhi = Math.max(0.1, Math.min(Math.PI - 0.1, newPhi));

    // Actualizează poziția camerei bazată pe noile unghiuri
    camera.position.x = target.x + radius * Math.sin(clampedPhi) * Math.cos(theta);
    camera.position.z = target.z + radius * Math.sin(clampedPhi) * Math.sin(theta);
    camera.position.y = target.y + radius * Math.cos(clampedPhi);

    camera.lookAt(target); // Ajustează orientarea camerei către țintă
}

// Event listener pentru butonul de rotație la stânga
leftBtn.addEventListener('click', () => {
    rotateCameraHorizontally(Math.PI / 90); // Rotește camera la stânga cu 1 grad
    controls.update(); // Actualizează controalele
});

// Event listener pentru butonul de rotație în sus
upBtn.addEventListener('click', () => {
    rotateCameraVertically(-Math.PI / 90); // Rotește camera în sus cu 1 grad
    controls.update(); // Actualizează controalele
});

// Event listener pentru butonul de rotație la dreapta
rightBtn.addEventListener('click', () => {
    rotateCameraHorizontally(-Math.PI / 90); // Rotește camera la dreapta cu 1 grad
    controls.update(); // Actualizează controalele
});

// Event listener pentru butonul de rotație în jos
downBtn.addEventListener('click', () => {
    rotateCameraVertically(Math.PI / 90); // Rotește camera în jos cu 1 grad
    controls.update(); // Actualizează controalele
});

// Event listener pentru controalele WASD pentru deplasarea camerei
const moveSpeed = 0.5; // Viteza de deplasare a camerei

// Event listener pentru butonul W (înainte)
wBtn.addEventListener('click', () => {
    camera.position.z -= moveSpeed; // Deplasează camera înainte
    controls.update(); // Actualizează controalele
});

// Event listener pentru butonul A (stânga)
aBtn.addEventListener('click', () => {
    camera.position.x -= moveSpeed; // Deplasează camera la stânga
    controls.update(); // Actualizează controalele
});

// Event listener pentru butonul S (înapoi)
sBtn.addEventListener('click', () => {
    camera.position.z += moveSpeed; // Deplasează camera înapoi
    controls.update(); // Actualizează controalele
});

// Event listener pentru butonul D (dreapta)
dBtn.addEventListener('click', () => {
    camera.position.x += moveSpeed; // Deplasează camera la dreapta
    controls.update(); // Actualizează controalele
});

// Event listener pentru butonul de toggle pentru actualizarea automată
toggleAutoUpdateBtn.addEventListener('click', () => {
    if (play) {
        play = !play; // Inversează starea play
        toggleAutoUpdateBtn.innerHTML = "Stop"; // Actualizează textul butonului
    } else {
        toggleAutoUpdateBtn.innerHTML = "Play"; // Actualizează textul butonului
        play = !play; // Inversează starea play
    }
});

// Event listener pentru ascunderea panoului lateral
document.getElementById('confirm-instructions').addEventListener('click', () => {
    hideSidebar(); // Apel pentru a ascunde panoul lateral
});

// Funcție pentru ascunderea panoului lateral
function hideSidebar() {
    document.getElementById('sidebar').style.display = 'none'; // Ascunde elementul cu id-ul 'sidebar'
}

animate(); // Pornirea buclei de animație