
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import { useEffect } from 'react';
import * as drei from '@react-three/drei';
import { ktx2Loader, dracoLoader } from '../setupKTX2.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import ModelViewer from './modelViewer';

function ViewerCanvas({ modelUrl, backgroundColor, wireframe, useHdri }) {

  useEffect(() => {
    
    if (drei.cache) {
      
      if (!drei.cache.GLTFLoader) {
        
        import('three/examples/jsm/loaders/GLTFLoader.js').then(({ GLTFLoader }) => {
          drei.cache.GLTFLoader = new GLTFLoader();
          drei.cache.GLTFLoader.setKTX2Loader(ktx2Loader);
          drei.cache.GLTFLoader.setDRACOLoader(dracoLoader);
          drei.cache.GLTFLoader.setMeshoptDecoder(MeshoptDecoder);
        });
      } else {
    
        const loader = drei.cache.GLTFLoader;
        if (!loader.ktx2Loader) {
          loader.setKTX2Loader(ktx2Loader);
        }
        if (!loader.dracoLoader) {
          loader.setDRACOLoader(dracoLoader);
        }
        if (!loader.meshoptDecoder) {
          loader.setMeshoptDecoder(MeshoptDecoder);
        }
      }
    }
  }, []);

  return (
    <Canvas 
      style={{ width: '100%', height: '100%', background: backgroundColor }}
      camera={{ position: [0, 0, 5], fov: 50 }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} />
      <Grid 
        args={[20, 20]} 
        cellColor="#4a4a4a" 
        sectionColor="#6a6a6a"
        cellThickness={0.5}
        sectionThickness={1}
        fadeDistance={25}
        fadeStrength={1}
      />
      {modelUrl && <ModelViewer url={modelUrl} wireframe={wireframe} />}
      <OrbitControls 
        enablePan 
        enableZoom 
        enableRotate 
        minDistance={1}
        maxDistance={50}
      />
      {useHdri && <Environment preset="warehouse" />} 
    </Canvas>
  );
}

export default ViewerCanvas;
