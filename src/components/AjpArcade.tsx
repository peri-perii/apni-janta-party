import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, RotateCcw, Volume2, VolumeX, Shield, Award, Zap, Flame, Sparkles } from "lucide-react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  char: string;
  size: number;
  alpha: number;
  life: number;
}

interface Item {
  id: number;
  x: number;
  y: number;
  speed: number;
  type: "solution" | "excuse" | "powerup";
  label: string;
  symbol: string;
  color: string;
  size: number;
}

export const AjpArcade: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // States
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [level, setLevel] = useState(1);
  const [difficulty, setDifficulty] = useState<"normal" | "fast" | "brutal">("normal");
  const [activePowerUp, setActivePowerUp] = useState<string | null>(null);
  const [powerUpTimer, setPowerUpTimer] = useState(0);
  const [muted, setMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Audio context ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Game loop values and player properties
  const gameStateRef = useRef({
    playerX: 180,
    playerWidth: 70,
    playerHeight: 65,
    items: [] as Item[],
    particles: [] as Particle[],
    lastSpawnTime: 0,
    spawnInterval: 1000,
    score: 0,
    health: 100,
    level: 1,
    multiplier: 1,
    shieldActive: false,
    nextId: 1,
  });

  const keysRef = useRef<{ [key: string]: boolean }>({});

  // Achievements
  const [achievements, setAchievements] = useState<Array<{ title: string; desc: string; unlocked: boolean; color: string }>>([
    { title: "First Solulu", desc: "Successfully catch your first solution", unlocked: false, color: "#2563EB" },
    { title: "Bureaucracy Slayer", desc: "Reach 150 points", unlocked: false, color: "#FF5A36" },
    { title: "Solenoid Shield", desc: "Collect a shield power-up", unlocked: false, color: "#FFD600" },
    { title: "Absolute Leader", desc: "Reach Level 5 or score 500+", unlocked: false, color: "#10B981" },
  ]);

  // Audio synthesis helper
  const playSynthSound = (type: "catch" | "excuse" | "powerup" | "levelup" | "gameover" | "click") => {
    if (muted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === "catch") {
        // High upbeat 8bit chime
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.15); // C6
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.15);
        osc.start();
        osc.stop(now + 0.15);
      } else if (type === "excuse") {
        // Harsh buzzer crash
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(60, now + 0.3);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.3);
        osc.start();
        osc.stop(now + 0.3);
      } else if (type === "powerup") {
        // Celestial arpeggio
        osc.type = "triangle";
        osc.frequency.setValueAtTime(329.63, now); // E4
        osc.frequency.setValueAtTime(440, now + 0.08); // A4
        osc.frequency.setValueAtTime(554.37, now + 0.16); // C#5
        osc.frequency.setValueAtTime(659.25, now + 0.24); // E5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.35);
        osc.start();
        osc.stop(now + 0.35);
      } else if (type === "levelup") {
        // Upward triumphant scale
        osc.type = "square";
        osc.frequency.setValueAtTime(261.63, now); // C4
        osc.frequency.setValueAtTime(329.63, now + 0.1); // E4
        osc.frequency.setValueAtTime(392.00, now + 0.2); // G4
        osc.frequency.setValueAtTime(523.25, now + 0.3); // C5
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.45);
        osc.start();
        osc.stop(now + 0.45);
      } else if (type === "gameover") {
        // Melodramatic descending sliding buzz
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.7);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.7);
        osc.start();
        osc.stop(now + 0.7);
      } else if (type === "click") {
        // High click
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.05);
        osc.start();
        osc.stop(now + 0.05);
      }
    } catch (_) {}
  };

  // Sound toggler
  const toggleMute = () => {
    setMuted((prev) => {
      const next = !prev;
      localStorage.setItem("ajp_arcade_muted", String(next));
      return next;
    });
  };

  // Sync high score on mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem("ajp_arcade_highscore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
    const savedMuted = localStorage.getItem("ajp_arcade_muted");
    if (savedMuted) {
      setMuted(savedMuted === "true");
    }
  }, []);

  // Update achievements checklist
  const checkAchievements = (currentScore: number, lvl: number, gotShield: boolean) => {
    let changed = false;
    const updated = achievements.map((ach) => {
      if (ach.title === "First Solulu" && currentScore > 0 && !ach.unlocked) {
        changed = true;
        return { ...ach, unlocked: true };
      }
      if (ach.title === "Bureaucracy Slayer" && currentScore >= 150 && !ach.unlocked) {
        changed = true;
        return { ...ach, unlocked: true };
      }
      if (ach.title === "Solenoid Shield" && gotShield && !ach.unlocked) {
        changed = true;
        return { ...ach, unlocked: true };
      }
      if (ach.title === "Absolute Leader" && (lvl >= 5 || currentScore >= 500) && !ach.unlocked) {
        changed = true;
        return { ...ach, unlocked: true };
      }
      return ach;
    });

    if (changed) {
      setAchievements(updated);
    }
  };

  // Start / restart the game
  const startGame = () => {
    setHasInteracted(true);
    playSynthSound("click");
    
    // Reset state refs
    gameStateRef.current = {
      playerX: 180,
      playerWidth: 70,
      playerHeight: 65,
      items: [],
      particles: [],
      lastSpawnTime: Date.now(),
      spawnInterval: difficulty === "normal" ? 1100 : difficulty === "fast" ? 850 : 600,
      score: 0,
      health: 100,
      level: 1,
      multiplier: 1,
      shieldActive: false,
      nextId: 1,
    };

    setScore(0);
    setHealth(100);
    setLevel(1);
    setIsGameOver(false);
    setIsPlaying(true);
    setActivePowerUp(null);
    setPowerUpTimer(0);
  };

  // Custom key listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "Space", "KeyA", "KeyD"].includes(e.code)) {
        // Prevent window scrolling when active inside the game container
        if (isPlaying && !isGameOver) {
          e.preventDefault();
        }
      }
      keysRef.current[e.code] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isPlaying, isGameOver]);

  // Touch and mouse drags on canvas
  const handleInteraction = (clientX: number) => {
    if (!canvasRef.current || !isPlaying || isGameOver) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    
    // Bound the player location within canvas coordinates
    const boundedX = Math.max(
      0,
      Math.min(canvasRef.current.width - gameStateRef.current.playerWidth, relativeX - gameStateRef.current.playerWidth / 2)
    );
    gameStateRef.current.playerX = boundedX;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    handleInteraction(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length > 0) {
      handleInteraction(e.touches[0].clientX);
    }
  };

  // Spawn pool config
  const solutions = [
    { label: "💧 WATER", symbol: "💧", color: "#2563EB" },
    { label: "🔨 HAMMER", symbol: "🔨", color: "#FFD600" },
    { label: "💻 CODE", symbol: "💻", color: "#10B981" },
    { label: "📦 SOLULU", symbol: "📦", color: "#EC4899" },
    { label: "🏛️ SCHOOLS", symbol: "🏛️", color: "#8B5CF6" },
  ];

  const excuses = [
    { label: "⚠️ COMMITTEE", symbol: "⚠️", color: "#FF5A36" },
    { label: "🐌 DELAYS", symbol: "🐌", color: "#EF4444" },
    { label: "📅 NEXT WEEK", symbol: "📅", color: "#DC2626" },
    { label: "📋 RED TAPE", symbol: "📋", color: "#B91C1C" },
  ];

  // Game Engine Tick
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    let animFrame: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Responsive scaling
    canvas.width = 500;
    canvas.height = 420;

    const gameLoop = () => {
      const state = gameStateRef.current;

      // 1. Process Key Movements (Keyboard fallback)
      const speedParam = 6.5;
      if (keysRef.current["ArrowLeft"] || keysRef.current["KeyA"]) {
        state.playerX = Math.max(0, state.playerX - speedParam);
      }
      if (keysRef.current["ArrowRight"] || keysRef.current["KeyD"]) {
        state.playerX = Math.min(canvas.width - state.playerWidth, state.playerX + speedParam);
      }

      // 2. Add spawn logic
      const now = Date.now();
      if (now - state.lastSpawnTime > state.spawnInterval) {
        state.lastSpawnTime = now;

        // Determine what to spawn: solution, excuse, or powerup
        const roll = Math.random();
        let type: "solution" | "excuse" | "powerup" = "solution";
        let spawnData = solutions[Math.floor(Math.random() * solutions.length)];

        if (roll < 0.32) {
          type = "excuse";
          spawnData = excuses[Math.floor(Math.random() * excuses.length)];
        } else if (roll > 0.95) {
          type = "powerup";
          spawnData = { label: "⚡ SOLENOID SHIELD", symbol: "🛡️", color: "#FFD600" };
        }

        const size = type === "powerup" ? 34 : 28;
        const speed = (2.2 + state.level * 0.4) + (Math.random() * 1.5);

        state.items.push({
          id: state.nextId++,
          x: Math.random() * (canvas.width - 40) + 15,
          y: -40,
          speed: speed,
          type: type,
          label: spawnData.label,
          symbol: spawnData.symbol,
          color: spawnData.color,
          size: size,
        });
      }

      // 3. Update active power-ups
      if (state.shieldActive) {
        setPowerUpTimer((prev) => {
          if (prev <= 1) {
            state.shieldActive = false;
            setActivePowerUp(null);
            return 0;
          }
          return prev - 1;
        });
      }

      // 4. Draw Canvas and clear previous
      ctx.fillStyle = "#FFFFFF"; // Retro clean canvas background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines to feel like a structural blueprint
      ctx.strokeStyle = "rgba(17, 17, 17, 0.05)";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let j = 0; j < canvas.height; j += 30) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
      }

      // Draw safe line limit at bottom
      ctx.strokeStyle = "rgba(239, 68, 68, 0.15)";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 35);
      ctx.lineTo(canvas.width, canvas.height - 35);
      ctx.stroke();
      ctx.setLineDash([]);

      // 5. Update and Draw Items (Solutions / Excuses)
      state.items = state.items.filter((item) => {
        item.y += item.speed;

        // Draw item symbol
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.15)";
        ctx.shadowBlur = 4;
        ctx.font = `${item.size}px sans-serif`;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        
        // Neo-Brutalist shadow bubble under the symbols
        ctx.beginPath();
        ctx.arc(item.x, item.y, item.size / 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(17, 17, 17, 0.03)";
        ctx.fill();
        ctx.strokeStyle = "rgba(17,17,17,0.1)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillText(item.symbol, item.x, item.y);
        ctx.restore();

        // Check Bucket Collision inside player boundaries
        const playerY = canvas.height - 75;
        const xDist = Math.abs(item.x - (state.playerX + state.playerWidth / 2));
        const yDist = Math.abs(item.y - (playerY + state.playerHeight / 3));

        if (xDist < state.playerWidth / 1.5 && yDist < state.playerHeight / 1.3) {
          // Trigger Collision interaction
          if (item.type === "solution") {
            // Earn points
            const currentGain = 10 * state.multiplier;
            state.score += currentGain;
            setScore(state.score);

            // Pop sound
            playSynthSound("catch");

            // Particle burst
            for (let k = 0; k < 6; k++) {
              state.particles.push({
                x: item.x,
                y: item.y,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5 - 2,
                color: item.color,
                char: "💧",
                size: Math.random() * 8 + 6,
                alpha: 1,
                life: 1,
              });
            }

            // Check level up at every 100 points
            const calcLevel = Math.floor(state.score / 120) + 1;
            if (calcLevel > state.level) {
              state.level = calcLevel;
              setLevel(calcLevel);
              playSynthSound("levelup");
              state.spawnInterval = Math.max(350, state.spawnInterval - 120);

              // Triumphant burst particles
              for (let m = 0; m < 15; m++) {
                state.particles.push({
                  x: canvas.width / 2,
                  y: canvas.height / 2,
                  vx: (Math.random() - 0.5) * 10,
                  vy: (Math.random() - 0.5) * 10,
                  color: "#FFD600",
                  char: "✓",
                  size: Math.random() * 12 + 10,
                  alpha: 1,
                  life: 1.5,
                });
              }
            }
          } else if (item.type === "excuse") {
            if (state.shieldActive) {
              // Absorb excuse with no damage
              playSynthSound("catch");
              state.score += 5; // small deflection reward
              setScore(state.score);

              // Particle blast
              for (let k = 0; k < 6; k++) {
                state.particles.push({
                  x: item.x,
                  y: item.y,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6 - 2,
                  color: "#FFD600",
                  char: "🛡️",
                  size: 15,
                  alpha: 1,
                  life: 1,
                });
              }
            } else {
              // Suffer bureaucracy damage
              state.health = Math.max(0, state.health - 25);
              setHealth(state.health);
              playSynthSound("excuse");

              // Screen shake particle burst
              for (let k = 0; k < 8; k++) {
                state.particles.push({
                  x: item.x,
                  y: item.y,
                  vx: (Math.random() - 0.5) * 8,
                  vy: (Math.random() - 0.5) * 8,
                  color: "#FF5A36",
                  char: "❌",
                  size: 12,
                  alpha: 1,
                  life: 1,
                });
              }

              if (state.health <= 0) {
                // Game Over state triggered
                setIsGameOver(true);
                playSynthSound("gameover");
                
                // Persist new high score
                const currentHS = parseInt(localStorage.getItem("ajp_arcade_highscore") || "0", 10);
                if (state.score > currentHS) {
                  localStorage.setItem("ajp_arcade_highscore", String(state.score));
                  setHighScore(state.score);
                }
              }
            }
          } else if (item.type === "powerup") {
            // Activate shield
            state.shieldActive = true;
            setActivePowerUp("Solenoid Shield");
            setPowerUpTimer(260); // frame steps
            playSynthSound("powerup");
            checkAchievements(state.score, state.level, true);

            // Radiant particle shield
            for (let k = 0; k < 12; k++) {
              state.particles.push({
                x: state.playerX + state.playerWidth / 2,
                y: playerY + 10,
                vx: Math.cos(k) * 4,
                vy: Math.sin(k) * 4,
                color: "#111111",
                char: "⚡",
                size: 11,
                alpha: 1,
                life: 1.2,
              });
            }
          }

          checkAchievements(state.score, state.level, false);
          return false; // delete item
        }

        // Drop out of bottom threshold bounds
        if (item.y > canvas.height + 20) {
          // Missing a solutions gives minor penalty, excuses are ignored
          if (item.type === "solution" && state.health > 0) {
            state.health = Math.max(0, state.health - 4);
            setHealth(state.health);
            if (state.health <= 0) {
              setIsGameOver(true);
              playSynthSound("gameover");
            }
          }
          return false; // cleanup item
        }

        return true;
      });

      // 6. Draw Hero Mascot "Balti-Ji" at bottom
      const playerY = canvas.height - 75;
      ctx.save();

      // Shadow block
      ctx.fillStyle = "rgba(17, 17, 17, 0.4)";
      ctx.fillRect(state.playerX + 5, playerY + 5 + state.playerHeight - 15, state.playerWidth - 10, 8);

      // Hero Container with Solenoid Aura
      if (state.shieldActive) {
        ctx.save();
        ctx.strokeStyle = "#FFD600";
        ctx.lineWidth = 4;
        ctx.shadowColor = "#FFD600";
        ctx.shadowBlur = 12;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(state.playerX + state.playerWidth / 2, playerY + state.playerHeight / 2 - 5, state.playerWidth * 0.7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Draw physical styled bucket vector
      ctx.fillStyle = "#FFD600"; // Metallic theme Janta Yellow
      ctx.strokeStyle = "#111111"; // thick brutal stroke
      ctx.lineWidth = 4.5;

      // Draw Bucket Trapizoid Path
      ctx.beginPath();
      // top left corner
      ctx.moveTo(state.playerX + 8, playerY + 12);
      // top right corner
      ctx.lineTo(state.playerX + state.playerWidth - 8, playerY + 12);
      // bottom right corner
      ctx.lineTo(state.playerX + state.playerWidth - 18, playerY + state.playerHeight - 5);
      // bottom left corner
      ctx.lineTo(state.playerX + 18, playerY + state.playerHeight - 5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Draw high-contrast metallic rims
      ctx.beginPath();
      ctx.ellipse(state.playerX + state.playerWidth / 2, playerY + 12, state.playerWidth / 2 - 8, 5, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#111111";
      ctx.fill();
      ctx.stroke();

      // Simple adorable animated eyes looking front
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(state.playerX + state.playerWidth / 2 - 12, playerY + 32, 6, 0, Math.PI * 2);
      ctx.arc(state.playerX + state.playerWidth / 2 + 12, playerY + 32, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#111111";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Shiny Pupils
      ctx.fillStyle = "#111111";
      ctx.beginPath();
      ctx.arc(state.playerX + state.playerWidth / 2 - 12 + (keysRef.current["ArrowLeft"] ? -2 : keysRef.current["ArrowRight"] ? 2 : 0), playerY + 32, 3, 0, Math.PI * 2);
      ctx.arc(state.playerX + state.playerWidth / 2 + 12 + (keysRef.current["ArrowLeft"] ? -2 : keysRef.current["ArrowRight"] ? 2 : 0), playerY + 32, 3, 0, Math.PI * 2);
      ctx.fill();

      // Happy smile
      ctx.beginPath();
      ctx.arc(state.playerX + state.playerWidth / 2, playerY + 41, 5, 0, Math.PI);
      ctx.strokeStyle = "#111111";
      ctx.lineWidth = 3;
      ctx.stroke();

      // AJP movement text on side of bucket
      ctx.font = "black 9px monospace";
      ctx.fillStyle = "#111111";
      ctx.textAlign = "center";
      ctx.fillText("AJP SOLVER", state.playerX + state.playerWidth / 2, playerY + state.playerHeight - 14);

      ctx.restore();

      // 7. Update and Draw Particles
      state.particles = state.particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // minor gravity
        p.life -= 0.02;

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.font = `${p.size}px sans-serif`;
        ctx.fillText(p.char, p.x, p.y);
        ctx.restore();

        return p.life > 0;
      });

      // Loop frame
      if (isPlaying && !isGameOver) {
        animFrame = requestAnimationFrame(gameLoop);
      }
    };

    animFrame = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animFrame);
    };
  }, [isPlaying, isGameOver, difficulty]);

  return (
    <section id="arcade" className="py-24 px-4 bg-ajp-white border-b-6 border-black">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 border-3 border-black bg-ajp-orange text-white font-mono text-xs font-black uppercase tracking-widest mb-4 brutal-shadow-xs">
            <Flame className="w-4 h-4 fill-white" />
            <span>EXCUSES END HERE</span>
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-black uppercase tracking-tight leading-none mb-4">
            BALTI-JI'S BUILDER ARCADE
          </h2>
          <p className="max-w-xl mx-auto font-mono text-xs md:text-sm text-gray-600 font-bold uppercase leading-relaxed tracking-tight">
            Stop arguing, grab the legendary bucket. Catch actual solutions while crashing excuse committees in real-time.
          </p>
        </div>

        {/* Master Arcade Cabinet Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: Game Screen Compartment (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="border-6 border-black bg-black p-4 brutal-shadow-lg rounded-none relative flex-1 flex flex-col">
              
              {/* Retro cabinet marquee neon glowing bar */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b-4 border-[#FFD600] text-[#FFD600]">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 bg-red-600 rounded-full animate-ping shrink-0" />
                  <span className="font-display font-black text-lg md:text-xl tracking-wider uppercase">
                    AJP-SYSTEMS COMPATIBLE
                  </span>
                </div>
                <button
                  onClick={toggleMute}
                  className="p-1 px-2 border-2 border-[#FFD600] font-mono text-[10px] items-center gap-1.5 uppercase flex bg-black hover:bg-[#FFD600] hover:text-black transition-colors"
                >
                  {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{muted ? "MUTED" : "SOUND ON"}</span>
                </button>
              </div>

              {/* Central Canvas Screen Wrapper */}
              <div className="relative flex-1 bg-white border-4 border-black overflow-hidden flex items-center justify-center min-h-[360px] md:min-h-[420px]">
                
                {/* Intro Screen */}
                <AnimatePresence>
                  {!isPlaying && (
                    <motion.div
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-[#FFD600] z-20 p-6 flex flex-col justify-between"
                    >
                      <div className="text-center pt-6">
                        <div className="flex justify-center mb-4">
                          <div className="w-16 h-16 bg-black text-white flex items-center justify-center font-display font-black text-3xl border-3 border-white rounded-none shadow-[3px_3px_0px_#111111]">
                            BJ
                          </div>
                        </div>
                        <h3 className="font-display font-black text-2.5xl md:text-3.5xl text-black leading-none uppercase mb-2">
                          BALTI-JI'S SOLID SOLULU
                        </h3>
                        <p className="font-mono text-xs text-black/80 max-w-sm mx-auto font-bold uppercase tracking-tight">
                          Move with <span className="underline bg-black text-[#FFD600] px-1 font-black">← / →</span> keys or drag your mouse/finger to steer Balti-Ji left or right!
                        </p>
                      </div>

                      {/* Difficulty Select */}
                      <div className="my-4 bg-white/75 border-3 border-black p-4 text-center">
                        <span className="block font-display font-black text-[11px] text-black uppercase mb-3 tracking-wider">
                          SELECT SPRINT CADENCE:
                        </span>
                        <div className="flex gap-2 justify-center">
                          {(["normal", "fast", "brutal"] as const).map((diff) => (
                            <button
                              key={diff}
                              onClick={() => {
                                playSynthSound("click");
                                setDifficulty(diff);
                              }}
                              className={`px-3 py-1.5 border-2 border-black font-mono text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer ${
                                difficulty === diff
                                  ? "bg-black text-[#FFD600] scale-105 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                                  : "bg-white text-black hover:bg-black/10"
                              }`}
                            >
                              {diff === "normal" ? "🚜 Warmup" : diff === "fast" ? "🔥 Hyper" : "⚡ Brutal"}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <button
                          onClick={startGame}
                          className="w-full bg-[#FF5A36] text-white border-4 border-black font-display font-black text-lg p-3.5 uppercase brutal-shadow tracking-widest hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#000000] cursor-pointer transition-all active:translate-x-[2px] active:translate-y-[2px]"
                        >
                          INSERT COIN &amp; PLAY 🕹️
                        </button>
                        <span className="block text-center font-mono text-[9px] text-black/60 font-bold uppercase tracking-tight mt-3">
                          *Real-time local high score synced automatically*
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Game Over Screen */}
                <AnimatePresence>
                  {isGameOver && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 bg-[#FF5A36] text-white z-20 p-6 flex flex-col justify-between"
                    >
                      <div className="text-center pt-8">
                        <span className="inline-block bg-black text-white px-3 py-1 font-mono text-xs font-black uppercase mb-4 tracking-widest animate-bounce">
                          💥 GAME OVER 💥
                        </span>
                        <h3 className="font-display font-black text-4xl text-black leading-none uppercase mb-2 tracking-tight">
                          CRUSHED BY BUREAUS!
                        </h3>
                        <p className="font-mono text-xs text-white max-w-sm mx-auto font-bold uppercase tracking-wide leading-relaxed">
                          Your bucket overflowed with excuse committee meetings! The system slowed down. Go back for another clean sweep!
                        </p>
                      </div>

                      <div className="my-6 bg-white/10 border-2 border-dashed border-white p-6 max-w-md mx-auto w-full flex items-center justify-around">
                        <div className="text-center">
                          <span className="block font-mono text-[10px] text-white/80 font-black">YOUR SCORE</span>
                          <span className="font-display font-black text-3xl md:text-4xl text-white">{score}</span>
                        </div>
                        <div className="w-0.5 h-12 bg-white/20" />
                        <div className="text-center">
                          <span className="block font-mono text-[10px] text-white/80 font-black">DIFFICULTY</span>
                          <span className="font-display font-black text-lg text-[#FFD600] uppercase tracking-wider">
                            {difficulty === "normal" ? "Warmup" : difficulty === "fast" ? "Hyper" : "Brutal"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <button
                          onClick={startGame}
                          className="w-full bg-[#FFD600] text-black border-4 border-black font-display font-black text-lg p-3.5 uppercase brutal-shadow tracking-widest hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#000000] cursor-pointer transition-all active:translate-x-[2px] active:translate-y-[2px]"
                        >
                          PLAY AGAIN <RotateCcw className="w-5 h-5 inline-block ml-1" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actual rendering canvas */}
                <canvas
                  ref={canvasRef}
                  onMouseMove={handleMouseMove}
                  onTouchMove={handleTouchMove}
                  className="w-full h-full block cursor-crosshair touch-none"
                />
              </div>

              {/* Real-time Game HUD Panel */}
              <div className="mt-4 bg-[#FFD600] border-4 border-black p-3.5 grid grid-cols-3 gap-2.5">
                <div>
                  <span className="block font-mono text-[9px] text-black font-extrabold uppercase">LEVEL SPRINT</span>
                  <span className="font-display font-black text-xl md:text-2xl text-black">
                    L-{level}
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-[9px] text-black font-extrabold uppercase">HEALTH INDEX</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex-1 h-3.5 border-2 border-black bg-white overflow-hidden relative">
                      <div
                        className="h-full bg-[#FF5A36] transition-all duration-150"
                        style={{ width: `${health}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs font-black text-black">{health}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-mono text-[9px] text-black font-extrabold uppercase">TOTAL SCORE</span>
                  <span className="font-display font-black text-xl md:text-2xl text-black">
                    {score}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT: Game Stats & High Scores, Legend (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Retro branding High Score Card */}
              <div className="border-4 border-black bg-white p-6 brutal-shadow rounded-none bg-ajp-white">
                <div className="flex items-center justify-between pb-2.5 border-b-2 border-black mb-4">
                  <span className="font-display font-black text-lg text-black uppercase">
                    🏆 MOVEMENT LEADERBOARD
                  </span>
                  <Award className="w-5 h-5 text-ajp-blue" />
                </div>
                <div className="space-y-2 font-mono text-xs font-bold text-black uppercase">
                  <div className="flex justify-between p-2 bg-ajp-yellow border-2 border-black">
                    <span>🥇 PERSONAL HIGH SCORE:</span>
                    <span>{highScore} PTS</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 border-2 border-black/10 text-gray-500">
                    <span>🥈 Divyanshi (Founder):</span>
                    <span>720 PTS</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 border-2 border-black/10 text-gray-500">
                    <span>🥉 Priyam (Co-Founder):</span>
                    <span>650 PTS</span>
                  </div>
                </div>
              </div>

              {/* Game Legend Details */}
              <div className="border-4 border-black bg-white p-6 brutal-shadow rounded-none bg-ajp-white">
                <div className="pb-2.5 border-b-2 border-black mb-4">
                  <span className="font-display font-black text-lg text-black uppercase">
                    🎮 LEGEND &amp; RULES
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block font-mono text-[10px] font-black text-black uppercase mb-1.5">
                      CATCH SOLUTIONS (+10)
                    </span>
                    <ul className="space-y-1 text-[11px] font-bold text-gray-600 font-mono list-none">
                      <li>💧 Water Drops</li>
                      <li>🔨 Hammer of Grit</li>
                      <li>💻 Execution Code</li>
                      <li>📦 Solid Action blocks</li>
                    </ul>
                  </div>
                  <div>
                    <span className="block font-mono text-[10px] font-black text-red-600 uppercase mb-1.5">
                      DODGE EXCUSES (-25 HP)
                    </span>
                    <ul className="space-y-1 text-[11px] font-bold text-gray-600 font-mono list-none">
                      <li>⚠️ Commission Form</li>
                      <li>🐌 Bureaucracy Snail</li>
                      <li>📅 Next-Week meeting</li>
                      <li>📋 Double Red Tape</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-black/10 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-ajp-yellow flex items-center justify-center font-bold text-lg border border-black animate-pulse">
                    🛡️
                  </div>
                  <div>
                    <span className="block font-mono text-[10px] font-black text-black uppercase">
                      ⚡ POWER-UP ACTIVE
                    </span>
                    <p className="font-mono text-[10px] text-gray-500 font-bold uppercase">
                      Get shield to deflect all Excuses automatically!
                    </p>
                  </div>
                </div>
              </div>

              {/* Achievement Checklist */}
              <div className="border-4 border-black bg-white p-6 brutal-shadow rounded-none bg-ajp-white">
                <div className="pb-2.5 border-b-2 border-black mb-3.5">
                  <span className="font-display font-black text-lg text-black uppercase">
                    ⭐ SPRINT MILESTONES
                  </span>
                </div>
                <div className="space-y-2 flex flex-col">
                  {achievements.map((ach) => (
                    <div
                      key={ach.title}
                      className={`p-2 border-2 text-[11px] font-mono font-bold uppercase transition-all duration-350 flex items-center justify-between ${
                        ach.unlocked
                          ? "bg-green-150 border-green-500 text-green-800"
                          : "bg-white/40 border-black/10 text-gray-400"
                      }`}
                    >
                      <div>
                        <span className="block font-bold">{ach.title}</span>
                        <span className="text-[9px] text-gray-500 lowercase font-medium">{ach.desc}</span>
                      </div>
                      <span>{ach.unlocked ? "✓ COMPLETED" : "○ LOCKED"}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Micro attribution */}
            <div className="mt-6 p-3 bg-ajp-yellow/30 border-2 border-dashed border-black font-mono text-[10px] text-black font-bold uppercase text-center leading-relaxed">
              💻 BUILD THE ACTION. SPURN THE TALK. CATASTROPHE TURNS TO CHILLED ADVENTURE WITH SOUND INTEGRITY.
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
