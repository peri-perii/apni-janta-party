import React, { useState, useEffect } from "react";
import { Logo } from "./Logo";
import { Menu, X, Flame, ShieldAlert, Award, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  onJoinClick: () => void;
  onReportClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onJoinClick, onReportClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bucketAlert, setBucketAlert] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { title: "Manifesto", href: "#manifesto" },
    { title: "What's Burning?", href: "#burning" },
    { title: "Solutions", href: "#solutions" },
    { title: "AJP Arcade", href: "#arcade" },
    { title: "Events", href: "#events" }
  ];

  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleSound = () => {
    setMuted(!muted);
    // Persist audio preferences in localState
    localStorage.setItem("ajp_audio_muted", String(!muted));
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
    // Play a friendly mechanical click synth
    if (muted) {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, audioContext.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start();
      osc.stop(audioContext.currentTime + 0.15);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 p-4 transition-all duration-300 ${
          scrolled ? "pt-2 pb-2" : "pt-4 md:pt-6"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Main header wrapper styled as a high-integrity Neo-Brutalist card */}
          <div className="bg-white border-4 border-brand-black brutal-border rounded-none p-3 px-4 md:px-6 flex items-center justify-between brutal-shadow bg-ajp-white">
            
            {/* Logo and Name Block */}
            <a href="#" className="flex items-center gap-3 group" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
              <Logo size="sm" animated={true} />
              <div className="flex flex-col">
                <span className="font-display font-black text-lg md:text-xl xl:text-2xl leading-none uppercase tracking-tight flex items-center gap-1.5">
                  APNI JANTA PARTY
                  <span className="text-xs bg-ajp-yellow brutal-border border-2 px-1 text-black font-mono font-bold rounded-none hidden sm:inline-block animate-pulse">
                    AJP
                  </span>
                </span>
                <span className="font-mono text-[9px] md:text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                  Awaaz Har Janta Ki.
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.title}
                  onClick={() => handleLinkClick(link.href)}
                  className="font-display font-bold text-sm uppercase px-2 py-1 border-b-4 border-transparent hover:border-ajp-yellow transition-all cursor-pointer text-ajp-black"
                >
                  {link.title}
                </button>
              ))}
            </nav>

            {/* Action Buttons Block */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Audio feedback indicator */}
              <button
                onClick={toggleSound}
                title={muted ? "Unmute click sounds" : "Mute click sounds"}
                className="p-2 border-2 border-black bg-white hover:bg-gray-100 cursor-pointer brutal-press rounded-none"
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Status indicator */}
              <motion.button
                onClick={() => setBucketAlert(!bucketAlert)}
                className="hidden xl:flex items-center gap-2 bg-ajp-black text-ajp-yellow brutal-border border-2 p-1.5 px-3 font-mono text-[11px] font-bold tracking-tight rounded-none relative cursor-help hover:bg-yellow-400 hover:text-black hover:border-black transition-colors"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ repeat: Infinity, duration: 4 }}
              >
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping absolute -top-1 -right-1 border border-black" />
                <span>⚡ STATUS: ACTIVE & BUILDING</span>
              </motion.button>

              <button
                onClick={onJoinClick}
                className="bg-ajp-yellow text-ajp-black font-display font-extrabold text-xs uppercase brutal-border border-2 p-2 px-4 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all cursor-pointer active:translate-x-[2px] active:translate-y-[2px]"
              >
                JOIN THE MOVEMENT
              </button>
            </div>

            {/* Mobile Actions Overlay */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={onJoinClick}
                className="sm:hidden bg-ajp-yellow text-ajp-black font-display font-extrabold text-xs uppercase border-2 border-black p-1.5 px-3 cursor-pointer"
              >
                JOIN
              </button>
              
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 brutal-border border-2 bg-white brutal-press rounded-none text-ajp-black cursor-pointer"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Dynamic Pop-up warning when they click the BUCKET LEVEL button */}
      <AnimatePresence>
        {bucketAlert && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed bottom-20 right-6 z-50 max-w-sm bg-ajp-yellow brutal-border border-4 p-5 brutal-shadow-md rounded-none font-mono"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 text-brand-black">
                <ShieldAlert className="w-5 h-5 text-red-500 fill-red-200" />
                <h4 className="font-extrabold text-sm uppercase">BUCKET DEPLOY READY</h4>
              </div>
              <button onClick={() => setBucketAlert(false)} className="text-black font-bold text-xs hover:underline uppercase">
                [CLOSE]
              </button>
            </div>
            <p className="text-xs text-black leading-relaxed">
              We have completed deployment calculations. The bucket is prepped with <strong>100% Volume Solutions (H2O)</strong>. Use the hover bucket widgets to locate and extinguish active system problems on the page!
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => { setBucketAlert(false); onReportClick(); }}
                className="bg-black text-white text-[11px] p-1.5 px-3 hover:bg-gray-800 uppercase font-mono font-bold border-2 border-black"
              >
                REPORT NEW PROBLEM
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 flex items-start justify-end"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-4/5 max-w-sm h-full bg-white border-l-4 border-black p-6 pt-24 flex flex-col justify-between bg-ajp-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                <div className="border-b-4 border-black pb-4">
                  <span className="font-mono text-xs font-bold text-black uppercase block tracking-widest text-center">
                    Awaaz Har Janta Ki.
                  </span>
                </div>
                
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link, i) => (
                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={link.title}
                      onClick={() => handleLinkClick(link.href)}
                      className="font-display font-black text-xl uppercase p-3 border-2 border-black bg-white hover:bg-ajp-yellow brutal-shadow text-left text-ajp-black"
                    >
                      {link.title}
                    </motion.button>
                  ))}
                </nav>
              </div>

              <div className="space-y-3 pt-6 border-t-4 border-black">
                <button
                  onClick={() => { setIsOpen(false); onJoinClick(); }}
                  className="w-full bg-ajp-yellow text-ajp-black font-display font-extrabold text-base uppercase brutal-border border-2 p-3 text-center"
                >
                  JOIN THE MOVEMENT
                </button>
                <div className="flex justify-center gap-4 text-xs font-mono font-bold text-gray-500">
                  <a href="#manifesto" onClick={() => handleLinkClick("#manifesto")} className="hover:underline">Manifesto</a>
                  <span>•</span>
                  <a href="#burning" onClick={() => handleLinkClick("#burning")} className="hover:underline">Solve Fires</a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
