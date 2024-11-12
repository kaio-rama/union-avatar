import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export const generateThumbnail = (modelPath: string): Promise<{ path: string, image: string }> => {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(150, 150); // Tamaño del thumbnail

  camera.position.set(0, 0, 1);
  camera.lookAt(0, 0, 0);

  const light = new THREE.AmbientLight(0xffffff, 2);
  scene.add(light);

  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);

  return new Promise((resolve, reject) => {
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;

        // Size each Asset based on its type
        if (model.children[0] && model.children[0].children[0]) {
          const name = model.children[0].children[0].name;
          switch (true) {
            case name.toLowerCase().includes("acs"):
              model.scale.set(1.3, 1.3, 1.3);
              model.position.set(0, -2.5, 0);
              break;
            case name.toLowerCase().includes("hair"):
              model.scale.set(1.0, 1.0, 1.0);
              model.position.set(0, 0, 0);
              break;
          }
        } else if (model.children[0] && model.children[0].name.toLowerCase().includes("shoes")) {
          model.scale.set(1.2, 1.2, 1.2);
          model.position.set(0, 0, 0);
        } else {
          model.scale.set(0.5, 0.5, 0.5);
          model.position.set(0, -0.5, 0);
        }

        scene.add(model);
        renderer.render(scene, camera);

        // Get the image in PNG format
        const dataURL = renderer.domElement.toDataURL('image/png');
        
        // Resolve the promise with the path and the generated image
        resolve({ path: modelPath, image: dataURL });
      },
      undefined,
      (error) => {
        reject(error);
      }
    );
  });
};