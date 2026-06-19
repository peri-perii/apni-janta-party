import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Play, Shield, Droplet } from "lucide-react";

interface HeroProps {
  onJoinClick: () => void;
  onManifestoClick: () => void;
}

interface MiniFire {
  id: number;
  x: number;
  y: number;
  extinguished: boolean;
  scale: number;
}

export const Hero: React.FC<HeroProps> = ({ onJoinClick, onManifestoClick }) => {
  const [fires, setFires] = useState<MiniFire[]>([]);
  const [score, setScore] = useState(0);
  const [steamBubbles, setSteamBubbles] = useState<{ id: number; x: number; y: number }[]>([]);

  // Spawn initial mini fires around the hero canvas
  useEffect(() => {
    const initialFires: MiniFire[] = [
      { id: 1, x: 12, y: 35, extinguished: false, scale: 1 },
      { id: 2, x: 88, y: 20, extinguished: false, scale: 1.2 },
      { id: 3, x: 82, y: 72, extinguished: false, scale: 0.9 },
      { id: 4, x: 8, y: 75, extinguished: false, scale: 1.1 },
    ];
    setFires(initialFires);
  }, []);

  const triggerSound = (freq: number) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (_) {}
  };

  const handleExtinguishFire = (id: number, x: number, y: number) => {
    triggerSound(800);
    
    setFires((prev) =>
      prev.map((f) => (f.id === id ? { ...f, extinguished: true } : f))
    );

    setScore((prev) => prev + 1);

    // Spawn steam
    const steamId = Date.now();
    setSteamBubbles((prev) => [...prev, { id: steamId, x, y }]);

    setTimeout(() => {
      setSteamBubbles((prev) => prev.filter((b) => b.id !== steamId));
    }, 1200);

    // Re-spawn fire somewhere else after 6 seconds to keep page lively
    setTimeout(() => {
      setFires((prev) =>
        prev.map((f) => {
          if (f.id === id) {
            return {
              ...f,
              x: Math.floor(5 + Math.random() * 90),
              y: Math.floor(15 + Math.random() * 70),
              extinguished: false,
              scale: 0.8 + Math.random() * 0.5,
            };
          }
          return f;
        })
      );
    }, 6000);
  };

  return (
    <section className="relative min-h-screen bg-ajp-yellow pt-32 pb-24 px-4 overflow-hidden border-b-6 border-black">
      
      {/* Background Grid Pattern to emphasize brutal design */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none" 
        style={{
          backgroundImage: "radial-gradient(#111111 2px, transparent 2px)",
          backgroundSize: "24px 24px"
        }}
      />

      {/* Interactive fire game instructions sticker */}
      <div className="absolute top-28 left-6 hidden xl:block z-10">
        <motion.div
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="bg-white border-3 border-black p-3 shadow-[4px_4px_0px_#111111] max-w-[190px] font-mono rounded-none"
        >
          <div className="flex items-center gap-1 mb-1 text-red-500 font-bold text-xs uppercase">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
            <span>Active Bug Fires!</span>
          </div>
          <p className="text-[10px] text-gray-700 leading-tight">
            Click any active fire on this screen to grab your bucket and extinguish it instantly!
          </p>
          <div className="mt-1.5 border-t border-black pt-1 flex justify-between items-center text-[11px] font-black">
            <span>DOUSED:</span>
            <span className="bg-ajp-blue text-white px-1 border border-black font-sans">{score}</span>
          </div>
        </motion.div>
      </div>

      {/* Dynamic Mini Fires floating around with click handlers */}
      {fires.map(
        (f) =>
          !f.extinguished && (
            <motion.div
              key={f.id}
              style={{ left: `${f.x}%`, top: `${f.y}%` }}
              className="absolute z-20 cursor-pointer pointer-events-auto"
              animate={{
                y: [0, -4, 0],
                scale: [f.scale, f.scale * 1.08, f.scale],
              }}
              transition={{
                duration: 1.5 + f.id * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              onClick={() => handleExtinguishFire(f.id, f.x, f.y)}
              whileHover={{ scale: f.scale * 1.2 }}
            >
              <div className="bg-black text-white p-1 pb-1.5 rounded-none font-bold text-[10px] absolute -top-8 left-1/2 transform -translate-x-1/2 border border-white whitespace-nowrap uppercase leading-none shadow-xs">
                🔥 EXExcuse!
              </div>
              
              {/* Flame Icon */}
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                className="drop-shadow-[2px_2px_0px_rgba(17,17,17,1)] filter brightness-110"
              >
                <path
                  d="M24 4C34 16 44 22 44 34C44 42 38 46 24 46C10 46 4 42 4 34C4 22 14 16 24 4Z"
                  fill="#FF5A36"
                  stroke="#111111"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M24 16C28 24 34 28 34 36C34 40 30 42 24 42C18 42 14 40 14 36C14 28 20 24 24 16Z"
                  fill="#FFD600"
                  stroke="#111111"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          )
      )}

      {/* Steam Bubble rendering context */}
      <AnimatePresence>
        {steamBubbles.map((b) => (
          <div
            key={b.id}
            style={{ left: `${b.x}%`, top: `${b.y}%` }}
            className="absolute z-30 pointer-events-none"
          >
            {/* Custom rising steam cloud */}
            <span className="bg-white text-black text-[10px] font-mono border-2 border-black p-1 px-1.5 font-bold animate-steam inline-block rounded-none shadow-xs">
              💨 Shhh... FIXED!
            </span>
          </div>
        ))}
      </AnimatePresence>

      {/* Front-and-center Main Hero Interface Container */}
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center relative z-10 pt-8 xl:pt-12">
        
        {/* Live Top badge sticker */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [-1, 1, -1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="bg-ajp-orange text-white brutal-border border-4 p-2 px-5 font-mono font-black text-sm uppercase mb-8 tracking-wider shadow-[4px_4px_0px_#111111] rounded-none inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 fill-white" />
          <span>AWAAZ HAR JANTA KI</span>
        </motion.div>

        {/* Massive Outlined Headline */}
        <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl xl:text-9xl text-white uppercase leading-none tracking-tighter mb-8 drop-shadow-[5px_5px_0px_rgba(17,17,17,1)] max-w-5xl select-none select-all relative">
          WE PICK UP <br className="hidden sm:inline" />
          <span className="text-ajp-black bg-white brutal-border border-4 md:border-[6px] px-4 md:px-8 inline-block transform saturate-150 rotate-[-1.5deg] shadow-[8px_8px_0px_rgba(17,17,17,1)] relative z-10">
            THE BUCKET.
          </span>
        </h1>

        {/* Elegant clean subheadline */}
        <p className="font-sans font-semibold text-lg sm:text-xl md:text-2xl text-black max-w-2xl leading-snug mb-10 select-none bg-white/75 p-3 brutal-border-lg border-2 brutal-shadow rounded-none">
          While others argue about who started the fire, <br className="hidden md:inline" />
          we believe in packing up the bucket and putting it out.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full max-w-md px-4 mb-16">
          
          <button
            onClick={onJoinClick}
            className="w-full sm:w-auto bg-ajp-black text-white font-display font-black text-base uppercase brutal-border-lg border-4 p-4 px-8 hover:bg-zinc-900 brutal-press cursor-pointer text-center rounded-none shadow-[6px_6px_0px_#FF5A36]"
          >
            JOIN THE MOVEMENT
          </button>

          <button
            onClick={onManifestoClick}
            className="w-full sm:w-auto bg-white text-black font-display font-black text-base uppercase brutal-border-lg border-4 p-4 px-8 hover:bg-gray-100 brutal-press cursor-pointer text-center rounded-none shadow-[6px_6px_0px_#111111]"
          >
            READ THE MANIFESTO
          </button>
        </div>

        {/* Drag stickers: Action stickers demonstrating Neo-Brutalism */}
        <div className="flex flex-wrap items-center justify-center gap-4 max-w-3xl mt-4">
          <motion.div
            drag
            dragConstraints={{ left: -150, right: 150, top: -100, bottom: 200 }}
            className="bg-white border-3 border-black p-3 px-6 shadow-[5px_5px_0px_#111111] rounded-none rotate-[-4deg] cursor-grab active:cursor-grabbing text-ajp-black transform-gpu"
          >
            <span className="font-display font-extrabold text-sm uppercase tracking-wider block">
              🚀 ACTION &gt; EXCUSES
            </span>
          </motion.div>

          <motion.div
            drag
            dragConstraints={{ left: -150, right: 150, top: -100, bottom: 200 }}
            className="bg-ajp-blue text-white border-3 border-black p-3 px-6 shadow-[5px_5px_0px_#111111] rounded-none rotate-[3deg] cursor-grab active:cursor-grabbing transform-gpu"
          >
            <span className="font-display font-extrabold text-sm uppercase tracking-wider block">
              🛠️ BUILD &gt; COMPLAIN
            </span>
          </motion.div>

          <motion.div
            drag
            dragConstraints={{ left: -150, right: 150, top: -100, bottom: 200 }}
            className="bg-ajp-orange text-white border-3 border-black p-3 px-6 shadow-[5px_5px_0px_#111111] rounded-none rotate-[-2deg] cursor-grab active:cursor-grabbing transform-gpu"
          >
            <span className="font-display font-extrabold text-sm uppercase tracking-wider block">
              ⚡ SOLVE &gt; BLAME
            </span>
          </motion.div>

          <motion.div
            drag
            dragConstraints={{ left: -150, right: 150, top: -100, bottom: 200 }}
            className="bg-white border-3 border-black p-3 px-6 shadow-[5px_5px_0px_#111111] rounded-none rotate-[5deg] cursor-grab active:cursor-grabbing text-brand-black transform-gpu hidden md:block"
          >
            <span className="font-mono font-bold text-xs uppercase tracking-tight block text-red-500">
              🔥 WE SOLVE PROBLEMS
            </span>
          </motion.div>
        </div>

      </div>

      {/* Marquee Banner Ribbon at bottom edge of Hero Section */}
      <div className="absolute bottom-0 left-0 w-full bg-ajp-black border-t-4 border-black p-3 overflow-hidden text-white select-none">
        <div className="brutal-marquee-row flex items-center gap-10 whitespace-nowrap text-sm font-mono font-bold tracking-widest uppercase">
          {Array.from({ length: 4 }).map((_, rIdx) => (
            <React.Fragment key={rIdx}>
              <span className="text-ajp-yellow font-black font-display text-base">Awaaz Har Janta Ki!</span>
              <span>•</span>
              <span>Bucket Uthao. Problem Bujhao.</span>
              <span>•</span>
              <span className="text-ajp-orange">People First. Excuses Last.</span>
              <span>•</span>
              <span>Built By Us. Built For Us.</span>
              <span>•</span>
            </React.Fragment>
          ))}
        </div>
      </div>

    </section>
  );
};
