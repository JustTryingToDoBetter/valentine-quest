import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [level, setLevel] = useState(0); // 0 = Intro, 1 = Reason 1, 2 = Reason 2... Last = Question
  const [noStyle, setNoStyle] = useState({});
  const [audio] = useState(new Audio('/A Lonely Cherry Tree.mp3'));
  const [isPlaying, setIsPlaying] = useState(false);

  // --- STORY DATA: EDIT THIS SECTION ---
  const story = [
    {
      title: "LEVEL 1: THE BEGINNING",
      image: "/red.jpg", // You can use different images for each stage!
      text: "Player 1 (Jaydin) creates a new server. Player 2 joins the game. The adventure begins."
    },
    {
      title: "LEVEL 5: CO-OP MODE",
      image: "/mixed.jpg", 
      text: "Scanning database... Finding reasons why we make the best team:\n\n1. You put up with my coding bugs.\n2. Your smile restores my HP."
    },
    {
      title: "LEVEL 10: THE ACHIEVEMENT",
      image: "/pink.jpg", 
      text: "Achievement Unlocked: 'Found The One'.\n\nStats:\nHAPPINESS: 100%\nLOVE: 9999+"
    }
  ];
  // -------------------------------------

  const startAudio = () => {
    if (!isPlaying) {
      audio.loop = true;
      audio.volume = 0.5;
      audio.play().catch(e => console.log(e));
      setIsPlaying(true);
    }
  };

  const nextLevel = () => {
    setLevel(level + 1);
  };

  const handleNo = () => {
    alert("Nice try! But you really can't say no.");
  };

  const moveNoButton = () => {
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 50);
    setNoStyle({ position: 'absolute', left: `${x}px`, top: `${y}px` });
  };

  // Renders the current "Story Slide"
  const renderStorySlide = () => (
    <div className="card bg-dark text-white p-4 mx-auto fade-in" style={{maxWidth: '600px'}}>
      <div className="card-body">
        <h3 className="text-warning mb-4" style={{fontSize: '18px'}}>{story[level].title}</h3>
        
        {/* Simple sprite animation */}
        <div className="mb-4">
           <img src={story[level].image} alt="icon" className="pixel-art idle-bob" style={{width: '60px'}} />
        </div>

        <p className="card-text mb-5" style={{lineHeight: '1.8', whiteSpace: 'pre-line'}}>
          {story[level].text}
        </p>
        
        <button className="btn btn-outline-light btn-lg w-100" onClick={nextLevel}>
          NEXT LEVEL &gt;
        </button>
      </div>
    </div>
  );

  return (
    <div onClick={startAudio} onTouchStart={startAudio}>
      
      {/* --- BACKGROUND LAYERS --- */}
      <div id="stars" style={{position:'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1}}></div>
      <div id="stars2" style={{position:'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1}}></div>
      <div id="stars3" style={{position:'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1}}></div>
      
      <div className="container">
        
        {!isPlaying && <p className="text-muted small fixed-top mt-2 ms-2">(Tap for sound ♪)</p>}

        {/* --- STORY LOGIC --- */}
        {level < story.length && renderStorySlide()}

        {/* --- BOSS BATTLE --- */}
        {level === story.length && (
          <div className="game-screen text-center fade-in">
            <h1 className="mb-4 text-warning" style={{ textShadow: '4px 4px #000' }}>FINAL LEVEL</h1>
            <div className="card bg-dark text-white p-4 mx-auto" style={{maxWidth: '600px'}}>
               <div className="card-body">
                  <div className="sprite-container">
                    <img src="/red.jpg" className="pixel-art idle-bob" alt="flower" style={{width: '50px'}}/>
                    <img src="/mixed.jpg" className="pixel-art idle-bob delay-1" style={{width: '50px', transform: 'scale(1.2)'}} alt="flower"/>
                    <img src="/red.jpg" className="pixel-art idle-bob delay-2" style={{width: '50px'}} alt="flower"/>
                  </div>
                  <p className="card-text mb-5">
                    WARNING: WILD VALENTINE APPEARED!<br/><br/>
                    QUEST: WILL YOU BE MY VALENTINE?
                  </p>
                  <div className="d-grid gap-3 d-sm-flex justify-content-sm-center position-relative">
                    <button className="btn btn-primary btn-lg px-4" onClick={nextLevel}>YES <small>(PRESS START)</small></button>
                    <button className="btn btn-danger btn-lg px-4" style={noStyle} onMouseEnter={moveNoButton} onClick={handleNo}>NO</button>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* --- VICTORY --- */}
        {level > story.length && (
          <div className="success-screen text-center fade-in">
            <h1 className="text-success display-1 mb-4" style={{ textShadow: '4px 4px #000' }}>QUEST COMPLETE!</h1>
            <div className="pixel-heart mb-4" style={{fontSize: '100px'}}>♥</div>
            <p className="lead text-white">See you on Feb 14th!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;