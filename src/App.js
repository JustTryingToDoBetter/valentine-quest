import React, { useEffect, useMemo, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

/* ============================================================================
  Project Odysseus — Valentine Mini-Game (V2 polish)
  Adds:
  - Boot screen + PRESS START
  - Cinematic transitions between levels
  - Sprite-sheet rendering (with fallback to <img>)
============================================================================ */

function PixelStarfield({ scale = 4 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });

    let raf = 0;
    const stars = [];

    const resize = () => {
      const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // rebuild stars relative to viewport
      stars.length = 0;
      const count = Math.floor((window.innerWidth * window.innerHeight) / (12000 / scale));
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          s: Math.random() < 0.85 ? 1 : 2,
          v: (0.35 + Math.random() * 0.9) * scale * 0.2,
          a: 0.45 + Math.random() * 0.55,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // tiny twinkle
      for (const st of stars) {
        st.y -= st.v;
        if (st.y < -5) {
          st.y = window.innerHeight + 5;
          st.x = Math.random() * window.innerWidth;
        }
        ctx.globalAlpha = st.a;
        ctx.fillStyle = "#fff";
        ctx.fillRect(Math.floor(st.x), Math.floor(st.y), st.s, st.s);
      }
      ctx.globalAlpha = 1;

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

  return <canvas ref={ref} className="po-pixel-canvas" aria-hidden="true" />;
}

function PetalBurst() {
  const petals = useMemo(
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

function TypeText({ text, speed = 35 }) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplay("");
    const t = setInterval(() => {
      setDisplay(text.slice(0, i++));
      if (i > text.length) clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [text, speed]);

  return <p className="po-dialogue">{display}</p>;
}

function CursorSparkles({ enabled = true }) {
  const [sparks, setSparks] = useState([]);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e) => {
      // reduce rate a little (still feels “alive”)
      if (Math.random() > 0.55) return;

      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const dx = (Math.random() * 2 - 1) * 26;
      const dy = (Math.random() * 2 - 1) * 26;
      const size = Math.random() < 0.75 ? 10 : 14;

      setSparks((prev) => [
        ...prev,
        {
          id,
          x: e.clientX,
          y: e.clientY,
          dx,
          dy,
          size,
        },
      ]);

      window.setTimeout(() => {
        setSparks((prev) => prev.filter((s) => s.id !== id));
      }, 700);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="po-spark-layer" aria-hidden="true">
      {sparks.map((s) => (
        <span
          key={s.id}
          className="po-spark"
          style={{
            left: `${s.x}px`,
            top: `${s.y}px`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            "--dx": `${s.dx}px`,
            "--dy": `${s.dy}px`,
          }}
        />
      ))}
    </div>
  );
}

function Sprite({ src, w = 32, h = 32, frames = 6, dur = 0.85, alt = "" }) {
  // Sprite-sheet rendering (div background) with a safe <img> fallback.
  // If you haven't added sprite sheets yet, keep using the JPGs — it’ll still work.
  if (!src) return null;

  const isSpriteSheet = src.toLowerCase().endsWith(".png") || src.toLowerCase().includes("sprites");
  if (!isSpriteSheet) {
    return <img src={src} alt={alt} className="pixel-art idle-bob" style={{ width: `${Math.max(w, 40)}px` }} />;
  }

  return (
    <span
      className="po-sprite"
      aria-label={alt}
      role="img"
      style={{
        "--w": `${w}px`,
        "--h": `${h}px`,
        "--frames": frames,
        "--dur": `${dur}s`,
        "--img": `url(${src})`,
      }}
    />
  );
}

function TransitionOverlay({ active, label = "LOADING…" }) {
  return (
    <div className={`po-transition ${active ? "active" : ""}`} aria-hidden={!active}>
      <div className="po-transition-inner">
        <div className="po-transition-chip">{label}</div>
        <div className="po-transition-sub">Saving progress…</div>
      </div>
    </div>
  );
}

export default function App() {
  const [phase, setPhase] = useState("boot"); // boot | game
  const [level, setLevel] = useState(0);
  const [noStyle, setNoStyle] = useState({});
  const [burstKey, setBurstKey] = useState(0);
  const [noTrail, setNoTrail] = useState([]);
  const [cutscene, setCutscene] = useState(false);

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [transitionOn, setTransitionOn] = useState(false);
  const [transitionLabel, setTransitionLabel] = useState("LOADING…");

  // --- STORY DATA: EDIT THIS SECTION ---
  const story = useMemo(
    () => [
      {
        title: "LEVEL 1: THE BEGINNING",
        image: "/red.jpg",
        // Optional sprite-sheet replacement:
        // sprite: "/sprites/flower_red.png",
        text: "Player 1 (Jaydin) creates a new server. Player 2 (You) joins the game. The adventure begins.",
      },
      {
        title: "LEVEL 5: CO-OP MODE",
        image: "/mixed.jpg",
        // sprite: "/sprites/flower_mixed.png",
        text:
          "Scanning database... Finding reasons why we make the best team:\n\n" +
          "1. You put up with my coding bugs (nonsense).\n" +
          "2. Your smile restores my HP.",
      },
      {
        title: "LEVEL 10: THE ACHIEVEMENT",
        image: "/pink.jpg",
        // sprite: "/sprites/flower_pink.png",
        text: "Achievement Unlocked: 'Found The One'.\n\nStats:\nHAPPINESS: 100%\nLOVE: 9999+",
      },
    ],
    []
  );
  // -------------------------------------

  useEffect(() => {
    audioRef.current = new Audio("/A Lonely Cherry Tree.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const startAudio = () => {
    const a = audioRef.current;
    if (!a || isPlaying) return;
    a.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // silent: browser gesture rules, we’ll retry on next click
      });
  };

  // “cinematic” transition wrapper
  const goNext = (opts = {}) => {
    const { label = "LOADING…", delayMs = 520 } = opts;

    setTransitionLabel(label);
    setTransitionOn(true);

    window.setTimeout(() => {
      setLevel((v) => v + 1);
      window.setTimeout(() => setTransitionOn(false), 240);
    }, delayMs);
  };

  function spawnNoPetals() {
    const now = Date.now();
    const batch = Array.from({ length: 8 }).map((_, i) => ({
      id: `${now}-${i}`,
      x: Math.random() * 100,
      y: 62 + Math.random() * 10,
      s: Math.random() < 0.7 ? 8 : 12,
      d: Math.random() * 0.25,
      dx: (Math.random() * 2 - 1) * 80,
    }));

    setNoTrail((prev) => [...prev, ...batch]);

    window.setTimeout(() => {
      setNoTrail((prev) => prev.filter((p) => !batch.some((b) => b.id === p.id)));
    }, 1600);
  }

  const moveNoButton = (e) => {
    e?.stopPropagation?.();
    const x = Math.random() * (window.innerWidth - 140);
    const y = Math.random() * (window.innerHeight - 80);
    setNoStyle({ position: "absolute", left: `${x}px`, top: `${y}px` });
    spawnNoPetals();
  };

  const handleNo = (e) => {
    e?.stopPropagation?.();
    moveNoButton(e);
  };

  const handlePressStart = () => {
    startAudio();
    setPhase("game");
  };

  const handleYes = (e) => {
    e.stopPropagation();
    setBurstKey((k) => k + 1);
    goNext({ label: "LEVEL UP!" });
  };

  // Trigger a little “boss aura” on final screen
  useEffect(() => {
    if (level === story.length) setCutscene(true);
    else setCutscene(false);
  }, [level, story.length]);

  const renderStorySlide = () => {
    const s = story[level];
    return (
      <div className="po-frame text-white p-4 mx-auto" style={{ maxWidth: "600px" }}>
        <div className="po-sparkle" aria-hidden="true" />
        <div className="po-corner tl" aria-hidden="true">
          <span>✿</span>
        </div>
        <div className="po-corner tr" aria-hidden="true">
          <span>❀</span>
        </div>
        <div className="po-corner bl" aria-hidden="true">
          <span>❀</span>
        </div>
        <div className="po-corner br" aria-hidden="true">
          <span>✿</span>
        </div>

        <div className="card-body p-0">
          <div className="text-center">
            <div className="po-garland" aria-hidden="true">
              <span>✿</span>
              <span>❀</span>
              <span>✿</span>
              <span>❀</span>
            </div>

            <h1 className="mb-3 po-title" style={{ color: "#ff79c6", textShadow: "4px 4px #000" }}>
              {s.title}
            </h1>

            <div className="mb-3">
              <Sprite src={s.sprite || s.image} w={32} h={32} frames={6} dur={0.8} alt="icon" />
            </div>
          </div>

          <p className="card-text mb-4" style={{ lineHeight: "1.8", whiteSpace: "pre-line" }}>
            {s.text}
          </p>

          <button className="btn btn-outline-light btn-lg w-100" onClick={() => goNext({ label: "LOADING…" })}>
            NEXT LEVEL &gt;
          </button>
        </div>
      </div>
    );
  };

  const isBoss = level === story.length;
  const isVictory = level > story.length;

  return (
    <div
      onClick={startAudio}
      onTouchStart={startAudio}
      style={{ position: "relative", minHeight: "100vh" }}
    >
      {/* BACKGROUND */}
      <PixelStarfield scale={4} />
      <div className="po-crt" aria-hidden="true" />
      <CursorSparkles enabled />

      {/* NO button trail */}
      <div className="po-no-trail" aria-hidden="true">
        {noTrail.map((p) => (
          <span
            key={p.id}
            className="po-no-petal"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.s}px`,
              height: `${p.s}px`,
              animationDelay: `${p.d}s`,
              "--dx": `${p.dx}px`,
            }}
          />
        ))}
      </div>

      {/* YES burst */}
      {burstKey > 0 && <PetalBurst key={burstKey} />}

      {/* Transition overlay */}
      <TransitionOverlay active={transitionOn} label={transitionLabel} />

      {/* CONTENT */}
      <div className="container">
        <div className="po-card" style={{ width: "min(680px, 92vw)" }}>
          {!isPlaying && <p className="text-muted small fixed-top mt-2 ms-2">(Tap for sound ♪)</p>}

          {/* BOOT */}
          {phase === "boot" && (
            <div className="po-boot text-center">
              <div className="po-boot-logo">
                <div className="po-boot-title">ODYSSEUS</div>
                <div className="po-boot-sub">VALENTINE QUEST</div>
              </div>

              <div className="po-boot-art">
                <Sprite src="/sprites/boot_heart.png" w={48} h={48} frames={6} dur={0.8} alt="heart" />
              </div>

              <button className="po-press-start" onClick={handlePressStart}>
                PRESS START
              </button>

              <div className="po-boot-hint">Tip: sound unlocks the full vibe ♪</div>
            </div>
          )}

          {/* GAME */}
          {phase === "game" && (
            <>
              {/* STORY */}
              {level < story.length && renderStorySlide()}

              {/* FINAL LEVEL */}
              {isBoss && (
                <div
                  className={`po-frame text-white p-4 mx-auto ${cutscene ? "po-zoom po-heartbeat" : ""}`}
                  style={{ maxWidth: "600px" }}
                >
                  {cutscene && <div className="po-light-sweep" />}

                  <div className="po-corner tl">
                    <span>✿</span>
                  </div>
                  <div className="po-corner tr">
                    <span>❀</span>
                  </div>
                  <div className="po-corner bl">
                    <span>❀</span>
                  </div>
                  <div className="po-corner br">
                    <span>✿</span>
                  </div>

                  <div className="card-body p-0 text-center">
                    <div className="po-name">LAUREN</div>

                    <div className="mb-3" aria-hidden="true">
                      <Sprite src="/sprites/flower_party.png" w={32} h={32} frames={8} dur={0.9} alt="flowers" />
                    </div>

                    <TypeText text="A rare Valentine encounter… My heart has chosen you." />
                    <TypeText text="Will you walk this quest of love with me?" speed={30} />

                    <div className="d-grid gap-3 mt-4 position-relative" style={{ minHeight: 56 }}>
                      <button className="btn po-btn po-btn-yes" onClick={handleYes}>
                        YES
                      </button>

                      {/* NO: evasive + petals */}
                      <button className="btn po-btn po-btn-no" style={noStyle} onMouseEnter={moveNoButton} onClick={handleNo}>
                        NO
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* VICTORY */}
              {isVictory && (
                <div className="success-screen text-center fade-in">
                  <h1 className="text-success display-1 mb-4" style={{ textShadow: "4px 4px #000" }}>
                    QUEST COMPLETE!
                  </h1>
                  <div className="pixel-heart mb-4 po-heartbeat" style={{ fontSize: "100px" }}>
                    ♥
                  </div>
                  <p className="lead text-white">See you on Feb 14th!</p>

                  <div className="mt-3">
                    <button
                      className="btn btn-outline-light"
                      onClick={() => {
                        setPhase("boot");
                        setLevel(0);
                        setNoStyle({});
                        setBurstKey(0);
                        setNoTrail([]);
                        setCutscene(false);
                      }}
                    >
                      RESTART
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}