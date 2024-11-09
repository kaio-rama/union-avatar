import React, { createContext, useRef, useEffect, ReactNode, useState } from 'react';
import * as THREE from 'three';

interface WebGLContextType {
  renderer: THREE.WebGLRenderer | null;
  registerRenderArea: (scene: THREE.Scene, camera: THREE.Camera, position: { x: number; y: number; width: number; height: number }) => void;
}

export const WebGLContext = createContext<WebGLContextType>({ renderer: null, registerRenderArea: () => {} });

interface WebGLContextProviderProps {
  children: ReactNode;
}

export const WebGLContextProvider: React.FC<WebGLContextProviderProps> = ({ children }) => {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [renderAreas, setRenderAreas] = useState<{ scene: THREE.Scene; camera: THREE.Camera; position: { x: number; y: number; width: number; height: number }}[]>([]);

  useEffect(() => {
    if (!rendererRef.current) {
      rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(rendererRef.current.domElement);
    }

    const animate = () => {
      if (rendererRef.current) {
        rendererRef.current.setScissorTest(true);

        // Renderizar cada área registrada
        renderAreas.forEach(({ scene, camera, position }) => {
          rendererRef.current!.setScissor(position.x, position.y, position.width, position.height);
          rendererRef.current!.setViewport(position.x, position.y, position.width, position.height);
          rendererRef.current!.render(scene, camera);
        });

        rendererRef.current.setScissorTest(false);
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose();
        document.body.removeChild(rendererRef.current.domElement);
      }
    };
  }, [renderAreas]);

  const registerRenderArea = (scene: THREE.Scene, camera: THREE.Camera, position: { x: number; y: number; width: number; height: number }) => {
    setRenderAreas((prevAreas) => [...prevAreas, { scene, camera, position }]);
  };

  return (
    <WebGLContext.Provider value={{ renderer: rendererRef.current, registerRenderArea }}>
      {children}
    </WebGLContext.Provider>
  );
};