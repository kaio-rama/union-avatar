import * as THREE from 'three';

export const removeExistingAsset = (
  category: string,
  avatar: THREE.Object3D | null
) => {
  if (!avatar) return;

  // Recopila los objetos que deben eliminarse
  const objectsToRemove: THREE.Object3D[] = [];

  avatar.traverse((child) => {
    if (child && child.name.toLowerCase().includes(category.toLowerCase())) {
      objectsToRemove.push(child); // Añade el objeto a la lista de eliminación
    }
  });

  // Elimina los objetos de la lista, asegurándose de no interferir con el recorrido
  objectsToRemove.forEach((obj) => {
    if (obj.parent) {
      obj.parent.remove(obj);
    }
  });
};