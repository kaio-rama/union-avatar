import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Avatar from './Avatars';
import useResizeHandler from '../hooks/useResizeHandler';
import { useRefs } from '../hooks/useRefs';
import { useAssetContext } from './AssetContext';

function Scene() {
  const { rendererRef, cameraRef, mountRef } = useRefs();
  const [scene, setScene] = useState<THREE.Scene | null>(null);

  
  // Estado para los paths de los modelos
  const [modelPaths, setModelPaths] = useState<{ body: string; head: string }>({
    body: "/assets/body/v4_phr_female_UA_base.glb",
    head: "/assets/head/v3_0_head_female.glb",
  });
  
  // Estado para los paths de los assets de prendas de vestir (a partir del contexto)
  const [asset, setAsset] = useState<{ assets: string[] }>({
    assets: [],
  });

  const { selectedAsset } = useAssetContext();

  // Resizing the canvas on window resize
  useResizeHandler({ rendererRef, cameraRef });

  // Set up the scene
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, (window.innerWidth / 2) / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    const controls = new OrbitControls(camera, renderer.domElement);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshStandardMaterial({ color: 0x21153a }));

    // Set up the scene
    scene.background = new THREE.Color(0x421b6c);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    renderer.setSize(window.innerWidth / 2, window.innerHeight);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }
    controls.target.set(0, 1, 0)
    camera.position.set(-1, 2, 4);
    rendererRef.current = renderer;
    cameraRef.current = camera;
    setScene(scene);

    // Lights & ambience
    const ambientLight = new THREE.AmbientLight(0xffffff, .5);
    const directionalLight = new THREE.DirectionalLight(0xfdfddf, 3);
    directionalLight.position.set(1, 1, 1).normalize();
    directionalLight.castShadow = true;
    scene.add(directionalLight, ambientLight);
    scene.fog = new THREE.Fog(0x421b6f, 1, 15);

    // Render Loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    controls.update();

    // Switching bodys
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

    // Clean up the scene when the component unmounts
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [rendererRef, mountRef]);

  // Actualiza el estado 'asset' cuando 'selectedAsset' cambia
  useEffect(() => {
    if (selectedAsset) {
      // Aquí puedes modificar los paths de los assets de acuerdo con el asset seleccionado
      setAsset({
        assets: [selectedAsset], // Puedes modificar esta lógica para agregar más assets
      });
    }
  }, [selectedAsset, modelPaths.body, modelPaths.head]); // Dependencias del efecto

  return (
    <div ref={mountRef}>
      {scene && <Avatar modelPaths={modelPaths} scene={scene} assetPaths={asset.assets} />}
    </div>
  );
}

export default Scene;