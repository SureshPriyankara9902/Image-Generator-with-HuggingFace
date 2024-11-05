import React, { useState } from 'react';
import './App.css';

const API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell";
const headers = { "Authorization": "Bearer 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" };

function App() {
  const [prompt, setPrompt] = useState('');
  const [scale, setScale] = useState(400);
  const [format, setFormat] = useState('png');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleScaleChange = (e) => {
    const newScale = parseInt(e.target.value);
    setScale(newScale); // Update scale state
  };

  const generateImage = async () => {
    if (!prompt) {
      alert("Please enter a text prompt.");
      return;
    }

    setLoading(true);
    setProgress(0);
    setImageUrl('');

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ inputs: prompt })
      });

      if (!response.ok) throw new Error("Failed to generate image.");

      let currentProgress = 0;
      const interval = setInterval(() => {
        if (currentProgress < 100) {
          currentProgress += 10;
          setProgress(currentProgress);
        } else {
          clearInterval(interval);
        }
      }, 100);

      const imageBlob = await response.blob();
      const imgUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imgUrl);
      setProgress(100); // Set progress to 100 when done

      // Close progress bar after generating image
      setTimeout(() => {
        setProgress(0); // Reset progress after a brief delay
      }, 1000); // Adjust the time (1000ms = 1 second) as needed

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveImage = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Set canvas dimensions to the current scale value
    canvas.width = scale;
    canvas.height = scale;

    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      context.drawImage(img, 0, 0, scale, scale);
      const link = document.createElement('a');
      link.download = `generated_image.${format}`;
      link.href = canvas.toDataURL(`image/${format}`);
      link.click();
    };
  };

  const clearInputs = () => {
    setPrompt('');
    setImageUrl('');
    setProgress(0);
    setScale(400); // Reset scale to default
  };

  return (
    <div className="App">
      <div className="frame">
        <h1>-IMAGE GENERATOR-</h1>
        <h3>Generate Unlimited Images</h3>
        <div className="input-container">
          <label htmlFor="prompt">Enter your image idea:</label>
          <input 
            type="text" 
            id="prompt" 
            value={prompt} 
            onChange={(e) => setPrompt(e.target.value)} 
            placeholder="Describe your image..." 
            required 
          />
        </div>
        <div className="input-container scale-container">
          <label htmlFor="scale">Scale Image (100-800 px):</label>
          <div className="scale-input-wrapper">
            <input 
              type="range" 
              id="scale" 
              min="100" 
              max="800" 
              value={scale} 
              step="10" 
              onChange={handleScaleChange}
            />
            <span className="scale-value">
              Pixel: {scale}
            </span>
          </div>
        </div>
        <div className="input-container">
          <label htmlFor="format">Select Download Format:</label>
          <select 
            id="format" 
            value={format} 
            onChange={(e) => setFormat(e.target.value)}
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="bmp">BMP</option>
            <option value="gif">GIF</option>
            <option value="webp">WEBP</option>
            <option value="tiff">TIFF</option>
          </select>
        </div>
        <div className="button-container">
          <button id="generateBtn" onClick={generateImage}>Generate Image</button>
          <button id="clearBtn" onClick={clearInputs}>Clear</button>
          <button id="saveBtn" onClick={saveImage} disabled={!imageUrl}>Save Image</button>
        </div>
        {loading && <div className="loading">Generating image...</div>}
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}>
            <div className="progress-text">{progress}%</div>
          </div>
        </div>
        <div className="preview-container">
          <h2>Image Preview</h2>
          {imageUrl && <img src={imageUrl} alt="Generated" style={{ width: `${scale}px`, height: `${scale}px` }} />}
        </div>
        {/* Add bubble animation */}
        <div className="bubbles">
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          
        </div>
        <footer className="footer">
      <p>© 2024 Suresh Priyankara. All Rights Reserved.</p>
    </footer>
      </div>
    </div>
    
  );
}

export default App;
