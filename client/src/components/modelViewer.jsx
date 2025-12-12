// client/src/components/ModelViewer.jsx
import { useLoader } from '@react-three/fiber';
import { Suspense, useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ktx2Loader, dracoLoader } from '../setupKTX2.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

function ModelViewer({ url, wireframe }) {
  // Always call hooks - useLoader needs a valid URL, so we'll handle empty URL in wrapper
  // Use a placeholder URL if url is empty to satisfy hook rules
  const gltf = useLoader(
    GLTFLoader,
    url || 'data:application/octet-stream;base64,',
    (loader) => {
      // Configure loader before it's used
      loader.setKTX2Loader(ktx2Loader);
      loader.setDRACOLoader(dracoLoader);
      loader.setMeshoptDecoder(MeshoptDecoder);
    }
  );

  const scene = gltf?.scene;

  useEffect(() => {
    if (!scene || !url) return;
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.wireframe = wireframe;
      }
    });
  }, [scene, wireframe, url]);

  if (!url || !scene) return null;
  return <primitive object={scene} />;
}

// Wrapper with Suspense for loading state
function ModelViewerWithSuspense({ url, wireframe }) {
  if (!url) return null;
  
  return (
    <Suspense fallback={null}>
      <ModelViewer url={url} wireframe={wireframe} />
    </Suspense>
  );
}

export default ModelViewerWithSuspense;

