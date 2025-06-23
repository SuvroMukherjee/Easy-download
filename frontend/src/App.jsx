import React, { useState } from 'react';
import { encrypt } from './crypto';

function App() {
  const [mode, setMode] = useState('single');
  const [fileUrl, setFileUrl] = useState('');
  const [fileUrls, setFileUrls] = useState(['']);

  // Single file logic
  const handleSingleDownload = async () => {
    if (!fileUrl) {
      alert('Please enter a file URL');
      return;
    }
    const encryptedUrl = encrypt(fileUrl);
    const response = await fetch('/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ encryptedUrl })
    });
    if (!response.ok) {
      alert('Failed to download file');
      return;
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'file.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  // Multiple files logic
  const handleInputChange = (index, value) => {
    const newUrls = [...fileUrls];
    newUrls[index] = value;
    setFileUrls(newUrls);
  };
  const addInput = () => setFileUrls([...fileUrls, '']);
  const removeInput = (index) => setFileUrls(fileUrls.filter((_, i) => i !== index));
  const handleDownloadZip = async () => {
    const validUrls = fileUrls.filter(url => url.trim() !== '');
    if (validUrls.length === 0) {
      alert('Please enter at least one file URL');
      return;
    }
    const encryptedUrls = validUrls.map(url => encrypt(url));
    const response = await fetch('/pdfs-zip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ encryptedUrls })
    });
    if (!response.ok) {
      alert('Failed to download zip');
      return;
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'files.zip';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        padding: 40,
        minWidth: 400,
        maxWidth: 500
      }}>
        <div style={{ marginBottom: 30, display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => setMode('single')}
            style={{
              marginRight: 10,
              background: mode === 'single' ? '#6366f1' : '#f1f5f9',
              color: mode === 'single' ? '#fff' : '#222',
              border: 'none',
              borderRadius: 6,
              padding: '10px 20px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            Single PDF
          </button>
          <button
            onClick={() => setMode('multiple')}
            style={{
              background: mode === 'multiple' ? '#6366f1' : '#f1f5f9',
              color: mode === 'multiple' ? '#fff' : '#222',
              border: 'none',
              borderRadius: 6,
              padding: '10px 20px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            Multiple PDFs (Zip)
          </button>
        </div>
        {mode === 'single' ? (
          <div>
            <h3 style={{ marginBottom: 18, color: '#3730a3' }}>Download Single PDF</h3>
            <input
              type="text"
              placeholder="Enter file URL"
              value={fileUrl}
              onChange={e => setFileUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #c7d2fe',
                borderRadius: 6,
                marginBottom: 18,
                fontSize: 16,
                outline: 'none',
                transition: 'border 0.2s'
              }}
              onFocus={e => e.target.style.border = '1.5px solid #6366f1'}
              onBlur={e => e.target.style.border = '1px solid #c7d2fe'}
            />
            <button
              onClick={handleSingleDownload}
              style={{
                background: '#6366f1',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '10px 22px',
                fontWeight: 500,
                cursor: 'pointer',
                fontSize: 16,
                boxShadow: '0 2px 8px rgba(99,102,241,0.08)',
                transition: 'background 0.2s'
              }}
              onMouseOver={e => e.target.style.background = '#4f46e5'}
              onMouseOut={e => e.target.style.background = '#6366f1'}
            >
              Download PDF
            </button>
          </div>
        ) : (
          <div>
            <h3 style={{ marginBottom: 18, color: '#3730a3' }}>Download Multiple PDFs as Zip</h3>
            {fileUrls.map((url, idx) => (
              <div key={idx} style={{ marginBottom: 10, display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder={`Enter file URL #${idx + 1}`}
                  value={url}
                  onChange={e => handleInputChange(idx, e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    border: '1px solid #c7d2fe',
                    borderRadius: 6,
                    fontSize: 16,
                    outline: 'none',
                    transition: 'border 0.2s'
                  }}
                  onFocus={e => e.target.style.border = '1.5px solid #6366f1'}
                  onBlur={e => e.target.style.border = '1px solid #c7d2fe'}
                />
                {fileUrls.length > 1 && (
                  <button
                    onClick={() => removeInput(idx)}
                    style={{
                      marginLeft: 8,
                      background: '#f87171',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '8px 12px',
                      cursor: 'pointer',
                      fontWeight: 500,
                      fontSize: 14,
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={e => e.target.style.background = '#dc2626'}
                    onMouseOut={e => e.target.style.background = '#f87171'}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <div style={{ marginTop: 10, marginBottom: 18 }}>
              <button
                onClick={addInput}
                style={{
                  background: '#fbbf24',
                  color: '#222',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 16px',
                  fontWeight: 500,
                  fontSize: 15,
                  marginRight: 10,
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={e => e.target.style.background = '#f59e42'}
                onMouseOut={e => e.target.style.background = '#fbbf24'}
              >
                Add Another File
              </button>
              <button
                onClick={handleDownloadZip}
                style={{
                  background: '#6366f1',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '10px 22px',
                  fontWeight: 500,
                  fontSize: 16,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(99,102,241,0.08)',
                  transition: 'background 0.2s'
                }}
                onMouseOver={e => e.target.style.background = '#4f46e5'}
                onMouseOut={e => e.target.style.background = '#6366f1'}
              >
                Download All as Zip
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
