import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import AssetLoader from './AssetLoader'; // Importar el componente Asset
import { useLoader } from '../hooks/useLoader';

interface AvatarProps {
  modelPaths: { body: string; head: string };
  assetPaths: string[]; 
  scene: THREE.Scene;
}

const Avatar: React.FC<AvatarProps> = ({ modelPaths, assetPaths, scene }) => {
  const avatarRef = useRef<THREE.Object3D | null>(null);
  const { glbLoader } = useLoader();;

  useEffect(() => {  
    // Clean up the previous avatar before loading a new one
    if (avatarRef.current) {
      scene.remove(avatarRef.current);
      avatarRef.current = null;
    }

    // Loading the body model
    glbLoader.load(
      modelPaths.body,
      (gltf) => {
        // Saving the body model in the avatarRef and the position of the head
        avatarRef.current = gltf.scene.children[1];
        const positionx = gltf.scene.children[0].position.x;
        const positiony = gltf.scene.children[0].position.y;
        const positionz = gltf.scene.children[0].position.z;

        // Loading the head model & positioning it
        glbLoader.load(
          modelPaths.head,
          (gltf) => {
            const head = gltf.scene;
            head.position.set(positionx, positiony, positionz);
            avatarRef.current?.add(head);
            // Adding Avatar to the scene
            if (avatarRef.current) {
              scene.add(avatarRef.current);
            }
          },
          undefined,
          (error) => {    // Hnding error loading the head model
            console.error('Error al cargar la cabeza:', error);
          }
        );
      },
      undefined,
      (error) => {        // Handling error loading the body model
        console.error('Error al cargar el cuerpo:', error);
      }
    );

    // Clean up the avatar when the component unmounts
    return () => {
      if (avatarRef.current) {
        scene.remove(avatarRef.current);
      }
    };
    
  }, [modelPaths, scene, glbLoader]);
  return (
    <>
      {assetPaths.map((path) => (
        <AssetLoader key={path} path={path} category={path.split('/')[3]} avatarRef={avatarRef} scene={scene} />
      ))}
    </>
  );
};

export default Avatar;