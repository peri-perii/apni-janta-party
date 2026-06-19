import React from "react";
import { Logo } from "./Logo";
import { ArrowUp, Github, Heart, MessageSquare } from "lucide-react";

export const Footer: React.FC = () => {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-ajp-black text-white py-16 px-4 border-t-6 border-black relative select-none">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Grid Wrapper */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start pb-12 border-b-2 border-white/10">
          
          {/* Column 1: Huge Branding (6 cols) */}
          <div className="md:col-span-6 space-y-6">
            <div className="flex items-center gap-4">
              <Logo size="md" className="filter invert brightness-100" animated={true} />
              <div>
                <h3 className="font-display font-black text-2xl xl:text-3xl leading-none uppercase tracking-tight text-white">
                  APNI JANTA PARTY
                </h3>
                <span className="font-mono text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Awaaz Har Janta Ki.
                </span>
              </div>
            </div>

            {/* Slogan */}
            <p className="font-display font-bold text-xl md:text-2xl text-ajp-yellow tracking-tight leading-snug">
              "We don't create problems. <br className="hidden sm:inline" />
              We solve them."
            </p>

            <span className="block font-mono text-[11px] text-gray-500 uppercase">
              APNI JANTA PARTY (AJP) IS A PEOPLE-FIRST MOVEMENT RECRUITING BUILDERS, CODE HACKERS, DREAMERS, AND ARTISTS TO ACTION OVER EXCUSES. NOT AN OFFICIAL CAMPAIGN PORTAL.
            </span>
          </div>

          {/* Column 2: Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-mono text-xs font-black bg-white text-black px-2 py-0.5 inline-block uppercase leading-none rounded-none">
              NAVIGATION
            </h4>
            <ul className="space-y-2 font-mono text-xs font-bold uppercase tracking-wider text-gray-400">
              <li>
                <a href="#about" className="hover:text-ajp-yellow hover:underline block py-0.5">Who We Are</a>
              </li>
              <li>
                <a href="#manifesto" className="hover:text-ajp-yellow hover:underline block py-0.5">Manifesto Laws</a>
              </li>
              <li>
                <a href="#burning" className="hover:text-ajp-yellow hover:underline block py-0.5">What's Burning?</a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-ajp-yellow hover:underline block py-0.5">The Solution Board</a>
              </li>
              <li>
                <a href="#people" className="hover:text-ajp-yellow hover:underline block py-0.5">Roster Ranks</a>
              </li>
              <li>
                <a href="#events" className="hover:text-ajp-yellow hover:underline block py-0.5">Field Meets</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Links (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-mono text-xs font-black bg-white text-black px-2 py-0.5 inline-block uppercase leading-none rounded-none">
              CONNECT &amp; FORK
            </h4>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-white bg-zinc-900 hover:bg-white hover:text-black transition-colors"
                title="Fork code repository"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-white bg-zinc-900 hover:bg-white hover:text-black transition-colors"
                title="Join conversation server"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
            
            <div className="pt-2">
              <span className="block font-mono text-[9px] text-gray-500 uppercase leading-none">
                LICENSE OVERVIEW:
              </span>
              <p className="font-mono text-[10px] text-gray-300 mt-1 uppercase font-bold leading-normal">
                APACHE-2.0 CODES OPEN SOURCE // JANTA DECREES 2026.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar Credits */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-[10px] text-gray-500 uppercase tracking-widest font-bold">
          <div className="flex items-center gap-1.5 flex-wrap justify-center text-center sm:text-left">
            <span>© 2026 APNI JANTA PARTY (AJP)</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-ajp-orange">
              BUILT WITH GRIT <Heart className="w-3.5 h-3.5 fill-ajp-orange stroke-none" /> BY SOLVERS
            </span>
          </div>

          <button
            onClick={handleScrollTop}
            className="bg-white hover:bg-ajp-yellow text-black border-2 border-black p-2.5 shadow-[2px_2px_0px_rgba(255,255,255,1)] flex items-center justify-center gap-1.5 cursor-pointer rounded-none active:translate-y-1 hover:shadow-none"
            title="Scroll back to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span className="text-[9px] font-black uppercase">TOP</span>
          </button>
        </div>

      </div>
    </footer>
  );
};
