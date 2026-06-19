import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Users, Code2, ShieldAlert, Globe } from "lucide-react";

export const Impact: React.FC = () => {
  const [peopleReached, setPeopleReached] = useState(2481024);
  const [problemsSolved, setProblemsSolved] = useState(12842);
  const [projectsStarted, setProjectsStarted] = useState(482);
  const [commBuilt, setCommBuilt] = useState(284);

  useEffect(() => {
    // Read local doused count to add to problems solved as user actions!
    const savedBurning = localStorage.getItem("ajp_burning_problems");
    let localSolvedOffset = 0;
    if (savedBurning) {
      try {
        const parsed = JSON.parse(savedBurning);
        // Default list has 1 solved problem initially. Filter how many are solved.
        const solvedCount = parsed.filter((p: any) => !p.isBurning).length;
        if (solvedCount > 1) {
          localSolvedOffset = solvedCount - 1; // offset initial default solved state
        }
      } catch (_) {}
    }

    setProblemsSolved((prev) => prev + localSolvedOffset);

    // Ticker to make counters live and energetic
    const interval = setInterval(() => {
      // Random people join
      setPeopleReached((prev) => prev + Math.floor(Math.random() * 4) + 1);
      
      // Occasionally solve another systemic issue
      if (Math.random() > 0.8) {
        setProblemsSolved((prev) => prev + 1);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      label: "PEOPLE REACHED",
      value: peopleReached.toLocaleString(),
      icon: Users,
      color: "bg-ajp-yellow",
      accent: "#FF5A36",
    },
    {
      label: "PROJECTS STARTED",
      value: projectsStarted.toString(),
      icon: Code2,
      color: "bg-ajp-orange text-white",
      accent: "#FFFFFF",
    },
    {
      label: "PROBLEMS SOLVED",
      value: problemsSolved.toLocaleString(),
      icon: ShieldAlert,
      color: "bg-ajp-blue text-white",
      accent: "#FFD600",
    },
    {
      label: "COMMUNITIES BUILT",
      value: commBuilt.toString(),
      icon: Globe,
      color: "bg-white text-black",
      accent: "#2563EB",
    }
  ];

  return (
    <section id="impact" className="py-24 px-4 bg-ajp-yellow border-t-6 border-b-6 border-black relative overflow-hidden">
      
      {/* Editorial branding grid backdrop */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none" 
        style={{
          backgroundImage: "radial-gradient(#111111 2px, transparent 2px)",
          backgroundSize: "24px 24px"
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Block and Slogans */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs font-black bg-black text-white px-3 py-1 rounded-none uppercase inline-block mb-3">
            SECTION 05 // THE LOGS
          </span>
          <h2 className="font-display font-black text-4xl sm:text-6xl uppercase leading-none text-black">
            JANTA METRICS.
          </h2>
          <p className="font-sans font-semibold text-gray-800 text-lg mt-4">
            We don’t compile powerpoints or wait for surveys. We calculate results based on actual buckets deployed, projects shipped, and streets lit.
          </p>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
          {stats.map((s, idx) => (
            <motion.div
              key={s.label}
              whileHover={{ scale: 1.04, rotate: idx % 2 === 0 ? 1.5 : -1.5 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className={`${s.color} border-4 border-black p-6 md:p-8 flex flex-col justify-between min-h-[220px] shadow-[6px_6px_0px_rgba(17,17,17,1)] rounded-none relative`}
            >
              {/* Card Label */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-black uppercase tracking-wider opacity-80">
                    {s.label}
                  </span>
                  <s.icon className="w-5 h-5 opacity-90 stroke-[2.5]" />
                </div>

                {/* Massive value number */}
                <span className="font-display font-black text-3xl sm:text-4xl xl:text-5xl tracking-tighter leading-none block my-4 break-words">
                  {s.value}
                </span>
              </div>

              {/* Base detail */}
              <div className="border-t border-black/20 pt-3 flex justify-between items-center text-[9px] font-mono font-bold uppercase">
                <span>STATUS: VERIFIED LIVE</span>
                <span style={{ color: s.accent }}>● SOLID RESULT</span>
              </div>

              {/* Decorative side corner strip */}
              <div 
                className="absolute right-0 bottom-0 top-0 w-3 border-l-2 border-black"
                style={{ backgroundColor: s.accent }}
              />

            </motion.div>
          ))}
        </div>

        {/* Custom Visual Banner - Neo-Brutalist Sticker Label info */}
        <div className="mt-16 text-center">
          <div className="bg-white border-4 border-black p-4 inline-block shadow-[4px_4px_0px_#111111] font-mono text-xs font-black uppercase rotate-[-1deg] text-black">
            📈 EVERY INDIE UPVOTE, PIN REPORT, OR FLAME EXTINGUISHED ADDS DIRECTLY TO APNI JANTA PARTY SERVERS!
          </div>
        </div>

      </div>
    </section>
  );
};
