import * as THREE from 'three';

type SceneProps = {
  scene: THREE.Scene;
  color: string;
}

export const setLightsUp = ({ scene, color }: SceneProps) => {
  // Remove lights before adding new ones
  scene.children = scene.children.filter(child => !(child instanceof THREE.DirectionalLight));

  let keyLightColor = 0x5adddf;
  let fillLightColor = 0xc25cc4;
  let backLightColor = 0xac4fff;

  if (color === 'base') {
     keyLightColor = 0x5adddf;
     fillLightColor = 0xc25cc4;
     backLightColor = 0xac4fff;;
  
  } else if (color === 'red') {
    keyLightColor = 0xd5698D;
    fillLightColor = 0x32cdf2;
    backLightColor = 0xfc43a6;

  } else if (color === 'blue') {
    keyLightColor = 0x9999ff;
    fillLightColor = 0x6666ff;
    backLightColor = 0xacc9ff;

  } else if (color === 'green') {
    keyLightColor = 0x6DB8CD;
    fillLightColor = 0x66AF66;
    backLightColor = 0x69CF79;
  }

  // Crear las nuevas luces con los colores específicos
  const keyLight = new THREE.DirectionalLight(keyLightColor, 3);
  keyLight.position.set(3, 2, 2);

  const fillLight = new THREE.DirectionalLight(fillLightColor, 1.5);
  fillLight.position.set(-5, -3, -1);

  const backLight = new THREE.DirectionalLight(backLightColor, 3.5);
  backLight.position.set(3, -2, -2);
  
  // Añadir las nuevas luces y la niebla a la escena
  scene.add(keyLight, fillLight, backLight);
  scene.fog = new THREE.Fog(0x421b6a, 1, 15);  // Un poco de niebla para el efecto
};
