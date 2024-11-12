import { Object3D } from "three";

// Function to remove previous asset based on category
export const replaceExistingAsset = (
    category: string,
    avatar: Object3D | null
  ) => {
        if (!avatar) return;
        // If the category is the same as the last child of the avatar, remove it
        if(avatar.children[avatar.children.length - 1].name === category) {
          avatar.remove(avatar.children[avatar.children.length - 1]);
          return;
        // Else look if it's a child of the avatar and remove it
        } else {
          avatar.children.forEach((child) => {
            if (child.name === category) {
              avatar.remove(child);
            }
          });
      }
    }