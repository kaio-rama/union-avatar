    import * as THREE from 'three';

    interface AssetMetadata {
        metadata: {
          body: {
           [key: string]: boolean;
          };
          position: string;
        };
      }
      
      export const applyMetadata = (avatar: THREE.Object3D, metadata: AssetMetadata) => {
        const { position, body } = metadata.metadata;
        const topParts = ["UnionAvatars_Neck", "UnionAvatars_Chest", "UnionAvatars_Belly", "UnionAvatars_Arms_bottom", "UnionAvatars_Arms_top", "UnionAvatars_Hands"];
        const bottomParts = ["UnionAvatars_Legs_bottom", "UnionAvatars_Legs_top", "UnionAvatars_Hips"];
        const shoesParts = ["UnionAvatars_Feet"];
      
        avatar.traverse((child) => {
          if (child) {
            const meshName = child.name;
      
            // Cheks the position of the asset and sets the visibility of the meshes
            if (position === 'top' && topParts.includes(meshName)) {
              child.visible = body[meshName] !== undefined ? body[meshName] : child.visible;
            } else if (position === 'bottom' && bottomParts.includes(meshName)) {
              child.visible = body[meshName] !== undefined ? body[meshName] : child.visible;
            } else if (position === 'shoes' && shoesParts.includes(meshName)) {
              child.visible = body[meshName] !== undefined ? body[meshName] : child.visible;
            }
          }
        });
      };
      