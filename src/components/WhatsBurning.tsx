import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Flame, Droplet, Check, Plus, AlertCircle, HelpCircle } from "lucide-react";
import { Problem } from "../types";

export const WhatsBurning: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState<Problem["category"]>("bureaucracy");
  const [reporterName, setReporterName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const defaultProblems: Problem[] = [
    {
      id: "b-1",
      title: "OUTDATED FILE SIGN-OFF LOOPS",
      category: "bureaucracy",
      description: "Getting five physical signatures for a basic community room reservation took three weeks, four corridor hikes, and one security bribe.",
      isBurning: true,
      extinguishVotes: 142,
      reporter: "Ananya Iyer",
      createdAt: "2 hours ago"
    },
    {
      id: "b-2",
      title: "BROKEN NEIGHBORHOOD STREET LIGHT GRIDS",
      category: "community",
      description: "Dark alleys near the community startup space haven't been serviced since January. Residents had to buy solar garden lamps.",
      isBurning: true,
      extinguishVotes: 98,
      reporter: "Rohan Das",
      createdAt: "5 hours ago"
    },
    {
      id: "b-3",
      title: "UNREACHABLE TOWN COMPLAINT HELPLINE",
      category: "broken-systems",
      description: "The official complaint portal sends a verification OTP after 12 hours, which expires within 5 minutes. Literal circular infinity.",
      isBurning: true,
      extinguishVotes: 231,
      reporter: "Deepak Grover",
      createdAt: "Yesterday"
    },
    {
      id: "b-4",
      title: "GATEKEEPING LOCAL INCUBATOR ACCESS",
      category: "opportunity",
      description: "Incubators require builders to have pre-seed funding just to enter a study booth. No space for raw garage-hackers.",
      isBurning: false, // Starts solved to showcase solved styling
      extinguishVotes: 320,
      reporter: "Shruti Hegde",
      createdAt: "2 days ago"
    },
    {
      id: "b-5",
      title: "UNNECESSARY KYC ACCUMULATION",
      category: "inefficiency",
      description: "The community coffee cluster requests photo ID uploads, email verifications, and physical forms just to issue a paper reward stamp.",
      isBurning: true,
      extinguishVotes: 85,
      reporter: "Yusuf Khan",
      createdAt: "3 days ago"
    },
    {
      id: "b-6",
      title: "SILOED COMMUNE NOTIFICATION BOARDS",
      category: "opportunity",
      description: "No public, shared API for local announcements. Every society prints documents and pastes them on concrete pillars.",
      isBurning: true,
      extinguishVotes: 112,
      reporter: "Vik Sharma",
      createdAt: "3 days ago"
    }
  ];

  useEffect(() => {
    const saved = localStorage.getItem("ajp_burning_problems");
    if (saved) {
      try {
        setProblems(JSON.parse(saved));
      } catch (_) {
        setProblems(defaultProblems);
      }
    } else {
      setProblems(defaultProblems);
      localStorage.setItem("ajp_burning_problems", JSON.stringify(defaultProblems));
    }

    const handleOpenForm = () => {
      setShowAddForm(true);
    };
    window.addEventListener("ajp_open_report_form", handleOpenForm);
    return () => {
      window.removeEventListener("ajp_open_report_form", handleOpenForm);
    };
  }, []);

  const saveProblemsToStorage = (updatedList: Problem[]) => {
    setProblems(updatedList);
    localStorage.setItem("ajp_burning_problems", JSON.stringify(updatedList));
  };

  const handleExtinguish = (id: string) => {
    const updated = problems.map((p) => {
      if (p.id === id) {
        // Play steam douse audio click feedback
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(300, audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.3);
          gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.35);
        } catch (_) {}

        return { ...p, isBurning: false, extinguishVotes: p.extinguishVotes + 1 };
      }
      return p;
    });
    saveProblemsToStorage(updated);
  };

  const handleReignite = (id: string) => {
    const updated = problems.map((p) => {
      if (p.id === id) {
        return { ...p, isBurning: true };
      }
      return p;
    });
    saveProblemsToStorage(updated);
  };

  const handleSubmitProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const newProblem: Problem = {
      id: Date.now().toString(),
      title: newTitle.toUpperCase().trim(),
      category: newCategory,
      description: newDesc.trim(),
      isBurning: true,
      extinguishVotes: 1,
      reporter: reporterName.trim() || "Anonymous Janta",
      createdAt: "Just now"
    };

    const updated = [newProblem, ...problems];
    saveProblemsToStorage(updated);

    // Reset fields
    setNewTitle("");
    setNewDesc("");
    setReporterName("");
    setShowAddForm(false);
  };

  return (
    <section id="burning" className="py-24 px-4 bg-ajp-black text-white border-b-6 border-black relative overflow-hidden">
      
      {/* Background dots for tech styling */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{
          backgroundImage: "radial-gradient(#ffffff 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px"
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Editorial Heading Panel */}
        <div className="border-4 border-white p-6 md:p-8 mb-16 bg-white text-black shadow-[8px_8px_0px_#FF5A36] max-w-4xl bg-ajp-white">
          <span className="font-mono text-xs font-black bg-ajp-orange text-white px-3 py-1 rounded-none uppercase inline-block mb-3 animate-pulse">
            SECTION 03 // EX-EXCUSES BOARD
          </span>
          <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl uppercase leading-none mb-6">
            WHAT’S BURNING?
          </h2>
          <p className="font-sans font-semibold text-lg text-gray-800 leading-relaxed max-w-2xl">
            Outdated processes, bureaucratic brick walls, and unnecessary complexity are burning citizen time. Find a bug, grab the bucket, and douse the fire on this board!
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-ajp-orange text-white font-display font-black text-xs uppercase p-3 px-5 brutal-border border-2 hover:bg-orange-600 transition-colors cursor-pointer rounded-none flex items-center gap-2 shadow-[3px_3px_0px_#111111]"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>LOG NEW PROBLEM REPORT</span>
            </button>
          </div>
        </div>

        {/* Floating Add Problem Form panel */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white text-black border-4 border-white p-6 max-w-2xl mb-12 shadow-[8px_8px_0px_#2563EB] rounded-none bg-ajp-white"
            >
              <div className="flex justify-between items-center pb-3 border-b-2 border-black mb-6">
                <h3 className="font-display font-black text-xl uppercase text-black">
                  📝 LOG BURNING ISSUE
                </h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-xs font-mono font-bold hover:underline uppercase"
                >
                  [CANCEL]
                </button>
              </div>

              <form onSubmit={handleSubmitProblem} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-display font-black text-xs uppercase mb-1">
                      Problem Title / Bug Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. DRAINAGE STAGNATION IN SECTOR 4"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full border-2 border-black p-2.5 font-mono text-xs bg-white rounded-none"
                    />
                  </div>

                  <div>
                    <label className="block font-display font-black text-xs uppercase mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full border-2 border-black p-2.5 font-mono text-xs bg-white rounded-none cursor-pointer"
                    >
                      <option value="bureaucracy">Bureaucracy</option>
                      <option value="broken-systems">Broken Systems</option>
                      <option value="inefficiency">Inefficiency</option>
                      <option value="community">Community Challenges</option>
                      <option value="opportunity">Lack of Opportunities</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-display font-black text-xs uppercase mb-1">
                    Describe the fire / Outdated Excuses
                  </label>
                  <textarea
                    required
                    rows={3}
                    maxLength={200}
                    placeholder="Provide a quick 1-2 sentence description including how bureaucracy or excuses are holding things back..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full border-2 border-black p-2.5 font-mono text-xs bg-white rounded-none placeholder:text-gray-400"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-display font-black text-xs uppercase mb-1">
                      Your Name / Handle
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Preeti C."
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      className="w-full border-2 border-black p-2.5 font-mono text-xs bg-white rounded-none"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full bg-ajp-yellow text-black font-display font-black text-xs uppercase p-3 brutal-border border-2 hover:bg-yellow-400 cursor-pointer rounded-none shadow-[3px_3px_0px_#111111]"
                    >
                      FLINGER INTO THE WALL 🔥
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Problems Wall Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence initial={false}>
            {problems.map((p) => (
              <motion.div
                key={p.id}
                layoutId={`card-${p.id}`}
                className={`border-4 p-6 min-h-[280px] flex flex-col justify-between transition-all relative rounded-none ${
                  p.isBurning
                    ? "bg-black border-red-500 shadow-[5px_5px_0px_0px_#FF5A36]"
                    : "bg-ajp-blue/5 border-[#2563EB] shadow-[5px_5px_0px_0px_#2563EB] border-[4px]"
                }`}
              >
                
                {/* Visual Header */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[9px] font-bold bg-white text-black px-1.5 py-0.5 border border-black uppercase rounded-none">
                      #{p.category.toUpperCase().replace("-", " ")}
                    </span>
                    <span className="font-mono text-[9px] text-gray-400">
                      {p.createdAt}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className={`font-display font-black text-lg xl:text-xl leading-tight mb-3 tracking-tight ${
                    p.isBurning ? "text-white" : "text-[#2563EB] line-through decoration-black decoration-3 opacity-80"
                  }`}>
                    {p.title}
                  </h3>

                  {/* Description */}
                  <p className="font-mono text-xs leading-relaxed text-gray-300">
                    {p.description}
                  </p>
                </div>

                {/* Footer and Interactive trigger */}
                <div className="mt-6 pt-4 border-t border-gray-800/80 flex items-center justify-between">
                  <div className="text-[10px] font-mono text-gray-400 uppercase">
                    By: <strong className="text-white">{p.reporter}</strong>
                  </div>

                  {p.isBurning ? (
                    <button
                      onClick={() => handleExtinguish(p.id)}
                      className="bg-ajp-orange text-white font-display font-black text-xs uppercase p-2 border-2 border-white hover:bg-orange-600 active:translate-y-0.5 transition-transform cursor-pointer rounded-none flex items-center gap-1.5 shadow-[2px_2px_0px_#FFF]"
                    >
                      <Droplet className="w-3.5 h-3.5 fill-white stroke-black" />
                      <span>DOUSE 💧</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReignite(p.id)}
                      className="bg-ajp-blue text-white font-display font-black text-[10px] uppercase p-1.5 border border-white hover:bg-blue-800 cursor-pointer rounded-none flex items-center gap-1"
                      title="Reignite issue to test game again"
                    >
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>SOLVED!</span>
                    </button>
                  )}
                </div>

                {/* Animated active fire background icon on burning cards */}
                {p.isBurning && (
                  <div className="absolute right-3 bottom-14 opacity-15 pointer-events-none select-none">
                    <motion.div
                      animate={{ scale: [1, 1.2, 0.9, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Flame className="w-12 h-12 text-red-500 fill-red-500" />
                    </motion.div>
                  </div>
                )}

              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
