import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Avatar from './Avatars';
import useResizeHandler from '../hooks/useResizeHandler';
import { useRefs } from '../hooks/useRefs';
import { useAssetContext } from './AssetContext';
import { setLightsUp } from '../functions/setLightsUp';
import { useLight } from '../hooks/useLight';
import { downloadScene } from '../functions/downloadScene';

function Scene() {
  const { rendererRef, cameraRef, mountRef } = useRefs();
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [modelPaths, setModelPaths] = useState<{ body: string; head: string }>({    // Model Paths State
    body: "/assets/body/v4_phr_female_UA_base.glb",
    head: "/assets/head/v3_0_head_female.glb",
  });
  const { selectedAsset } = useAssetContext();
  const { currentLight, changeLight } = useLight(scene); // UseLights.ts
  const [asset, setAsset] = useState<{ assets: string[] }>({    // Asset Paths State
    assets: [],
  });
  // change the asset when the user selects a new one on the UI component
  useEffect(() => {    
    if (selectedAsset) {
          setAsset({
        assets: [selectedAsset],
      });
    }
  }, [selectedAsset]); 
  useResizeHandler({ rendererRef, cameraRef }); // Resizing the canvas on window resize

  // Set up the scene
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, (window.innerWidth / 2) / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    const controls = new OrbitControls(camera, renderer.domElement);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshStandardMaterial({ color: 0x21153a }));
    floor.name = 'floor';

    // Set up the scene 
    scene.background = new THREE.Color(0x421b6c);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);
    renderer.setSize(window.innerWidth / 2, window.innerHeight);
    mountRef.current?.appendChild(renderer.domElement);
    controls.target.set(0, 1, 0)  // Look at the center of the scene
    camera.position.set(0, 1.26, 3);    // Position the camera 
    rendererRef.current = renderer;
    cameraRef.current = camera;
    setScene(scene);

    // Lights & ambience
    setLightsUp({ scene, color: currentLight });
    document.getElementById('changeLights')?.addEventListener('click', changeLight);

    // Render Loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
    controls.update();

    // Switching bodys paths
    document.getElementById('mujer')?.addEventListener('click', () => {
      setModelPaths({
        body: "/assets/body/v4_phr_female_UA_base.glb",
        head: "/assets/head/v3_0_head_female.glb",
      });
    });
    document.getElementById('hombre')?.addEventListener('click', () => {
      setModelPaths({
        body: "/assets/body/v4_phr_male_UA_base.glb",
        head: "/assets/head/v3_0_head_male.glb",
      });
    });

    // Download the scene using GLTFExporter
    document.getElementById('download')?.addEventListener('click', () => {
      console.log(scene)
    downloadScene(scene);
    });
    

    // Clean up the scene when the component unmounts
    return () => {mountRef.current?.removeChild(renderer.domElement); console.log('Cleaning up the scene...')};
    
  }, [rendererRef, mountRef, cameraRef]);

  return (
    <div ref={mountRef}>
      {scene && <Avatar modelPaths={modelPaths} scene={scene} assetPaths={asset.assets} />}
    </div>
  );
}

export default Scene;