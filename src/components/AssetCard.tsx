import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useLoader } from '../hooks/useLoader';
import { useRefs } from '../hooks/useRefs';
import { useAssetContext } from './AssetContext';

interface AssetCardProps {
  path: string;
  category: string;
  currentCategory: string;
}

export default function AssetCard({ path, category, currentCategory }: AssetCardProps) {
  const { setSelectedAsset } = useAssetContext();
  const { glbLoader } = useLoader();
  const { mountRef, rendererRef } = useRefs();
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(new THREE.PerspectiveCamera(25, 1, 0.1, 1000));

  useEffect(() => {

    // this will crash the browser cuz too many webgl contexts
    // https://webglfundamentals.org/webgl/lessons/webgl-multiple-views.html posible solution ?
    
    if (!rendererRef.current) {
      rendererRef.current = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      rendererRef.current.setSize(150, 150);
    }
    
    if (mountRef.current && !mountRef.current.contains(rendererRef.current.domElement)) {
      mountRef.current.appendChild(rendererRef.current.domElement);
    }

    cameraRef.current.position.set(0, 0, 2);
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    sceneRef.current.add(ambientLight);

    glbLoader.load(
      path,
      (gltf) => {
        const model = gltf.scene;
    
        // Check if children[0] and children[0].children[0] exist before accessing the name
        // This is to handle the differents scales and positions for small elements
        if (model.children[0] && model.children[0].children[0]) {
          const name = model.children[0].children[0].name;

          switch (true) {
            case name.toLowerCase().includes("acs"):
              model.scale.set(1.3, 1.3, 1.3); // Default scale for these names
              model.position.set(0, -2.5, 0); // Position adjustment for these names
              break;


            case name.toLowerCase().includes("hair"):
              model.scale.set(1.0, 1.0, 1.0); // Larger scale for these names
              model.position.set(0, 0, 0); // Position adjustment for these names
              break;
    
            default:
              model.scale.set(0.5, 0.5, 0.5); // Default scale for other elements
              model.position.set(0, -.5, 0); // Common position adjustment
          }
        } else if (model.children[0] && model.children[0].name.toLowerCase().includes("shoes")) {
              model.scale.set(1.2, 1.2, 1.2); // Default scale for these names
              model.position.set(0, 0, 0); // Position adjustment for these names

        } else {
          // Default scale if the hierarchy does not match
          model.scale.set(0.5, 0.5, 0.5);
          model.position.set(0, -.5, 0); // Common position adjustment
        }
    
        sceneRef.current.add(model); // Add the model to the scene
        rendererRef.current?.render(sceneRef.current, cameraRef.current);
      },
      undefined,
      (error) => {
        console.error("Error loading GLB model:", error);
      }
    );
    
  }, [path, glbLoader, mountRef, rendererRef, setSelectedAsset, category, currentCategory]);

  const handleClick = () => {
    if (category === currentCategory) {
      setSelectedAsset(path); // Set the selected asset in the global state
    }
  };

  return <div ref={mountRef} className='asset-card' onClick={handleClick} />;
}
