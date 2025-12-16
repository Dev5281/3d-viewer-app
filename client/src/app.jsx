
import { useEffect, useState } from 'react';
import ViewerCanvas from './components/viewerCanvas';
import ControlsPanel from './components/controlsPanel';
import { uploadModel, fetchSettings, saveSettings } from './api/apiClient';

function App() {
  const [modelUrl, setModelUrl] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#222222');
  const [wireframe, setWireframe] = useState(false);
  const [useHdri, setUseHdri] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    fetchSettings().then((s) => {
      if (!s) return;
      if (s.modelUrl) setModelUrl(s.modelUrl);
      if (s.backgroundColor) setBackgroundColor(s.backgroundColor);
      if (typeof s.wireframe === 'boolean') setWireframe(s.wireframe);
    }).catch(err => {
      console.error('Failed to fetch settings:', err);
    });
  }, []);

  const handleUpload = async (file) => {
    setUploading(true);
    setUploadError(null);
    
    try {
      const url = await uploadModel(file);
      setModelUrl(url);
      setUploadError(null);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError(error.message || 'Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
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
        uploading={uploading}
      />
      {uploadError && (
        <div style={{
          padding: '0.75rem 1.5rem',
          background: 'rgba(220, 38, 38, 0.2)',
          borderBottom: '1px solid rgba(220, 38, 38, 0.3)',
          color: '#fca5a5',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <span>⚠️ {uploadError}</span>
          <button
            onClick={() => setUploadError(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fca5a5',
              cursor: 'pointer',
              fontSize: '1.25rem',
              padding: '0 0.5rem'
            }}
          >
            ×
          </button>
        </div>
      )}
      <div style={{ flex: 1, position: 'relative' }}>
        <ViewerCanvas
          modelUrl={modelUrl}
          backgroundColor={backgroundColor}
          wireframe={wireframe}
          useHdri={useHdri}
        />
        {!modelUrl && !uploading && (
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
        {uploading && (
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
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '0.5rem' }}>
              Uploading Model...
            </div>
            <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              Please wait while your file is being processed
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
