import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Hammer, Sparkles, Code, Volume2, UserCheck, Smile } from "lucide-react";
import { Member } from "../types";

export const ThePeople: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [localClaims, setLocalClaims] = useState<{ name: string; role: string }[]>([]);

  const defaultMembers: Member[] = [
    {
      id: "p-1",
      name: "KABIR CHOUDHURY",
      role: "CODE ARCHITECT // DEVELOPER",
      quote: "Arguing on Twitter about municipal water is easy. Compiling an open-source warning dashboard in node.js is actual work.",
      contribution: "Designed BALTI-OS framework and automated API integration checklists.",
      energyLevel: 98,
    },
    {
      id: "p-2",
      name: "PRIYA VASUDEVAN",
      role: "MUNICIPAL HACKER // ORGANIZER",
      quote: "I was tired of waiting for green park permits. We pooled ten builders, bought materials, and set up solar grids in one weekend.",
      contribution: "Sparked the Sector 4 Solar Alley Hacking Protocol with local youth.",
      energyLevel: 95,
    },
    {
      id: "p-3",
      name: "Dr. AMIR SYED",
      role: "STRESS DISMANTLER // MEDIC",
      quote: "Burnout is not a badge of honor. Our mental health schemes provide quiet rooms, meditation kits, and zero-screen hack nights.",
      contribution: "Championed the Chinta Ta Chita Chita well-being campaign.",
      energyLevel: 89,
    },
    {
      id: "p-4",
      name: "TANVI RAO",
      role: "ALT VISUALIST // ARTIST",
      quote: "A rebellious movement requires rebellious design. We paint alleys with checkmark buckets to mark solved local challenges.",
      contribution: "Designed AJP's vector manual, merchandise styles, and wall stencils.",
      energyLevel: 92,
    },
    {
      id: "p-5",
      name: "SAMAR SINGH",
      role: "LOGISTICS HEAVY // ATHLETE",
      quote: "Physical problems require physical action. If a public tap is leaking, grab a custom gasket, run to the main valve, and fix it.",
      contribution: "Discharged 2,800 canvas tool bundles and manual seeds to families.",
      energyLevel: 96,
    },
    {
      id: "p-6",
      name: "MEGHA NAYAK",
      role: "VENTURE EXPERIMENTER // FOUNDER",
      quote: "If a startup product takes one year of research to build, it's already dead. Experiment fast, ship within a month, see what breaks.",
      contribution: "Structured the Zero-Bureaucracy micro-grant sandbox engine.",
      energyLevel: 94,
    }
  ];

  useEffect(() => {
    // Load local pin claims to merge them here dynamically!
    // This connects Section 2 form to Section 7 member list!
    const savedPins = localStorage.getItem("ajp_janta_pins");
    if (savedPins) {
      try {
        const parsed = JSON.parse(savedPins);
        const mappedClaims = parsed.map((p: any) => ({
          name: p.name.toUpperCase(),
          role: p.role.toUpperCase() + " // MOVEMENT MEMBER",
        }));
        setLocalClaims(mappedClaims);
      } catch (_) {}
    }
    setMembers(defaultMembers);
  }, []);

  // Watch for local pins changes periodically
  useEffect(() => {
    const checkPins = () => {
      const savedPins = localStorage.getItem("ajp_janta_pins");
      if (savedPins) {
        try {
          const parsed = JSON.parse(savedPins);
          const mappedClaims = parsed.map((p: any) => ({
            name: p.name.toUpperCase(),
            role: p.role.toUpperCase() + " // MOVEMENT MEMBER",
          }));
          setLocalClaims(mappedClaims);
        } catch (_) {}
      }
    };
    const interval = setInterval(checkPins, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="people" className="py-24 px-4 bg-white border-b-6 border-black bg-ajp-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Editorial Heading */}
        <div className="border-4 border-black p-6 md:p-8 mb-16 bg-white shadow-[8px_8px_0px_#2563EB] max-w-4xl bg-ajp-white">
          <span className="font-mono text-xs font-black bg-ajp-blue text-white px-3 py-1 rounded-none uppercase inline-block mb-3">
            SECTION 06 // ACTIVE EMBASSY
          </span>
          <h2 className="font-display font-black text-4xl sm:text-6xl uppercase leading-none text-black">
            MEET THE BUILDERS.
          </h2>
          <p className="font-sans font-semibold text-gray-700 text-lg mt-4 max-w-2xl">
            We are not a panel of career politicians. We are devs, artists, athletes, healers, and founders pulling the workload.
          </p>
        </div>

        {/* Members Roster Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Dynamic rendering of Local Claims first (User generated!) */}
          <AnimatePresence>
            {localClaims.map((claim, idx) => (
              <motion.div
                key={`claim-${claim.name}`}
                initial={{ scale: 0.9, rotate: -4, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-ajp-yellow border-4 border-black p-6 flex flex-col justify-between min-h-[360px] shadow-[6px_6px_0px_#111111] rounded-none group hover:-translate-y-2 transition-transform"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[9px] font-black bg-black text-white px-2 py-0.5 rounded-none uppercase">
                      ★ CHIP IN SEAT ✓
                    </span>
                    <span className="font-mono text-xs font-bold text-red-500">NEW ENROLL</span>
                  </div>

                  <h3 className="font-display font-black text-2xl tracking-tight leading-none text-black break-words uppercase">
                    {claim.name}
                  </h3>
                  <span className="block font-mono text-[10px] font-black uppercase text-gray-700 mt-2">
                    {claim.role}
                  </span>

                  <div className="mt-6 border-l-4 border-black pl-4">
                    <p className="font-sans font-semibold text-sm italic text-gray-800">
                      "I signed my name to the APNI JANTA PARTY movement wall. I am here to build solutions rather than file complaints!"
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t-2 border-black/10 flex items-center justify-between">
                  <div className="font-mono text-[10px] uppercase font-bold text-gray-500">
                    CONTRIBUTION: PINNED PROFILE LIVE
                  </div>
                  <Smile className="w-5 h-5 text-black stroke-[2.5]" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Default Ambassadors */}
          {members.map((m, idx) => (
            <motion.div
              whileHover={{ y: -6 }}
              key={m.id}
              className="bg-white border-4 border-black p-6 flex flex-col justify-between min-h-[360px] brutal-shadow rounded-none group bg-ajp-white"
            >
              <div>
                {/* ID badge and energy reading */}
                <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-dashed border-gray-200">
                  <span className="font-mono text-[9px] font-black bg-black text-white px-2 py-0.5 rounded-none uppercase">
                    AJP AMBASSADOR // 00{idx + 1}
                  </span>
                  
                  {/* Custom energy meter widget */}
                  <div className="flex items-center gap-1.5" title={`Energy / Commit rate: ${m.energyLevel}%`}>
                    <span className="font-mono text-[9px] font-extrabold text-black">DRIVE:</span>
                    <div className="w-12 h-2.5 bg-gray-200 border border-black rounded-none overflow-hidden flex">
                      <div className="bg-ajp-blue h-full" style={{ width: `${m.energyLevel}%` }} />
                    </div>
                  </div>
                </div>

                {/* Name */}
                <h3 className="font-display font-black text-2xl xl:text-3xl leading-none tracking-tight text-black group-hover:text-ajp-blue transition-colors">
                  {m.name}
                </h3>

                {/* Subtitle Role */}
                <span className="block font-mono text-[10px] font-black uppercase text-gray-500 mt-1.5">
                  {m.role}
                </span>

                {/* Quote Box */}
                <div className="mt-6 border-l-4 border-black pl-4">
                  <p className="font-sans font-semibold text-sm italic text-gray-800 leading-relaxed">
                    "{m.quote}"
                  </p>
                </div>
              </div>

              {/* Roster story list details */}
              <div className="mt-8 pt-4 border-t-2 border-black flex flex-col gap-2">
                <span className="font-mono text-[9px] font-black uppercase text-gray-400 block leading-none">
                  INITIATED CONTRIBUTION:
                </span>
                <p className="font-sans text-xs font-semibold uppercase leading-snug text-black">
                  {m.contribution}
                </p>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
