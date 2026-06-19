import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Droplet, Info, MessageSquare, Zap, Play } from "lucide-react";

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  text: "✓" | "💧" | "AJP" | "H2O";
}

export const MascotWidget: React.FC = () => {
  const [talking, setTalking] = useState(false);
  const [currentSpeech, setCurrentSpeech] = useState("");
  const [particles, setParticles] = useState<Particle[]>([]);
  const [waterMeters, setWaterMeters] = useState(100);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });

  const speeches = [
    "Arguing about who started the fire? Yawn! Bucket Uthao, Problem Bujhao!",
    "Ask why! Question things! Why did Kolaveri Di?",
    "Delulu is indeed the only solulu! Think bigger!",
    "Need more action, less talking! Complain less, build more!",
    "Grab the bucket and pour some water over these burning bugs!",
    "Awaaz Har Janta Ki! We build for us, by us!",
    "Excuses belong in committees. Solutions belong on the street!",
    "Psst... Click me to spray premium checkmark water!",
  ];

  // Random speeches
  useEffect(() => {
    const speakRandomly = () => {
      const idx = Math.floor(Math.random() * speeches.length);
      setCurrentSpeech(speeches[idx]);
      setTalking(true);
      // Wait 5 seconds then hide speech
      setTimeout(() => {
        setTalking(false);
      }, 5500);
    };

    // Speak initial welcome after 3 seconds
    const firstTimer = setTimeout(() => {
      setCurrentSpeech("Awaaz Har Janta Ki! I am Balti-Ji, your solution advisor! Hover around!");
      setTalking(true);
      setTimeout(() => setTalking(false), 5000);
    }, 2000);

    const interval = setInterval(speakRandomly, 16000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, []);

  // Track cursor for eyes
  useEffect(() => {
    const handleMousemove = (e: MouseEvent) => {
      const balti = document.getElementById("balti-msc");
      if (balti) {
        const rect = balti.getBoundingClientRect();
        const baltiX = rect.left + rect.width / 2;
        const baltiY = rect.top + rect.height / 2;
        
        const angle = Math.atan2(e.clientY - baltiY, e.clientX - baltiX);
        const distance = Math.min(4, Math.hypot(e.clientX - baltiX, e.clientY - baltiY) / 100);
        
        setEyeOffset({
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
        });
      }
    };
    window.addEventListener("mousemove", handleMousemove);
    return () => window.removeEventListener("mousemove", handleMousemove);
  }, []);

  const triggerSound = (frequency: number, type: OscillatorType = "sine") => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      if (type === "triangle") {
        osc.frequency.exponentialRampToValueAtTime(frequency * 2, audioCtx.currentTime + 0.15);
      }
      
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch (e) {
      // Ignored if browser blocks audio autoplay initially
    }
  };

  const handleMascotClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Speak on click if not speaking
    if (!talking) {
      const idx = Math.floor(Math.random() * speeches.length);
      setCurrentSpeech(speeches[idx]);
      setTalking(true);
      setTimeout(() => setTalking(false), 4000);
    }

    // Play bubble spray sound
    triggerSound(600, "triangle");

    // Add splashes
    const newParticles: Particle[] = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      x: e.clientX,
      y: e.clientY - 20,
      rotation: Math.random() * 360,
      scale: 0.8 + Math.random() * 0.8,
      text: (["✓", "💧", "AJP", "H2O"][Math.floor(Math.random() * 4)]) as any,
    }));

    setParticles((prev) => [...prev, ...newParticles]);
    setWaterMeters((prev) => Math.max(20, prev - 5));

    // Clear particle after animation ends
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
    }, 1500);
  };

  const handleRefill = () => {
    triggerSound(300, "sine");
    setWaterMeters(100);
    setCurrentSpeech("Aah! Refilled with fresh premium solution water! Checkmarks are ready!");
    setTalking(true);
    setTimeout(() => setTalking(false), 3000);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none select-none">
        
        {/* Particle Overlay (Rendered at top-level floating context) */}
        <div className="fixed inset-0 pointer-events-none z-50">
          <AnimatePresence>
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{
                  x: p.x,
                  y: p.y,
                  scale: 0,
                  opacity: 1,
                  rotate: p.rotation,
                }}
                animate={{
                  x: p.x + (Math.random() * 260 - 130),
                  y: p.y - (100 + Math.random() * 200),
                  scale: p.scale,
                  opacity: [1, 0.9, 0],
                  rotate: p.rotation + (Math.random() * 180 - 90),
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute font-display font-black text-xs pointer-events-none"
                style={{
                  color: p.text === "✓" ? "#2563EB" : p.text === "💧" ? "#2563EB" : "#FF5A36",
                  textShadow: "1px 1px 0px #111111",
                }}
              >
                <span className="bg-white border border-black p-1 leading-none shadow-xs text-xs">
                  {p.text}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Mascot Speech Bubble */}
        <AnimatePresence>
          {talking && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              className="mb-3 max-w-[240px] bg-white border-3 border-black p-3 shadow-[4px_4px_0px_#111111] relative pointer-events-auto rounded-none"
            >
              <div className="absolute right-6 -bottom-3.5 w-0 h-0 border-t-[14px] border-t-black border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent" />
              <div className="absolute right-[25px] -bottom-[10px] w-0 h-0 border-t-[10px] border-t-white border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent" />
              <p className="font-mono text-[11px] font-bold text-black leading-snug">
                {currentSpeech}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mascot Main Figure & Meters */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Action Tools Panel reveals when hovering mascot */}
          <div className="bg-white border-2 border-black p-1.5 shadow-[3px_3px_0px_#111111] flex flex-col gap-1.5 rounded-none md:opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity bg-ajp-white shrink-0">
            <span className="font-mono text-[9px] font-bold uppercase text-center border-b border-black pb-0.5 px-1 bg-yellow-100 text-black">
              H2O: {waterMeters}%
            </span>
            {waterMeters < 50 && (
              <button
                onClick={handleRefill}
                className="bg-ajp-blue text-white font-mono text-[8.5px] font-black uppercase p-1 hover:bg-blue-700 active:translate-y-0.5 shadow-xs border border-black cursor-pointer"
              >
                REFILL
              </button>
            )}
          </div>

          <div
            id="balti-msc"
            onClick={handleMascotClick}
            className="w-16 h-16 md:w-20 md:h-20 bg-ajp-yellow hover:bg-yellow-400 brutal-border border-3 rounded-none flex flex-col items-center justify-center brutal-shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95 group relative overflow-visible"
          >
            {/* Liquid contents sloshing inside bucket */}
            <div
              className="absolute left-0 bottom-0 w-full bg-ajp-blue border-t-2 border-black transition-all duration-300"
              style={{ height: `${(waterMeters / 100) * 80}%` }}
            />

            {/* Balti-Ji Face details (drawn as responsive elements above the water) */}
            <div className="absolute inset-0 flex flex-col justify-center items-center p-1 z-10 select-none">
              
              {/* Handles */}
              <div className="w-14 h-6 border-t-3 border-black border-r-3 border-l-3 rounded-t-full absolute -top-4 left-2.5 pointer-events-none" />

              {/* Eyes context tracking coordinate offset */}
              <div className="flex gap-2.5 mb-1 bg-white p-1 rounded-full border border-black transform translate-y-1">
                {/* Left eye */}
                <div className="w-3.5 h-3.5 bg-white rounded-full border border-black relative flex items-center justify-center">
                  <div
                    className="w-2.5 h-2.5 bg-black rounded-full"
                    style={{
                      transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                    }}
                  />
                  {/* Wink/Blink white reflection */}
                  <div className="w-0.5 h-0.5 bg-white rounded-full absolute top-0.5 left-0.5" />
                </div>
                {/* Right eye */}
                <div className="w-3.5 h-3.5 bg-white rounded-full border border-black relative flex items-center justify-center">
                  <div
                    className="w-2.5 h-2.5 bg-black rounded-full"
                    style={{
                      transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                    }}
                  />
                  <div className="w-0.5 h-0.5 bg-white rounded-full absolute top-0.5 left-0.5" />
                </div>
              </div>

              {/* Action Smirk */}
              <div className="transform translate-y-1.5">
                <svg width="20" height="8" viewBox="0 0 20 8" fill="none">
                  <path
                    d="M2 2 C 5 7, 15 7, 18 2"
                    stroke="#111111"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Cute Cheek Blush */}
              <div className="flex justify-between w-10 px-1 transform translate-y-[-4px]">
                <div className="w-2 h-1 bg-red-400 rounded-full opacity-60" />
                <div className="w-2 h-1 bg-red-400 rounded-full opacity-60" />
              </div>

            </div>

            {/* Floating Sticker label */}
            <span className="absolute -top-2.5 -left-3 bg-ajp-orange text-white font-mono text-[9px] font-black uppercase p-0.5 px-1 border-2 border-black rotate-[-6deg] drop-shadow-xs leading-none">
              BALTI JÍ
            </span>

          </div>
        </div>

      </div>
    </>
  );
};
