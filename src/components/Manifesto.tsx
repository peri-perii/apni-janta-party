import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { HelpCircle, Smile, Sparkles, Zap, Flame, ShieldCheck } from "lucide-react";

interface Endorsements {
  kolaveri: number;
  chinta: number;
  delulu: number;
  johoga: number;
}

export const Manifesto: React.FC = () => {
  const [endorse, setEndorse] = useState<Endorsements>({
    kolaveri: 842,
    chinta: 931,
    delulu: 1205,
    johoga: 1540
  });

  const [endorsedKeys, setEndorsedKeys] = useState<string[]>([]);

  useEffect(() => {
    // Load local storage endorsements
    const savedEndorsements = localStorage.getItem("ajp_endorsements");
    const savedKeys = localStorage.getItem("ajp_endorsed_keys");
    if (savedEndorsements) {
      try { setEndorse(JSON.parse(savedEndorsements)); } catch (_) {}
    }
    if (savedKeys) {
      try { setEndorsedKeys(JSON.parse(savedKeys)); } catch (_) {}
    }
  }, []);

  const handleEndorse = (key: keyof Endorsements) => {
    if (endorsedKeys.includes(key)) {
      // Toggle off / reduce count
      const updatedKeys = endorsedKeys.filter(k => k !== key);
      const updatedEndorsements = { ...endorse, [key]: endorse[key] - 1 };
      setEndorse(updatedEndorsements);
      setEndorsedKeys(updatedKeys);
      localStorage.setItem("ajp_endorsements", JSON.stringify(updatedEndorsements));
      localStorage.setItem("ajp_endorsed_keys", JSON.stringify(updatedKeys));
      return;
    }

    // Endorse action
    const updatedKeys = [...endorsedKeys, key];
    const updatedEndorsements = { ...endorse, [key]: endorse[key] + 1 };
    setEndorse(updatedEndorsements);
    setEndorsedKeys(updatedKeys);
    localStorage.setItem("ajp_endorsements", JSON.stringify(updatedEndorsements));
    localStorage.setItem("ajp_endorsed_keys", JSON.stringify(updatedKeys));

    // Synthesize happy endorse sound
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(400, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch (_) {}
  };

  const cards = [
    {
      key: "kolaveri" as const,
      policy: "WHY THIS KOLAVERI DI POLICY",
      icon: HelpCircle,
      themeColor: "bg-ajp-blue text-white",
      borderColor: "border-black",
      shadowColor: "shadow-[8px_8px_0px_#FFD600]",
      bulletStyle: "bg-white text-black border-black",
      accentDot: "#FFD600",
      description: "Question outdated systems. Demand raw transparency. Ask why five times. Challenge ancestral administrative assumptions.",
      slogan: "Why complicate what can be made simple?",
      badge: "TRANSPARENCY CRUSADE",
      graphic: (
        <svg viewBox="0 0 100 80" className="w-full h-24 stroke-white stroke-[3] fill-none stroke-linecap-round filter drop-shadow-[2px_2px_0px_#111111]">
          {/* Magnifying glass analyzing a maze */}
          <rect x="10" y="10" width="80" height="60" rx="4" fill="#111111" stroke="white" strokeWidth="3" />
          <path d="M 20 40 L 40 40 M 30 25 L 30 55 M 30 40 L 55 40" stroke="white" strokeWidth="2" />
          <circle cx="55" cy="35" r="14" fill="#2563EB" stroke="white" strokeWidth="3" />
          <line x1="65" y1="45" x2="80" y2="60" stroke="white" strokeWidth="4" />
          <text x="35" y="27" fill="#FFD600" fontSize="14" fontWeight="bold" fontFamily="monospace" stroke="none">?</text>
        </svg>
      )
    },
    {
      key: "chinta" as const,
      policy: "CHINTA TA CHITA CHITA SCHEME",
      icon: Smile,
      themeColor: "bg-ajp-orange text-white",
      borderColor: "border-black",
      shadowColor: "shadow-[8px_8px_0px_#111111]",
      bulletStyle: "bg-ajp-yellow text-black border-black",
      accentDot: "#FFFFFF",
      description: "Drastically reduce mental weight. Promote local creative well-being. Support individuals and tiny startups before they experience burnout.",
      slogan: "People are not machine cogs.",
      badge: "HEALTH & WELLBEING",
      graphic: (
        <svg viewBox="0 0 100 80" className="w-full h-24 stroke-black stroke-[3.5] fill-none filter drop-shadow-[2px_2px_0px_#111111]">
          {/* Heart being protected by a solid grid */}
          <rect x="10" y="10" width="80" height="60" fill="#FF5A36" stroke="black" strokeWidth="3" />
          {/* Dynamic grid mesh lines */}
          <path d="M 20 10 L 20 70 M 50 10 L 50 70 M 80 10 L 80 70" stroke="black" strokeWidth="1.5" />
          {/* Giant protective heart */}
          <path d="M 50 48 Q 25 20, 50 20 Q 75 20, 50 48 Z" fill="#FFD600" stroke="black" strokeWidth="3.5" />
          <circle cx="50" cy="30" r="4" fill="white" stroke="black" strokeWidth="2" />
        </svg>
      )
    },
    {
      key: "delulu" as const,
      policy: "DELULU IS ONLY SOLULU MISSION",
      icon: Sparkles,
      themeColor: "bg-white text-black",
      borderColor: "border-black",
      shadowColor: "shadow-[8px_8px_0px_#FF5A36]",
      bulletStyle: "bg-black text-white border-black",
      accentDot: "#2563EB",
      description: "Think ridiculously bigger. Launch audacious builds. Dream without safety nets. Force new realities into existence with pure conviction.",
      slogan: "Impossible is just bad imagination.",
      badge: "AUDACIOUS GOALS",
      graphic: (
        <svg viewBox="0 0 100 80" className="w-full h-24 stroke-black stroke-[3.2] fill-none filter drop-shadow-[2px_2px_0px_#111111]">
          {/* Rocket blasting beyond a circle framework */}
          <circle cx="50" cy="40" r="28" fill="#FFD600" stroke="black" strokeWidth="3" />
          <path d="M 50 15 L 62 48 L 50 42 L 38 48 Z" fill="#FF5A36" stroke="black" strokeWidth="3" />
          {/* Sparkles stars */}
          <path d="M 25 20 L 28 23 L 25 26 L 22 23 Z" fill="white" stroke="black" strokeWidth="1.5" />
          <path d="M 75 55 L 78 58 L 75 61 L 72 58 Z" fill="white" stroke="black" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      key: "johoga" as const,
      policy: "JO HOGA DEKHA JAYEGA POLICY",
      icon: Zap,
      themeColor: "bg-ajp-yellow text-black border-black",
      borderColor: "border-black",
      shadowColor: "shadow-[8px_8px_0px_#2563EB]",
      bulletStyle: "bg-black text-white border-black",
      accentDot: "#FF5A36",
      description: "Initiate direct action. Experiment relentlessly. Build and ship early ideas in weeks, not years. Learn at high velocity on the field.",
      slogan: "Action beats perfect stagnation every time.",
      badge: "SHIPPING OVER PLAN",
      graphic: (
        <svg viewBox="0 0 100 80" className="w-full h-24 stroke-black stroke-[3.5] fill-none filter drop-shadow-[2px_2px_0px_#111111]">
          {/* Bolt hitting a building blocks structure */}
          <rect x="15" y="45" width="22" height="22" fill="#2563EB" stroke="black" strokeWidth="3" />
          <rect x="42" y="32" width="20" height="35" fill="white" stroke="black" strokeWidth="3" />
          <polygon points="80,10 50,42 66,42 45,72 82,32 64,32" fill="#FF5A36" stroke="black" strokeWidth="3.5" />
        </svg>
      )
    }
  ];

  return (
    <section id="manifesto" className="py-24 px-4 bg-white border-b-6 border-black bg-ajp-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <span className="font-mono text-xs font-black bg-black text-white px-3 py-1 rounded-none uppercase inline-block mb-3">
              SECTION 02 // MANIFESTO
            </span>
            <h2 className="font-display font-black text-4xl sm:text-6xl uppercase leading-none text-black">
              OUR PLAYGROUND LAWS.
            </h2>
            <p className="font-sans font-semibold text-gray-700 text-lg mt-4">
              We operate under four core, battle-tested playground principles designed to destroy bureaucracy and replace it with action.
            </p>
          </div>
          
          <div className="shrink-0 bg-ajp-black text-ajp-yellow border-4 border-black p-3 px-5 brutal-shadow-md font-mono text-xs font-bold rounded-none uppercase">
            ⚡ MANDATE VERSION: V4.8 // STABLE
          </div>
        </div>

        {/* Manifesto Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 xl:gap-12">
          {cards.map((c, idx) => {
            const IconComponent = c.icon;
            const hasEndorsed = endorsedKeys.includes(c.key);
            
            return (
              <motion.div
                key={c.key}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className={`${c.themeColor} border-4 ${c.borderColor} p-6 md:p-8 flex flex-col justify-between min-h-[480px] rounded-none ${c.shadowColor} relative`}
              >
                {/* Floating Badge Label */}
                <div className="absolute top-4 right-4 bg-black text-white font-mono text-[9px] font-black uppercase p-1 border-2 border-black rotate-[3deg] rounded-none leading-none z-10">
                  {c.badge}
                </div>

                {/* Card Title & Icon Header */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`w-8 h-8 rounded-none border-2 flex items-center justify-center ${c.bulletStyle}`}>
                      {idx + 1}
                    </span>
                    <h3 className="font-display font-extrabold text-xl xl:text-2xl tracking-tighter leading-none pr-16 truncate">
                      {c.policy}
                    </h3>
                  </div>

                  {/* Description Box */}
                  <div className="bg-black/5 p-4 border border-black/10 rounded-none mb-6">
                    <p className="font-sans text-sm md:text-base font-semibold leading-relaxed">
                      {c.description}
                    </p>
                  </div>
                </div>

                {/* Illustration Element */}
                <div className="my-2 select-none pointer-events-none">
                  {c.graphic}
                </div>

                {/* Slogan and Action Bar */}
                <div className="mt-6 pt-6 border-t-2 border-dashed border-black/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="font-mono text-xs font-bold leading-tight">
                    <span className="block text-gray-500 uppercase">PHILOSOPHY:</span>
                    <span className="text-black uppercase">"{c.slogan}"</span>
                  </div>

                  {/* Endorsement Interactive trigger button */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEndorse(c.key)}
                    className={`p-2.5 px-4 font-display font-black text-xs uppercase brutal-border border-2 flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                      hasEndorsed
                        ? "bg-black text-white border-black"
                        : "bg-ajp-yellow text-black border-black hover:bg-yellow-400"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>
                      {hasEndorsed ? "★ ENDORSED ✓" : "ENDORSE MANDATE"}
                    </span>
                    <span className="bg-white text-black text-[9px] font-mono font-bold px-1 py-0.5 border border-black rounded-none">
                      {endorse[c.key]}
                    </span>
                  </motion.button>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Motivational Manifesto Footer Banner block */}
        <div className="mt-16 bg-black text-white p-6 md:p-8 border-4 border-black shadow-[4px_4px_0px_#FF5A36] flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-none">
          <div className="max-w-2xl font-mono">
            <h4 className="text-ajp-yellow font-display font-bold text-lg mb-1 uppercase tracking-tight">
              ⚡ OUR CITIZENS' MANIFESTO IS OPEN SOURCE
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed uppercase">
              This is not a written-in-stone constitutional document. It’s an active blueprint. Anyone is welcome to fork these schemes, run them locally in their ward, or build an API proxy to automate the Kolaveri Di demand.
            </p>
          </div>
          <button
            onClick={() => window.open("https://github.com", "_blank", "noopener,noreferrer")}
            className="bg-ajp-yellow text-black font-display font-black text-sm uppercase p-3 px-6 brutal-border border-2 hover:translate-y-[-2px] transition-transform cursor-pointer rounded-none self-start md:self-center"
          >
            FORK MANUAL ON GITHUB ⚔️
          </button>
        </div>

      </div>
    </section>
  );
};
