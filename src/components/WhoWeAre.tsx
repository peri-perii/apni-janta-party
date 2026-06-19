import React from "react";
import { motion } from "motion/react";
import { Hammer, Code, Sparkles, Paintbrush, HeartHandshake, Dumbbell, Rocket, User } from "lucide-react";
import { AjpFlag } from "./AjpFlag";

export const WhoWeAre: React.FC = () => {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* Founders Spotlight Block */}
        <div className="mt-16 border-4 border-black bg-ajp-yellow p-6 md:p-8 brutal-shadow rounded-none">
          <div className="flex items-center justify-between mb-8 pb-2 border-b-2 border-black">
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs font-black uppercase text-black">
                👑 MOVEMENT FOUNDERS
              </span>
              <AjpFlag size="sm" className="hidden sm:flex -mt-[32px]" />
            </div>
            <span className="font-mono text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded-none uppercase">
              CO-BUILDERS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Founder Card */}
            <motion.div
              whileHover={{ rotate: -1, scale: 1.02 }}
              className="bg-white border-4 border-black p-6 brutal-shadow-sm flex items-center gap-5 rounded-none bg-ajp-white"
            >
              <div className="w-16 h-16 bg-black text-ajp-yellow flex items-center justify-center font-display font-black text-2xl border-2 border-black rounded-none shadow-[2px_2px_0px_#111111] select-none shrink-0">
                DJ
              </div>
              <div>
                <span className="font-mono text-[10px] font-black bg-[#FF5A36] text-white px-2 py-0.5 rounded-none uppercase">
                  FOUNDER
                </span>
                <h3 className="font-display font-black text-2xl xl:text-3xl text-black mt-1 uppercase tracking-tight">
                  Divyanshi Jain
                </h3>
                <p className="font-mono text-[10px] text-gray-500 uppercase font-bold mt-1">
                  Movement Architect &amp; Visionary
                </p>
              </div>
            </motion.div>

            {/* Co-Founder Card */}
            <motion.div
              whileHover={{ rotate: 1, scale: 1.02 }}
              className="bg-white border-4 border-black p-6 brutal-shadow-sm flex items-center gap-5 rounded-none bg-ajp-white"
            >
              <div className="w-16 h-16 bg-black text-ajp-blue flex items-center justify-center font-display font-black text-2xl border-2 border-black rounded-none shadow-[2px_2px_0px_#111111] select-none shrink-0">
                PJ
              </div>
              <div>
                <span className="font-mono text-[10px] font-black bg-[#2563EB] text-white px-2 py-0.5 rounded-none uppercase">
                  CO-FOUNDER
                </span>
                <h3 className="font-display font-black text-2xl xl:text-3xl text-black mt-1 uppercase tracking-tight">
                  Priyam Jain
                </h3>
                <p className="font-mono text-[10px] text-gray-500 uppercase font-bold mt-1">
                  System Architect &amp; Co-Creator
                </p>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
};
