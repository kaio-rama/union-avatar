import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useLoader } from '../hooks/useLoader';
import { applyMetadata } from '../hooks/useMetadata';

interface AssetProps {
  path: string;
  category: string;
  avatarRef: React.MutableRefObject<THREE.Object3D | null>; // Reference to the Avatar
  scene: THREE.Scene;
}

const Asset: React.FC<AssetProps> = ({ path, avatarRef, scene, category }) => {
  const { glbLoader } = useLoader();
  const assetRef = useRef<THREE.Object3D | null>(null);

  // Function to remove previous asset based on category
  const removeExistingAsset = (
    category: string,
    avatar: THREE.Object3D | null
  ) => {
        if (!avatar) return;
        if(avatar.children[avatar.children.length - 1].name === category) {
          avatar.remove(avatar.children[avatar.children.length - 1]);
          return;
        }
      }

  useEffect(() => {
    // Name of the file without extension
    const fileName = path.split('/').pop() || '';
    const basePath = path.replace('.glb', '');
    const jsonPath = `${basePath}.json`;

    // Load and add the asset to the scene
    glbLoader.load(
      path,
      (gltf) => {
        assetRef.current = gltf.scene;
        assetRef.current.name = category;

      // Before adding the new asset, remove the existing one of the same category
       removeExistingAsset(category, avatarRef.current);

        // Try to load the associated JSON file
        fetch(jsonPath)
          .then((res) => (res.ok ? res.json() : null))
          .then((metadata) => {
            if (metadata && avatarRef.current) {          
              applyMetadata(avatarRef.current, metadata);     // Apply the metadata to the avatar          
              assetRef.current?.scale.set(1.12, 1.12, 1.12);   // fixing scale of assets
            }
          })
          .catch(() => {
            console.warn(`No JSON found for ${fileName}, loading only .glb.`);
          });
         

        // Add the asset to the avatar or scene
        if (avatarRef.current) {
          // if the asset is a hair, set the position, sorry about this too..
          if (assetRef.current.name.toLowerCase().includes("hair")) {
              assetRef.current.position.set(0, 1.7, -0.035);
          }
          avatarRef.current.add(assetRef.current);
        } 
      },
      undefined,
      (error) => {
        console.error(`Error loading asset ${fileName}:`, error);
      }
    );

    return () => {
      // Clean up the asset from the scene
      if (assetRef.current) {
        if (avatarRef.current) {
          avatarRef.current.remove(assetRef.current);
        } else {
          scene.remove(assetRef.current);
        }
      }
    };
  }, [removeExistingAsset, applyMetadata, category, scene, assetRef, glbLoader, path]);

  return null;
};

export default Asset;