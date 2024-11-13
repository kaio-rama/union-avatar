import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import * as THREE from 'three';

interface ExportOptions {
  binary: boolean;
}

type ExportResultCallback = (result: ArrayBuffer | object) => void;

export const downloadScene = (scene: THREE.Scene | null) => { 
    if (scene) {
      const avatar = scene.children[4];
      const exporter = new GLTFExporter();
      const options: ExportOptions = {
        binary: true, 
      };
      
      const onResult: ExportResultCallback = (result) => {
        let blob;
        if (options.binary && result instanceof ArrayBuffer) {
          blob = new Blob([result], { type: 'application/octet-stream' });
        } else {
          blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
        }

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'unionAvatar.glb';
        link.click();
      };

      // Can't find a proper Type for this ...
      exporter.parse(avatar, onResult, options as GLTFExporter.Options);
    }
};
