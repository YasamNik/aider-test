import React, { useState } from 'react';
import './App.css';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleRunDocker = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await fetch('/run-docker', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to start Docker container');
      }
      
      const result = await response.json();
      console.log('Docker output:', result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="app-container">
      <h1>Upscale Processing</h1>
      <button 
        onClick={handleRunDocker}
        disabled={isProcessing}
        className="docker-button"
      >
        {isProcessing ? 'Processing...' : 'Start Enhancement'}
      </button>
      {error && <p className="error-message">Error: {error}</p>}
      <div className="status-message">
        {isProcessing ? 'Processing in progress...' : 'Ready to process'}
      </div>
    </div>
  );
}

export default App;
