import { useRef } from 'react';
import * as THREE from 'three';

export const useRefs = () => {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const uiContainerRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);

  return { rendererRef, cameraRef, sceneRef, uiContainerRef, mountRef };
};

