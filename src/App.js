import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [accepted, setAccepted] = useState(false);
  
  // State to track the style of the "No" button
  const [noStyle, setNoStyle] = useState({});

  const handleYes = () => {
    setAccepted(true);
  };

  const handleNo = () => {
    alert("Nice try! But you really can't say no.");
  };

  // The logic to make the button run away
  const moveNoButton = () => {
    const x = Math.random() * (window.innerWidth - 100); // Subtract approx button width
    const y = Math.random() * (window.innerHeight - 50); // Subtract approx button height
    
    setNoStyle({
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      transition: 'all 0.1s ease' // Smooth movement, but fast enough to dodge
    });
  };

  return (
    <div className="container">
      {!accepted ? (
        <div className="game-screen">
          <h1 className="mb-5 text-warning" style={{ textShadow: '4px 4px #000' }}>
            LEVEL 14: VALENTINE'S DAY
          </h1>
          
          <div className="card bg-dark text-white p-4 mx-auto" style={{maxWidth: '600px'}}>
            <div className="card-body">
              <pre className="text-success mb-4" style={{lineHeight: '10px', fontSize: '10px'}}>
{`
   _\\/_   _\\/_   _\\/_
    /\\     /\\     /\\
   |  |   |  |   |  |
`}
              </pre>

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
                
                {/* The Runaway Button */}
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