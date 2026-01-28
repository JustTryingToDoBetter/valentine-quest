import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// --- Pixelated Canvas Background (low-res render scaled up) ---
function PixelStarfield({ scale = 4 }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d", { alpha: false });

    let raf = 0;
    let w = 0, h = 0;

    // render resolution (low-res), scaled up by CSS
    const state = {
      stars: [],
      t: 0,
    };

    const rand = (min, max) => min + Math.random() * (max - min);

    const resize = () => {
      const cssW = window.innerWidth;
      const cssH = window.innerHeight;

      // low-res internal buffer
      w = Math.max(160, Math.floor(cssW / scale));
      h = Math.max(120, Math.floor(cssH / scale));

      canvas.width = w;
      canvas.height = h;

      // rebuild stars
      const count = Math.floor((w * h) / 180); // density
      state.petals = Array.from({ length: Math.floor((w*h)/900) }).map(() => ({
        x: rand(0, w),
        y: rand(0, h),
        vx: rand(-0.15, 0.15),
        vy: rand(0.12, 0.35),
        r: rand(0, Math.PI * 2),
        vr: rand(-0.03, 0.03),
        s: Math.random() < 0.7 ? 2 : 3, // chunky pixels
        a: rand(0.25, 0.6)
      }));
    };

    const draw = () => {
      state.t += 0.016;

      // background (inky black with a hint of purple)
      ctx.fillStyle = "#05040a";
      ctx.fillRect(0, 0, w, h);

      // subtle "nebula" blocks (pixel-friendly)
      // (kept super light so it doesn't distract)
      for (let i = 0; i < 10; i++) {
        const nx = (i * 37 + (state.t * 8)) % w;
        const ny = (i * 53 + (state.t * 5)) % h;
        ctx.fillStyle = "rgba(255,105,180,0.04)";
        ctx.fillRect(nx, ny, 18, 10);
      }

     // petals (pixel confetti)
    for (const p of state.petals) {
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;

      if (p.y > h + 6) { p.y = -6; p.x = rand(0, w); }
      if (p.x < -6) p.x = w + 6;
      if (p.x > w + 6) p.x = -6;

      // two-tone petal blocks (flower vibe)
      const x = Math.floor(p.x), y = Math.floor(p.y);
      ctx.fillStyle = `rgba(255,79,163,${p.a})`;
      ctx.fillRect(x, y, p.s, p.s);
      ctx.fillStyle = `rgba(255,179,199,${p.a * 0.9})`;
      ctx.fillRect(x + 1, y + 1, 1, 1);
    }

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [scale]);

  return (
    <canvas
      ref={ref}
      className="po-pixel-canvas"
      aria-hidden="true"
    />
  );
}

function PetalBurst() {
  const petals = React.useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.35,
        size: Math.random() < 0.6 ? 10 : 14,
        drift: (Math.random() * 2 - 1) * 60,
      })),
    []
  );

  return (
    <div className="po-burst" aria-hidden="true">
      {petals.map((p) => (
        <span
          key={p.id}
          className="po-petal"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            transform: `translateX(${p.drift}px)`,
          }}
        />
      ))}
    </div>
  );
}

function App() {
  const [level, setLevel] = useState(0); // 0 = Intro, 1 = Reason 1, 2 = Reason 2... Last = Question
  const [noStyle, setNoStyle] = useState({});
  const [audio] = useState(new Audio('/A Lonely Cherry Tree.mp3'));
  const [isPlaying, setIsPlaying] = useState(false);
  const [burstKey, setBurstKey] = React.useState(0);

  function handleYes(e) {
    e.stopPropagation(); // prevents audio click double-trigger feel
    setBurstKey((k) => k + 1); // triggers burst
    nextLevel();
  }

  // --- STORY DATA: EDIT THIS SECTION ---
  const story = [
    {
      title: "LEVEL 1: THE BEGINNING",
      image: "/red.jpg", // You can use different images for each stage!
      text: "Player 1 (Jaydin) creates a new server. Player 2 (You) joins the game. The adventure begins."
    },
    {
      title: "LEVEL 5: CO-OP MODE",
      image: "/mixed.jpg", 
      text: "Scanning database... Finding reasons why we make the best team:\n\n1. You put up with my coding bugs (nonsense).\n2. Your smile restores my HP."
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
        <h1 className="mb-3 po-title" style={{ color: "#ff79c6", textShadow: "4px 4px #000" }}>{story[level].title}</h1>
        
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
    {/* BACKGROUND */}
    <PixelStarfield scale={4} />
    <div className="po-crt" aria-hidden="true" />

    {/* PETAL BURST (YES effect) */}
    {burstKey > 0 && <PetalBurst key={burstKey} />}

    {/* CONTENT */}
    <div className="container">
      <div className="po-card">
        {!isPlaying && (
          <p className="text-muted small fixed-top mt-2 ms-2">(Tap for sound ♪)</p>
        )}

        {/* STORY */}
        {level < story.length && renderStorySlide()}

        {/* FINAL LEVEL */}
        {level === story.length && (
          <div className="game-screen text-center fade-in">
            <div className="po-garland" aria-hidden="true">
              <span>✿</span><span>❀</span><span>✿</span><span>❀</span><span>✿</span>
            </div>

            <h1 className="mb-3 po-title" style={{ textShadow: "4px 4px #000" }}>
              FINAL LEVEL
            </h1>

            <div className="card bg-dark text-white p-4 mx-auto" style={{ maxWidth: "600px" }}>
              <div className="card-body">
                <div className="sprite-container">
                  <img src="/red.jpg" className="pixel-art idle-bob" alt="flower" style={{ width: "50px" }} />
                  <img
                    src="/mixed.jpg"
                    className="pixel-art idle-bob delay-1"
                    style={{ width: "50px", transform: "scale(1.2)" }}
                    alt="flower"
                  />
                  <img src="/red.jpg" className="pixel-art idle-bob delay-2" alt="flower" style={{ width: "50px" }} />
                </div>

                <p className="card-text mb-5">
                  A HEARTFELT ENCOUNTER...
                  <br /><br />
                  QUEST: WILL YOU BE MY VALENTINE?
                </p>

                <div className="d-grid gap-3 d-sm-flex justify-content-sm-center position-relative">
                  <button className="btn po-btn po-btn-yes" onClick={handleYes}>
                    YES <small>(PRESS START)</small>
                  </button>
                  <button
                    className="btn po-btn po-btn-no"
                    style={noStyle}
                    onMouseEnter={moveNoButton}
                    onClick={handleNo}
                  >
                    NO
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VICTORY */}
        {level > story.length && (
          <div className="success-screen text-center fade-in">
            <h1 className="text-success display-1 mb-4" style={{ textShadow: "4px 4px #000" }}>
              QUEST COMPLETE!
            </h1>
            <div className="pixel-heart mb-4" style={{ fontSize: "100px" }}>♥</div>
            <p className="lead text-white">See you on Feb 14th!</p>
          </div>
        )}
      </div>
    </div>
  </div>
);
}

export default App;