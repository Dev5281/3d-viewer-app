// client/src/App.jsx
import { useEffect, useState } from 'react';
import ViewerCanvas from './components/viewerCanvas';
import ControlsPanel from './components/controlsPanel';
import { uploadModel, fetchSettings, saveSettings } from './api/apiClient';

function App() {
  const [modelUrl, setModelUrl] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#222222');
  const [wireframe, setWireframe] = useState(false);
  const [useHdri, setUseHdri] = useState(false);

  useEffect(() => {
    fetchSettings().then((s) => {
      if (!s) return;
      if (s.modelUrl) setModelUrl(s.modelUrl);
      if (s.backgroundColor) setBackgroundColor(s.backgroundColor);
      if (typeof s.wireframe === 'boolean') setWireframe(s.wireframe);
    });
  }, []);

  const handleUpload = async (file) => {
    const url = await uploadModel(file);
    setModelUrl(url);
  };

  const handleSave = async () => {
    await saveSettings({ backgroundColor, wireframe, modelUrl });
  };

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      <ControlsPanel
        onUpload={handleUpload}
        backgroundColor={backgroundColor}
        setBackgroundColor={setBackgroundColor}
        wireframe={wireframe}
        setWireframe={setWireframe}
        useHdri={useHdri}
        setUseHdri={setUseHdri}
        onSave={handleSave}
      />
      <div style={{ flex: 1, position: 'relative' }}>
        <ViewerCanvas
          modelUrl={modelUrl}
          backgroundColor={backgroundColor}
          wireframe={wireframe}
          useHdri={useHdri}
        />
        {!modelUrl && (
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            padding: '2rem 3rem',
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            color: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '12px',
            zIndex: 10,
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '0.5rem' }}>
              No Model Loaded
            </div>
            <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              Upload a GLB or GLTF file to get started
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
