import { useEffect, useCallback } from 'react';
import * as THREE from 'three';

interface UseResizeHandlerProps {
  rendererRef: React.MutableRefObject<THREE.WebGLRenderer | null>;
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>;
}

function useResizeHandler({ rendererRef, cameraRef }: UseResizeHandlerProps) {
  const handleResize = useCallback(() => {
    if (rendererRef.current && cameraRef.current) {
      const width = window.innerWidth / 2;
      const height = window.innerHeight;
      rendererRef.current.setSize(width, height);
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
    }
  }, [rendererRef, cameraRef]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize(); // Llamamos una vez para ajustar el tamaño inicial
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);
}

export default useResizeHandler;