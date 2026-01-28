import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [accepted, setAccepted] = useState(false);

  const handleYes = () => {
    setAccepted(true);
  };

  const handleNo = () => {
    alert("Error: This option is currently locked in the free version. Please upgrade to 'Boyfriend Premium' to unlock rejection.");
  };

  return (
    <div className="container">
      {!accepted ? (
        <div className="game-screen">
          {/* Header Section */}
          <h1 className="mb-5 text-warning">LEVEL 14: VALENTINE'S DAY</h1>
          
          <div className="card bg-dark text-white p-4 mx-auto" style={{maxWidth: '600px'}}>
            <div className="card-body">
              {/* 8-bit Flowers (ASCII art for MVP) */}
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
              
              <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
                <button 
                  className="btn btn-primary btn-lg px-4 gap-3"
                  onClick={handleYes}
                >
                  PRESS START (YES)
                </button>
                
                <button 
                  className="btn btn-danger btn-lg px-4"
                  onClick={handleNo}
                >
                  EXIT (NO)
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* The Success Screen */
        <div className="success-screen fade-in">
          <h1 className="text-success mt-5">GAME OVER!</h1>
          <h2 className="mb-4">YOU WIN!</h2>
          <div className="pixel-heart">♥</div>
          <p className="mt-4">See you on Feb 14th!</p>
          <p className="text-muted">(Check your inventory for chocolates)</p>
        </div>
      )}
    </div>
  );
}

export default App;