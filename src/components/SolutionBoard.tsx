import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Hammer, Sparkles, Send, Flame, ThumbsUp, Code, ArrowUpRight } from "lucide-react";
import { Initiative } from "../types";

export const SolutionBoard: React.FC = () => {
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState<Initiative["category"]>("Community Projects");
  const [creator, setCreator] = useState("");
  const [githubUrl, setGithubUrl] = useState("");

  const defaultInitiatives: Initiative[] = [
    {
      id: "s-1",
      title: "BALTI-OS OPEN UTILITY DECK",
      category: "Community Projects",
      description: "An open-source Node.js dashboard that simplifies ward complaints by converting raw voicemails into structured JSON reports ready for emails.",
      impactScore: 345,
      creator: "Karan Johar",
      githubUrl: "https://github.com",
      status: "building"
    },
    {
      id: "s-2",
      title: "ZERO-BUREAUCRACY MICRO GRANTED DECK",
      category: "Startups",
      description: "A serverless smart contract distributing 500-rupee tool grants to builders with zero paperwork in under 2 minutes utilizing proof-of-work checkmarks.",
      impactScore: 582,
      creator: "Sneha Sen",
      githubUrl: "https://github.com",
      status: "launched"
    },
    {
      id: "s-3",
      title: "SOLAR ALLEY HACKING PROTOCOL",
      category: "Local Initiatives",
      description: "A manual detailing how mock founders constructed 15 high-voltage LED solar panels with scrap metals to light up alleys in low-opportunity corridors.",
      impactScore: 412,
      creator: "Nikhil & Co.",
      status: "active"
    },
    {
      id: "s-4",
      title: "THE BUNDLE MAKER COOPERATIVE",
      category: "Volunteering",
      description: "A community drive distributing heavy canvas tool bags containing paintbrushes, hammers, wrenches, and raw seeds directly to local citizens.",
      impactScore: 289,
      creator: "Ridhima Lal",
      status: "building"
    },
    {
      id: "s-5",
      title: "KOLA-WEB OUTDATED DESIGN INQUEST",
      category: "Innovation Challenges",
      description: "A quarterly competition inviting developers and artists to redesign horrible city council websites. Winner receives a custom metal bucket award.",
      impactScore: 615,
      creator: "AJP Collective",
      githubUrl: "https://github.com",
      status: "active"
    }
  ];

  useEffect(() => {
    const saved = localStorage.getItem("ajp_solution_initiatives");
    if (saved) {
      try {
        setInitiatives(JSON.parse(saved));
      } catch (_) {
        setInitiatives(defaultInitiatives);
      }
    } else {
      setInitiatives(defaultInitiatives);
      localStorage.setItem("ajp_solution_initiatives", JSON.stringify(defaultInitiatives));
    }
  }, []);

  const saveInitiativesToStorage = (updated: Initiative[]) => {
    setInitiatives(updated);
    localStorage.setItem("ajp_solution_initiatives", JSON.stringify(updated));
  };

  const handleImpactBoost = (id: string) => {
    const updated = initiatives.map((ini) => {
      if (ini.id === id) {
        // Play click sound
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(600, audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
          gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.1);
        } catch (_) {}

        return { ...ini, impactScore: ini.impactScore + 1 };
      }
      return ini;
    });
    saveInitiativesToStorage(updated);
  };

  const handleSubmitInitiative = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim() || !creator.trim()) return;

    const newIni: Initiative = {
      id: Date.now().toString(),
      title: title.toUpperCase().trim(),
      category: category,
      description: desc.trim(),
      impactScore: 10,
      creator: creator.trim(),
      githubUrl: githubUrl.trim() || undefined,
      status: "building"
    };

    const updated = [newIni, ...initiatives];
    saveInitiativesToStorage(updated);

    // Reset fields
    setTitle("");
    setDesc("");
    setCreator("");
    setGithubUrl("");
    setShowSubmitModal(false);
  };

  const tabs = ["All", "Community Projects", "Startups", "Local Initiatives", "Events", "Volunteering", "Innovation Challenges"];

  const filteredInitiatives = activeTab === "All"
    ? initiatives
    : initiatives.filter((ini) => ini.category === activeTab);

  return (
    <section id="solutions" className="py-24 px-4 bg-white border-b-6 border-black bg-ajp-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block with Massive Brutalist Headline */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-16">
          <div className="max-w-3xl">
            <span className="font-mono text-xs font-black bg-ajp-blue text-white px-3 py-1 rounded-none uppercase inline-block mb-3">
              SECTION 04 // BUILDING ENGINE
            </span>
            <h2 className="font-display font-black text-5xl sm:text-7xl uppercase leading-none text-black select-all">
              LESS TALK. <br />
              <span className="bg-ajp-yellow brutal-border border-4 px-3 xl:px-6 inline-block transform rotate-[1deg] shadow-[6px_6px_0px_#111111] mt-2">
                MORE BUILDING.
              </span>
            </h2>
            <p className="font-sans font-semibold text-lg text-gray-700 mt-6 max-w-2xl">
              We design and fund open-source initiatives, community programs, and tool blueprints that offer concrete solutions. Review, test, and contribute to active projects below!
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="bg-ajp-black text-white font-display font-black text-sm uppercase p-4 px-8 brutal-border border-4 brutal-press hover:shadow-[6px_6px_0px_#2563EB] text-center rounded-none cursor-pointer"
            >
              PROPOSE NEW PROJECT ✓
            </button>
          </div>
        </div>

        {/* Tab filters */}
        <div className="flex flex-wrap items-center gap-3 mb-10 pb-4 border-b-4 border-black">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`p-2.5 px-5 font-mono text-xs font-black uppercase rounded-none transition-all cursor-pointer brutal-border border-2 ${
                activeTab === tab
                  ? "bg-ajp-blue text-white border-black shadow-[3px_3px_0px_#111111] translate-x-[-1px] translate-y-[-1px]"
                  : "bg-white text-black border-black hover:bg-gray-100/80"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Propose Initiative Modal Popup dialogue */}
        <AnimatePresence>
          {showSubmitModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 35 }}
                className="bg-ajp-yellow text-black border-4 border-black p-6 md:p-8 max-w-lg w-full brutal-shadow-lg rounded-none"
              >
                <div className="flex justify-between items-center pb-3 border-b-2 border-black mb-6">
                  <h3 className="font-display font-black text-xl uppercase">
                    🛠️ PROPOSE INITIATIVE
                  </h3>
                  <button
                    onClick={() => setShowSubmitModal(false)}
                    className="font-mono text-xs font-bold hover:underline uppercase p-1 bg-white border border-black"
                  >
                    [CLOSE]
                  </button>
                </div>

                <form onSubmit={handleSubmitInitiative} className="space-y-4">
                  <div>
                    <label className="block font-mono text-xs font-bold uppercase mb-1">
                      Project Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BALTI-COMPLAINT CHASSIS"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full border-2 border-black p-2.5 font-mono text-xs bg-white text-black rounded-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase mb-1">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full border-2 border-black p-2.5 font-mono text-xs bg-white text-black rounded-none cursor-pointer"
                      >
                        <option value="Community Projects">Community Projects</option>
                        <option value="Startups">Startups</option>
                        <option value="Local Initiatives">Local Initiatives</option>
                        <option value="Events">Events</option>
                        <option value="Volunteering">Volunteering</option>
                        <option value="Innovation Challenges">Innovation Challenges</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-mono text-xs font-bold uppercase mb-1">
                        Your Name / Team Handle
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Joy & Sam"
                        value={creator}
                        onChange={(e) => setCreator(e.target.value)}
                        className="w-full border-2 border-black p-2.5 font-mono text-xs bg-white text-black rounded-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-bold uppercase mb-1">
                      Brief Specification (Max 180 chars)
                    </label>
                    <textarea
                      required
                      rows={3}
                      maxLength={180}
                      placeholder="Describe what physical tool or software blueprint you are building..."
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      className="w-full border-2 border-black p-2.5 font-mono text-xs bg-white text-black rounded-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-bold uppercase mb-1">
                      Github Link (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="e.g. https://github.com/..."
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className="w-full border-2 border-black p-2.5 font-mono text-xs bg-white text-black rounded-none"
                    />
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowSubmitModal(false)}
                      className="w-1/2 bg-white text-black font-mono text-xs uppercase p-3 border-2 border-black"
                    >
                      ABORT
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 bg-ajp-blue text-white font-display font-black text-xs uppercase p-3 brutal-border border-2 shadow-[2px_2px_0px_#111111]"
                    >
                      SUBMIT BLUEPRINT
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Initiatives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence initial={false}>
            {filteredInitiatives.map((ini) => (
              <motion.div
                key={ini.id}
                layout
                whileHover={{ scale: 1.02 }}
                className="bg-white border-4 border-black p-6 flex flex-col justify-between min-h-[310px] brutal-shadow rounded-none relative bg-ajp-white"
              >
                {/* Visual Header */}
                <div>
                  <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-dashed border-gray-200">
                    <span className="font-mono text-[9px] font-black bg-ajp-yellow text-black px-1.5 py-0.5 border border-black uppercase rounded-none">
                      {ini.category}
                    </span>
                    
                    {/* Status Dot */}
                    <span className="flex items-center gap-1 font-mono text-[9px] font-bold uppercase">
                      <span className={`w-2.5 h-2.5 rounded-full inline-block border border-black ${
                        ini.status === "launched" ? "bg-green-500 animate-pulse" : ini.status === "active" ? "bg-ajp-blue" : "bg-ajp-orange"
                      }`} />
                      <span>{ini.status}</span>
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-lg xl:text-xl leading-tight mb-3 text-black">
                    {ini.title}
                  </h3>

                  <p className="font-mono text-xs leading-relaxed text-gray-600 mb-6">
                    {ini.description}
                  </p>
                </div>

                {/* Card footer details and Boost Impact mechanism */}
                <div className="mt-4 pt-4 border-t-2 border-black flex items-center justify-between gap-2">
                  <div className="font-mono text-[10px] leading-tight">
                    <span className="block text-gray-400">ARCHITECT:</span>
                    <span className="font-bold text-black uppercase">{ini.creator}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {ini.githubUrl && (
                      <a
                        href={ini.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 border border-black bg-white hover:bg-gray-100 text-black shadow-[1.5px_1.5px_0px_#111111]"
                        title="View Github codebase"
                      >
                        <Code className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleImpactBoost(ini.id)}
                      className="bg-ajp-yellow hover:bg-yellow-400 text-black font-display font-black text-[10px] uppercase p-1.5 px-3 border border-black shadow-[2px_2px_0px_#111111] flex items-center gap-1 cursor-pointer rounded-none active:translate-y-0.5"
                    >
                      <ThumbsUp className="w-3 h-3 fill-black text-black" />
                      <span>BOOST {ini.impactScore}</span>
                    </motion.button>
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
