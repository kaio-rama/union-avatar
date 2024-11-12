import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useLoader } from '../hooks/useLoader';
import { applyMetadata } from '../functions/applyMetadata';
import { replaceExistingAsset } from '../functions/replaceExistingAsset';

interface AssetProps {
  path: string;
  category: string;
  avatarRef: React.MutableRefObject<THREE.Object3D | null>;
  scene: THREE.Scene;
}

const AssetLoader: React.FC<AssetProps> = ({ path, avatarRef, scene, category }) => {
  const { glbLoader } = useLoader();
  const assetRef = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    const fileName = path.split('/').pop() || ''; // Name of the file without extension
    const basePath = path.replace('.glb', '');    // Base path of the asset (without extension)
    const jsonPath = `${basePath}.json`;         // Path of the associated JSON file

    // Load the asset and set name as category
    glbLoader.load(
      path,
      (gltf) => {
        assetRef.current = gltf.scene;
        assetRef.current.name = category;

      // Before adding the new asset, remove the existing one of the same category
       replaceExistingAsset(category, avatarRef.current);

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
         

        // Add the asset to the avatar
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

  }, [category, scene, assetRef, glbLoader, path, avatarRef]);

  return null;
};

export default AssetLoader;