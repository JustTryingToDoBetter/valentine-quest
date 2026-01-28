import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [accepted, setAccepted] = useState(false);
  const [noStyle, setNoStyle] = useState({});
  
  // Audio State
  const [audio] = useState(new Audio('/A Lonely Cherry Tree.mp3')); 
  const [isPlaying, setIsPlaying] = useState(false);

  // Audio Logic: Play on first interaction
  const startAudio = () => {
    if (!isPlaying) {
      audio.loop = true; // Loop the music forever
      audio.volume = 0.5; // Set volume to 50% so it's not too loud
      audio.play().catch(e => console.log("Audio play failed:", e));
      setIsPlaying(true);
    }
  };

  // Cleanup: Stop music if component unmounts (rare in this app, but good practice)
  useEffect(() => {
    return () => {
      audio.pause();
    };
  }, [audio]);

  const handleYes = () => {
    setAccepted(true);
    // Optional: Change music on success? 
    // audio.src = '/victory.mp3'; audio.play();
  };

  const handleNo = () => {
    alert("Nice try! But you really can't say no.");
  };

  const moveNoButton = () => {
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 50);
    
    setNoStyle({
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      transition: 'all 0.1s ease'
    });
  };

  return (
    // We add onClick={startAudio} to the main container. 
    // As soon as she touches the screen to scroll or click a button, music starts.
    <div className="container" onClick={startAudio} onTouchStart={startAudio}>
      {!accepted ? (
        <div className="game-screen">
          <h1 className="mb-5 text-warning" style={{ textShadow: '4px 4px #000' }}>
            LEVEL 14: VALENTINE'S DAY
          </h1>
          
          <div className="card bg-dark text-white p-4 mx-auto" style={{maxWidth: '600px'}}>
            <div className="card-body">
              {/* Added a little music note hint */}
              {!isPlaying && <p className="text-muted small mb-2">(Tap anywhere for sound ♪)</p>}
              
              {/* The Pixel Garden */}
          <div className="sprite-container">
            {/* Flower 1 - Left */}
            <img 
              src="/red.jpg" 
              alt="Pixel Flower" 
              className="pixel-art idle-bob" 
            />
            
            {/* Flower 2 - Center (Maybe slightly larger or different?) */}
            <img 
              src="/mixed.jpg" 
              alt="Pixel Flower" 
              className="pixel-art idle-bob delay-1"
              style={{ transform: 'scale(1.2)' }} // Make the middle one bigger
            />
            
            {/* Flower 3 - Right */}
            <img 
              src="/pink.jpg" 
              alt="Pixel Flower" 
              className="pixel-art idle-bob delay-2" 
            />
          </div>

              <p className="card-text mb-5" style={{lineHeight: '1.8'}}>
                PLAYER 1 [JAYDIN] HAS ENCOUNTERED A WILD VALENTINE!<br/><br/>
                QUEST: ASK HER TO BE YOUR VALENTINE.
              </p>
              
              <div className="d-grid gap-3 d-sm-flex justify-content-sm-center position-relative">
                <button 
                  className="btn btn-primary btn-lg px-4 gap-3"
                  onClick={handleYes}
                >
                  PRESS START (YES)
                </button>
                
                <button 
                  className="btn btn-danger btn-lg px-4"
                  style={noStyle}
                  onMouseEnter={moveNoButton} 
                  onClick={handleNo}
                >
                  EXIT (NO)
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="success-screen fade-in mt-5">
          <h1 className="text-success display-1" style={{ textShadow: '4px 4px #000' }}>GAME OVER!</h1>
          <h2 className="mb-4 text-white">YOU WIN!</h2>
          <div className="pixel-heart">♥</div>
          <p className="mt-4 text-white">See you on Feb 14th!</p>
        </div>
      )}
    </div>
  );
}

export default App;