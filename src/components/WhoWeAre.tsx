import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Hammer, Code, Sparkles, Paintbrush, HeartHandshake, Dumbbell, Rocket, Pin, User, HelpCircle } from "lucide-react";

interface JantaPin {
  id: string;
  name: string;
  role: string;
  color: string;
  timestamp: string;
}

export const WhoWeAre: React.FC = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Developer");
  const [customPins, setCustomPins] = useState<JantaPin[]>([]);
  const [formAlert, setFormAlert] = useState(false);

  // Default initial community pins stored in local state
  const defaultPins: JantaPin[] = [
    { id: "1", name: "Aarav Sharma", role: "Indie Hacker", color: "#FF5A36", timestamp: "Just now" },
    { id: "2", name: "Neha Patel", role: "Visual Artist", color: "#2563EB", timestamp: "2 mins ago" },
    { id: "3", name: "Vikram Sen", role: "Social Builder", color: "#FFD600", timestamp: "5 mins ago" },
    { id: "4", name: "Kabir Roy", role: "Code Dreamer", color: "#FFFFFF", timestamp: "12 mins ago" },
  ];

  useEffect(() => {
    const saved = localStorage.getItem("ajp_janta_pins");
    if (saved) {
      try {
        setCustomPins(JSON.parse(saved));
      } catch (_) {
        setCustomPins(defaultPins);
      }
    } else {
      setCustomPins(defaultPins);
      localStorage.setItem("ajp_janta_pins", JSON.stringify(defaultPins));
    }
  }, []);

  const handleAddPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const colors = ["#FFD600", "#FF5A36", "#2563EB", "#FFFFFF"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newPin: JantaPin = {
      id: Date.now().toString(),
      name: name.trim(),
      role: role.trim(),
      color: randomColor,
      timestamp: "Just now",
    };

    const updated = [newPin, ...customPins];
    setCustomPins(updated);
    localStorage.setItem("ajp_janta_pins", JSON.stringify(updated));

    // Reset inputs
    setName("");
    setFormAlert(true);
    setTimeout(() => setFormAlert(false), 3000);

    // Audio click feedback
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(500, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (_) {}
  };

  const categories = [
    { title: "BUILDERS", icon: Hammer, color: "bg-ajp-yellow", desc: "Forging concrete answers instead of paper excuses." },
    { title: "CODERS", icon: Code, color: "bg-ajp-blue text-white", desc: "Debugging old systems, building the new protocols." },
    { title: "DREAMERS", icon: Sparkles, color: "bg-ajp-orange text-white", desc: "Refusing to accept 'it's always been done this way'." },
    { title: "FOUNDERS", icon: Rocket, color: "bg-white", desc: "Staking their careers to spark self-reliance." },
    { title: "ARTISTS", icon: Paintbrush, color: "bg-ajp-yellow", desc: "Designing alternative futures in vibrant colors." },
    { title: "ATHLETES", icon: Dumbbell, color: "bg-ajp-blue text-white", desc: "Running with grit, pushing boundaries of endurance." },
    { title: "WORKERS", icon: HeartHandshake, color: "bg-ajp-orange text-white", desc: "The quiet pillars keeping our neighborhoods spinning." },
    { title: "YOU", icon: User, color: "bg-white", desc: "Every single person ready to pick up a bucket today." }
  ];

  return (
    <section id="about" className="py-24 px-4 bg-white border-b-6 border-black bg-ajp-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Editorial Title Block */}
        <div className="border-4 border-black p-6 md:p-8 mb-16 bg-white shadow-[8px_8px_0px_#111111] max-w-4xl bg-ajp-white">
          <span className="font-mono text-xs font-black bg-black text-white px-3 py-1 rounded-none uppercase inline-block mb-3">
            SECTION 01 // WHO WE ARE
          </span>
          <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl uppercase leading-none text-black mb-6">
            WE ARE THE JANTA.
          </h2>
          <p className="font-sans font-semibold text-lg sm:text-xl text-gray-800 leading-relaxed max-w-3xl">
            We are creators, builders, dreamers, founders, artists, athletes, and workers who believe things can be better. 
            <strong> We are not waiting for permission. </strong> While others look for politicians or committee drafts to solve issues, we just grab a bucket.
          </p>
        </div>

        {/* Categories Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {categories.map((c, idx) => (
            <motion.div
              whileHover={{ scale: 1.03, rotate: idx % 2 === 0 ? 1 : -1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              key={c.title}
              className={`${c.color} border-4 border-black p-6 brutal-shadow flex flex-col justify-between min-h-[220px] rounded-none`}
            >
              <div className="flex items-start justify-between">
                <span className="font-display font-black text-2xl xl:text-3xl tracking-tight leading-none">
                  {c.title}
                </span>
                <c.icon className="w-8 h-8 shrink-0 stroke-[2.5]" />
              </div>

              <div className="mt-8 border-t-2 border-black pt-4">
                <p className="font-mono text-xs font-bold leading-normal uppercase">
                  {c.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Board Container (Form + Community Stickies) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-4 border-black bg-ajp-yellow p-6 md:p-10 brutal-shadow-lg rounded-none">
          
          {/* Column 1: Pin Form (40%) */}
          <div className="lg:col-span-5 bg-white border-4 border-black p-6 brutal-shadow rounded-none bg-ajp-white">
            <h3 className="font-display font-black text-2xl uppercase mb-1 flex items-center gap-2">
              <Pin className="w-6 h-6 fill-ajp-orange stroke-black" />
              <span>CLAIM YOUR SEAT</span>
            </h3>
            <p className="font-mono text-xs font-bold text-gray-500 uppercase tracking-tight mb-6">
              Write your name on the Janta Board. No invites required.
            </p>

            <form onSubmit={handleAddPin} className="space-y-4">
              <div>
                <label className="block font-display font-black text-xs uppercase mb-1.5 text-black">
                  Your Full Name
                </label>
                <input
                  type="text"
                  maxLength={24}
                  required
                  placeholder="e.g. Joy Dev"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-3 border-black p-3 font-mono text-sm font-bold bg-white focus:bg-yellow-50 focus:outline-none focus:ring-0 rounded-none text-black"
                />
              </div>

              <div>
                <label className="block font-display font-black text-xs uppercase mb-1.5 text-black">
                  Your Primary Calling
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border-3 border-black p-3 font-mono text-sm font-bold bg-white focus:outline-none rounded-none text-black cursor-pointer"
                >
                  <option value="Code Writer">Code Writer</option>
                  <option value="Idea Founder">Idea Founder</option>
                  <option value="Indie Creator">Indie Creator</option>
                  <option value="Visual Designer">Visual Designer</option>
                  <option value="Dream Architect">Dream Architect</option>
                  <option value="Local Organizer">Local Organizer</option>
                  <option value="Quiet Hardworker">Quiet Hardworker</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-ajp-blue text-white font-display font-black text-sm uppercase p-4 brutal-border border-2 brutal-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#111111] transition-all cursor-pointer active:translate-x-[2px] active:translate-y-[2px]"
              >
                PIN MY BUCKET CARD ✓
              </button>
            </form>

            <AnimatePresence>
              {formAlert && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 bg-green-100 border-2 border-green-500 p-2 text-center text-[11px] font-mono font-bold text-green-800 uppercase"
                >
                  🎉 Pinned successfully! You are live!
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Column 2: The Continuous Sticky Pin Board (60%) */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full min-h-[380px]">
            <div>
              <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-black">
                <span className="font-mono text-xs font-black uppercase text-black">
                  📌 REAL-TIME MOVEMENT BOARD
                </span>
                <span className="font-mono text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded-none uppercase">
                  COUNTER: {customPins.length + 2480} PEOPLE ACTIVE
                </span>
              </div>

              {/* Grid of stickies */}
              <div className="grid grid-cols-2 gap-4">
                <AnimatePresence initial={false}>
                  {customPins.map((pin) => (
                    <motion.div
                      key={pin.id}
                      initial={{ scale: 0.8, rotate: -8, opacity: 0 }}
                      animate={{ scale: 1, rotate: Math.random() * 6 - 3, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ type: "spring", damping: 10 }}
                      className="border-3 border-black p-4 font-mono shadow-[3px_3px_0px_#111111] relative rounded-none select-none hover:scale-105 transition-transform"
                      style={{ backgroundColor: pin.color }}
                    >
                      <Pin className="w-4 h-4 text-black absolute top-2 right-2 fill-black rotate-45" />
                      <h4 className="font-black text-sm uppercase text-black pr-4 truncate">
                        {pin.name}
                      </h4>
                      <p className="text-[10px] bg-black text-white px-1 py-0.5 inline-block font-bold tracking-wider mt-1.5 uppercase rounded-none">
                        {pin.role}
                      </p>
                      
                      <div className="mt-4 flex justify-between items-center text-[9px] text-gray-700 font-bold border-t border-black/20 pt-1.5">
                        <span>EST. MEMBER</span>
                        <span>{pin.timestamp}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white/40 border-2 border-dashed border-black text-center font-mono text-[11px] font-bold text-black uppercase rounded-none">
              ⚠️ NO CREDIT CARDS, EMAILS, OR DEPUTIES REQUIRED. YOU ARE THE LEADER BY DEFAULT.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
