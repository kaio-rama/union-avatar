import { useRef , useEffect} from 'react';
import * as THREE from 'three';

export const useRefs = () => {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const uiContainerRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    if(!rendererRef.current){
      rendererRef.current = new THREE.WebGLRenderer();
    }
    return () => {
      if(rendererRef.current){
        rendererRef.current.dispose();
      }
    };
  }, []);
  
  return { rendererRef, cameraRef, sceneRef, uiContainerRef, mountRef };
};

