
function ControlsPanel({
    onUpload,
    backgroundColor,
    setBackgroundColor,
    wireframe,
    setWireframe,
    useHdri,
    setUseHdri,
    onSave,
    uploading = false
  }) {
    return (
      <div style={{
        padding: '1rem 1.5rem',
        background: 'linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        gap: '1.5rem',
        flexWrap: 'wrap',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ 
            fontSize: '0.875rem', 
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: '500'
          }}>
            Upload Model
          </label>
          <label style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            background: uploading ? '#888' : '#646cff',
            color: 'white',
            borderRadius: '6px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem',
            transition: 'all 0.2s',
            border: 'none',
            opacity: uploading ? 0.6 : 1
          }}>
            {uploading ? 'Uploading...' : 'Choose File'}
            <input
              type="file"
              accept=".glb,.gltf"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && !uploading) {
                  onUpload(file);
                }
                // Reset input so same file can be selected again
                e.target.value = '';
              }}
              style={{ display: 'none' }}
            />
          </label>
        </div>
  
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ 
            fontSize: '0.875rem', 
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: '500'
          }}>
            Background Color
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              style={{
                width: '40px',
                height: '40px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                cursor: 'pointer',
                background: 'none'
              }}
            />
            <span style={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.875rem',
              fontFamily: 'monospace'
            }}>
              {backgroundColor}
            </span>
          </div>
        </div>
  
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ 
            fontSize: '0.875rem', 
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: '500'
          }}>
            Display Options
          </label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.875rem'
            }}>
              <input
                type="checkbox"
                checked={wireframe}
                onChange={(e) => setWireframe(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              Wireframe
            </label>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '0.875rem'
            }}>
              <input
                type="checkbox"
                checked={useHdri}
                onChange={(e) => setUseHdri(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              HDRI
            </label>
          </div>
        </div>
  
        <div style={{ marginLeft: 'auto' }}>
          <button 
            onClick={onSave}
            style={{
              padding: '0.625rem 1.5rem',
              background: 'rgba(100, 108, 255, 0.2)',
              border: '1px solid #646cff',
              color: '#646cff',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#646cff';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(100, 108, 255, 0.2)';
              e.target.style.color = '#646cff';
            }}
          >
            Save Settings
          </button>
        </div>
      </div>
    );
  }
  
  export default ControlsPanel;
  