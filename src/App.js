import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import FaceComponent from './components/FaceComponent';

function App() {

  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="App">
      <header>
        <h1>Această aplicație are scop didactic și a fost realizată în cadrul lucrării de licență.</h1>
      </header>

      {showVideo === true ? <FaceComponent /> : <div className="gif">
      </div>}
      <div className="disclaimer">
        <h3>Aplicația utilizează camera web și folosește un algoritm inteligență artificială pentru prelucrarea datelor de tip biometric. Aplicația nu va stoca informațiile dumneavoastră!</h3>
      </div>
      {showVideo ? <button onClick={() => setShowVideo(false)}>Stop</button> : <button onClick={() => setShowVideo(true)}>Start</button>}
    </div>
  );
}

export default App;
