import * as dat from 'dat.gui';
import * as THREE from 'three';

// Function to setup GUI for controlling sketch properties
export function setupSketchGUI(mesh, scene, camera, renderer, imageUrl) {
// Crearea unei instanțe dat.GUI și adăugarea ei în containerul specificat
    const gui = new dat.GUI({autoPlace: false}); // Creăm o nouă instanță dat.GUI și dezactivăm plasarea automată
    const guiContainer = document.getElementById('sketch-gui-container'); // Obținem containerul HTML pentru GUI
    guiContainer.appendChild(gui.domElement); // Adăugăm elementul GUI DOM la containerul HTML

// Folder pentru transformări
    const transformFolder = gui.addFolder('Sketch Control'); // Adăugăm un folder pentru controlul schiței

// Definirea valorilor inițiale pentru controalele dat.GUI
    const controls = {
        positionX: mesh.position.x,
        positionY: mesh.position.y,
        positionZ: mesh.position.z,
        rotationX: mesh.rotation.x,
        rotationY: mesh.rotation.y,
        rotationZ: mesh.rotation.z,
        scaleX: mesh.scale.x,
        scaleY: mesh.scale.y,
        scaleZ: mesh.scale.z,
        blurFactor: 0.0 // Factorul inițial de blur
    };

// Folder pentru controalele poziției
    const positionFolder = transformFolder.addFolder('Position');
    positionFolder.add(controls, 'positionX', -10, 10).name('X').onChange(() => {
        mesh.position.x = controls.positionX; // Actualizăm poziția X a mesh-ului
        render(); // Apelăm funcția de redare pentru a actualiza vizualizarea
    });
    positionFolder.add(controls, 'positionY', -10, 10).name('Y').onChange(() => {
        mesh.position.y = controls.positionY; // Actualizăm poziția Y a mesh-ului
        render(); // Apelăm funcția de redare pentru a actualiza vizualizarea
    });
    positionFolder.add(controls, 'positionZ', -10, 10).name('Z').onChange(() => {
        mesh.position.z = controls.positionZ; // Actualizăm poziția Z a mesh-ului
        render(); // Apelăm funcția de redare pentru a actualiza vizualizarea
    });

// Folder pentru controalele rotației
    const rotationFolder = transformFolder.addFolder('Rotation');
    rotationFolder.add(controls, 'rotationX', -Math.PI, Math.PI).name('X').onChange(() => {
        mesh.rotation.x = controls.rotationX; // Actualizăm rotația X a mesh-ului
        render(); // Apelăm funcția de redare pentru a actualiza vizualizarea
    });
    rotationFolder.add(controls, 'rotationY', -Math.PI, Math.PI).name('Y').onChange(() => {
        mesh.rotation.y = controls.rotationY; // Actualizăm rotația Y a mesh-ului
        render(); // Apelăm funcția de redare pentru a actualiza vizualizarea
    });
    rotationFolder.add(controls, 'rotationZ', -Math.PI, Math.PI).name('Z').onChange(() => {
        mesh.rotation.z = controls.rotationZ; // Actualizăm rotația Z a mesh-ului
        render(); // Apelăm funcția de redare pentru a actualiza vizualizarea
    });

// Folder pentru controalele scalării
    const scaleFolder = transformFolder.addFolder('Scale');
    scaleFolder.add(controls, 'scaleX', 0.1, 10).name('X').onChange(() => {
        mesh.scale.x = controls.scaleX; // Actualizăm scala X a mesh-ului
        render(); // Apelăm funcția de redare pentru a actualiza vizualizarea
    });
    scaleFolder.add(controls, 'scaleY', 0.1, 10).name('Y').onChange(() => {
        mesh.scale.y = controls.scaleY; // Actualizăm scala Y a mesh-ului
        render(); // Apelăm funcția de redare pentru a actualiza vizualizarea
    });
    scaleFolder.add(controls, 'scaleZ', 0.1, 10).name('Z').onChange(() => {
        mesh.scale.z = controls.scaleZ; // Actualizăm scala Z a mesh-ului
        render(); // Apelăm funcția de redare pentru a actualiza vizualizarea
    });

// Adăugăm controlul pentru factorul de blur
    transformFolder.add(controls, 'blurFactor', 0.0, 3.0).name('Blur Factor').onChange(() => {
        render(); // Apelăm funcția de redare pentru a actualiza vizualizarea
    });


// Shader-ul pentru efectul de blur
    const blurShader = {
        uniforms: {
            uResolution: {value: new THREE.Vector2()},
            uBlurFactor: {value: 0.0},
            inputTexture: {value: null}
        },
        vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
        fragmentShader: `
        uniform vec2 uResolution;
        uniform float uBlurFactor;
        varying vec2 vUv;
        uniform sampler2D inputTexture;

        void main() {
            vec2 texelSize = 1.0 / uResolution;
            vec4 sum = vec4(0.0);

            // Kernel pentru blur Gaussian (5x5)
            float kernel[25];
            kernel[0] = 1.0 / 256.0; kernel[1] = 4.0 / 256.0; kernel[2] = 6.0 / 256.0; kernel[3] = 4.0 / 256.0; kernel[4] = 1.0 / 256.0;
            kernel[5] = 4.0 / 256.0; kernel[6] = 16.0 / 256.0; kernel[7] = 24.0 / 256.0; kernel[8] = 16.0 / 256.0; kernel[9] = 4.0 / 256.0;
            kernel[10] = 6.0 / 256.0; kernel[11] = 24.0 / 256.0; kernel[12] = 36.0 / 256.0; kernel[13] = 24.0 / 256.0; kernel[14] = 6.0 / 256.0;
            kernel[15] = 4.0 / 256.0; kernel[16] = 16.0 / 256.0; kernel[17] = 24.0 / 256.0; kernel[18] = 16.0 / 256.0; kernel[19] = 4.0 / 256.0;
            kernel[20] = 1.0 / 256.0; kernel[21] = 4.0 / 256.0; kernel[22] = 6.0 / 256.0; kernel[23] = 4.0 / 256.0; kernel[24] = 1.0 / 256.0;

            // Aplicăm kernel-ul pentru blur
            for (int i = -2; i <= 2; i++) {
                for (int j = -2; j <= 2; j++) {
                    sum += texture2D(inputTexture, vUv + vec2(float(i), float(j)) * texelSize) * kernel[(i + 2) * 5 + (j + 2)];
                }
            }

            // Rezultatul final cu transparență
            // Utilizează transaparența gradual până la rezultatul dorit
            vec4 blurredImage = sum;
            vec4 originalImage = texture2D(inputTexture, vUv);
            vec4 finalColor = mix(originalImage, blurredImage, uBlurFactor); // uBlurFactor controlează gradul de amestecare

            // Ieșirea finală cu transparență
            gl_FragColor = vec4(finalColor.rgb, uBlurFactor); // Folosim uBlurFactor pentru transparență
        }
    `
    };


    // Materialul shader pentru blur
    const blurMaterial = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.clone(blurShader.uniforms),
        vertexShader: blurShader.vertexShader,
        fragmentShader: blurShader.fragmentShader,
        transparent: true, // Activăm transparența
        depthWrite: false, // Dezactivăm scrierea în buffer-ul de adâncime
        depthTest: false // Dezactivăm testarea adâncimii
    });

    // Creăm geometria planului cu dimensiunea personalizată
    const planeGeometry = new THREE.PlaneGeometry(2, 2);

    // Încărcăm textura imaginii
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(imageUrl, texture => {
        texture.minFilter = THREE.LinearFilter; // Asigurăm că textura nu este blurată

        // Actualizăm uniformele cu textura și rezoluția
        blurMaterial.uniforms.inputTexture.value = texture;
        blurMaterial.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);

        // Creăm mesh-ul pentru plan și aplicăm materialul de blur
        const planeMesh = new THREE.Mesh(planeGeometry, blurMaterial);
        planeMesh.position.set(mesh.position.x + 2.1, mesh.position.y, mesh.position.z)
        scene.add(planeMesh);

        // Apelul inițial de render
        render();
    });

    function render() {
        blurMaterial.uniforms.uBlurFactor.value = controls.blurFactor;
        renderer.render(scene, camera);
    }
}
