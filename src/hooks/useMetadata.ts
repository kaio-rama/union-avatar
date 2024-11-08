    import * as THREE from 'three';

    interface AssetMetadata {
        metadata: {
          body: {
           [key: string]: boolean;
          };
          gender: string;
        };
      }

   // Apply metadata if exists
    export const applyMetadata = (avatar: THREE.Object3D, metadata: AssetMetadata) => {
        // Traverse through the avatar object and apply the metadata
        avatar.traverse((child) => {
          if (child.isMesh) {
            const meshName = child.name.toLowerCase();
  
            // Get the body parts from the metadata
            const bodyParts = metadata.metadata.body || {};
  
            // Loop through the body parts and adjust visibility on the avatar
            Object.keys(bodyParts).forEach((part) => {
              if (meshName.includes(part.toLowerCase())) {
                // Set visibility based on metadata for body parts
                child.visible = bodyParts[part];
              }
            });
          }
        });
      };