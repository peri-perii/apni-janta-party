import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, UserCheck, HelpCircle } from "lucide-react";

interface JoinMovementProps {
  onReportProblemClick: () => void;
}

export const JoinMovement: React.FC<JoinMovementProps> = ({ onReportProblemClick }) => {
  const [email, setEmail] = useState("");
  const [activeForm, setActiveForm] = useState<"none" | "join" | "start">("none");
  const [memberPass, setMemberPass] = useState<{
    id: string;
    email: string;
    joinDate: string;
    cardRot: number;
  } | null>(null);

  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaDesc, setIdeaDesc] = useState("");
  const [showIdeaSuccess, setShowIdeaSuccess] = useState(false);

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Generate unique Janta ID Card (persistent mock)
    const cardId = `AJP-MEM-${Math.floor(Math.random() * 899999) + 100000}`;
    const today = new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    setMemberPass({
      id: cardId,
      email: email.toLowerCase().trim(),
      joinDate: today,
      cardRot: Math.random() * 4 - 2,
    });

    setEmail("");

    // Audio confirmation synth
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch (_) {}
  };

  const handleStartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaTitle.trim() || !ideaDesc.trim()) return;

    setShowIdeaSuccess(true);
    setIdeaTitle("");
    setIdeaDesc("");
    setTimeout(() => setShowIdeaSuccess(false), 5000);

    // Audio click synth
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(300, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch (_) {}
  };

  return (
    <section id="join" className="py-24 px-4 bg-ajp-yellow text-black border-t-6 border-b-6 border-black relative overflow-hidden">
      
      {/* Background patterns */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none" 
        style={{
          backgroundImage: "radial-gradient(#111111 2px, transparent 2px)",
          backgroundSize: "24px 24px"
        }}
      />

      <div className="max-w-5xl mx-auto text-center relative z-10 py-12 md:py-16">
        
        {/* Massive full-screen CTA Headline */}
        <span className="font-mono text-xs font-black bg-black text-white px-3 py-1 rounded-none uppercase inline-block mb-4">
          SECTION 08 // READY ENGINE
        </span>
        
        <h2 className="font-display font-black text-4xl sm:text-6xl md:text-8xl uppercase leading-none tracking-tighter mb-6 text-black select-none">
          THE BUCKET <br />
          IS WAITING.
        </h2>

        {/* Elegant clean subheadline */}
        <p className="font-sans font-semibold text-lg sm:text-xl md:text-2xl text-gray-800 max-w-2xl mx-auto leading-relaxed mb-12">
          "If you see a problem, don't walk around it. <br className="hidden md:inline" />
          Help solve it."
        </p>

        {/* Navigation Action Buttons bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full max-w-2xl mx-auto mb-16 px-4">
          
          <button
            onClick={() => { setActiveForm(activeForm === "join" ? "none" : "join"); setMemberPass(null); }}
            className={`w-full sm:w-auto font-display font-black text-sm uppercase p-4 px-8 border-4 border-black brutal-press cursor-pointer rounded-none text-center ${
              activeForm === "join"
                ? "bg-black text-white shadow-[4px_4px_0px_#FFF]"
                : "bg-white text-black shadow-[6px_6px_0px_#2563EB]"
            }`}
          >
            JOIN US 📨
          </button>

          <button
            onClick={() => { setActiveForm(activeForm === "start" ? "none" : "start"); }}
            className={`w-full sm:w-auto font-display font-black text-sm uppercase p-4 px-8 border-4 border-black brutal-press cursor-pointer rounded-none text-center ${
              activeForm === "start"
                ? "bg-black text-white shadow-[4px_4px_0px_#FFF]"
                : "bg-ajp-orange text-white shadow-[6px_6px_0px_#111111]"
            }`}
          >
            START SOMETHING 🛠️
          </button>

          <button
            onClick={onReportProblemClick}
            className="w-full sm:w-auto bg-white text-black font-display font-black text-sm uppercase p-4 px-8 border-4 border-black brutal-shadow-md brutal-press cursor-pointer rounded-none text-center hover:bg-gray-50"
          >
            REPORT A PROBLEM 🔥
          </button>

        </div>

        {/* Dynamic Forms Area */}
        <div className="max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            
            {activeForm === "join" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border-4 border-black p-6 md:p-8 brutal-shadow rounded-none text-left bg-ajp-white relative"
              >
                {!memberPass ? (
                  /* Enrollment signup */
                  <form onSubmit={handleJoinSubmit} className="space-y-4">
                    <h3 className="font-display font-black text-lg uppercase mb-2">
                      📨 GET MEMBERSHIP IDENTITY CARD
                    </h3>
                    <p className="font-mono text-[11px] text-gray-500 uppercase tracking-tight mb-4">
                      Enter your email below to instantly auto-generate an digital membership pass. No fees, no screening, instant access.
                    </p>

                    <div>
                      <input
                        type="email"
                        required
                        placeholder="e.g. you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border-2 border-black p-3 font-mono text-xs bg-white text-black rounded-none focus:outline-none focus:bg-yellow-50"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-ajp-blue text-white font-display font-black text-xs uppercase p-3.5 brutal-border border-2 shadow-[2px_2px_0px_#111111] cursor-pointer"
                    >
                      ENROLL NOW &amp; COMPILE PASS
                    </button>
                  </form>
                ) : (
                  /* Compiled Digital Card Display pass */
                  <motion.div
                    animate={{ rotate: memberPass.cardRot }}
                    className="bg-ajp-black text-white p-6 border-4 border-black rounded-none shadow-lg relative overflow-hidden"
                  >
                    {/* Retro micro print details */}
                    <div className="absolute top-2 right-2 font-mono text-[8px] text-red-500 font-bold border border-red-500 px-1 py-0.5 uppercase">
                      verified active
                    </div>

                    <div className="flex items-center gap-3 mb-6 border-b border-white/20 pb-4 select-none">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black font-display font-black text-xs">
                        ✓
                      </div>
                      <div className="flex flex-col">
                        <span className="font-display font-black text-sm tracking-tight leading-none text-ajp-yellow">
                          APNI JANTA PARTY
                        </span>
                        <span className="font-mono text-[8px] uppercase tracking-wider text-gray-400">
                          Awaaz Har Janta Ki.
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="block font-mono text-[8px] text-gray-400 uppercase">
                          MEMBER IDENTITY ID:
                        </span>
                        <span className="font-mono text-sm font-black text-white font-mono tracking-wider">
                          {memberPass.id}
                        </span>
                      </div>

                      <div>
                        <span className="block font-mono text-[8px] text-gray-400 uppercase">
                          REGISTERED EMAIL ADDRESS:
                        </span>
                        <span className="font-mono text-xs font-bold text-gray-300 break-all block">
                          {memberPass.email}
                        </span>
                      </div>

                      <div>
                        <span className="block font-mono text-[8px] text-gray-400 uppercase">
                          LAUNCH DATE CODES:
                        </span>
                        <span className="font-mono text-xs font-bold text-gray-300 block">
                          {memberPass.joinDate}
                        </span>
                      </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-white/20 text-center font-mono text-[10px] uppercase text-ajp-yellow font-black">
                      ⚡ BUCKET LEVEL: READY FOR SERVICE
                    </div>

                    <button
                      onClick={() => setMemberPass(null)}
                      className="mt-4 w-full bg-white text-black font-mono text-[9px] uppercase font-bold p-1 border border-black hover:bg-gray-100"
                    >
                      [GENERATE NEXT PASS]
                    </button>

                  </motion.div>
                )}
              </motion.div>
            )}

            {activeForm === "start" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border-4 border-black p-6 md:p-8 brutal-shadow rounded-none text-left bg-ajp-white"
              >
                {!showIdeaSuccess ? (
                  <form onSubmit={handleStartSubmit} className="space-y-4">
                    <h3 className="font-display font-black text-lg uppercase mb-2">
                      🛠️ BOOTSTRAP AN OPEN PROJECT
                    </h3>
                    <p className="font-mono text-[11px] text-gray-500 uppercase tracking-tight mb-4">
                      Propose an idea, draft a design pattern, and call other Janta members to help you build it!
                    </p>

                    <div>
                      <label className="block font-mono text-[9px] font-bold uppercase mb-1">
                        Campaign Title / Hack Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. SOLAR WATER FILTER PROTOTYPE"
                        value={ideaTitle}
                        onChange={(e) => setIdeaTitle(e.target.value)}
                        className="w-full border-2 border-black p-2.5 font-mono text-xs bg-white text-black rounded-none"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[9px] font-bold uppercase mb-1">
                        How does it solve a municipal or community bug?
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Describe your fast experiment..."
                        value={ideaDesc}
                        onChange={(e) => setIdeaDesc(e.target.value)}
                        className="w-full border-2 border-black p-2.5 font-mono text-xs bg-white text-black rounded-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-ajp-orange text-white font-display font-black text-xs uppercase p-3.5 brutal-border border-2 shadow-[2px_2px_0px_#111111] cursor-pointer"
                    >
                      BROADCAST CAMPAIGN PASS
                    </button>
                  </form>
                ) : (
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="text-center py-6 space-y-4"
                  >
                    <div className="w-12 h-12 bg-green-100 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto text-green-600 font-bold">
                      ✓
                    </div>
                    <h4 className="font-display font-black text-lg uppercase text-black">
                      CAMPAIGN LOGGED SUCCESSFULLY!
                    </h4>
                    <p className="font-mono text-xs text-gray-600 uppercase tracking-tight max-w-sm mx-auto">
                      Your campaign proposal is compiled and queued. Open-source developers linked on the Solution Board will receive this alert within the hour!
                    </p>
                    <button
                      onClick={() => setShowIdeaSuccess(false)}
                      className="bg-black text-white font-mono text-[10px] p-2 px-4 uppercase font-bold border border-black cursor-pointer"
                    >
                      CLOSE REPORT
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
