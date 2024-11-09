import * as THREE from 'three';

// Function to remove previous asset based on category
export const removeExistingAsset = (
  category: string,
  avatar: THREE.Object3D | null
) => {
      if (!avatar) return;
      if(avatar.children[avatar.children.length - 1].name === category) {
        avatar.remove(avatar.children[avatar.children.length - 1]);
        return;
      }
    }