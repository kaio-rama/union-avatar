import { useState, useEffect } from 'react';
import { setLightsUp } from '../functions/setLightsUp';
import * as THREE from 'three';

export const useLight = (scene: THREE.Scene | null) => {
  const [currentLight, setCurrentLight] = useState<'red' | 'blue' | 'green' | 'base' >('base');

  useEffect(() => {
    if (scene) {
      setLightsUp({ scene, color: currentLight });
    }
  }, [currentLight, scene]);

  const changeLight = () => {
    setCurrentLight((prevLight) => {
      if (prevLight === 'red') return 'blue';
      if (prevLight === 'blue') return 'green';
      if (prevLight === 'green') return 'base';
      return 'red';
    });
  };

  return { currentLight, changeLight };
};
