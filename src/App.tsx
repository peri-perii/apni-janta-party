import React, { useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { WhoWeAre } from "./components/WhoWeAre";
import { Manifesto } from "./components/Manifesto";
import { WhatsBurning } from "./components/WhatsBurning";
import { SolutionBoard } from "./components/SolutionBoard";
import { Impact } from "./components/Impact";
import { Events } from "./components/Events";
import { JoinMovement } from "./components/JoinMovement";
import { Footer } from "./components/Footer";
import { MascotWidget } from "./components/MascotWidget";

export default function App() {

  useEffect(() => {
    // Scroll restoration setting to top on initial boot
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    // Warm up Audio Context on manual user gesture triggers
    const warmUpAudio = () => {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
    };
    window.addEventListener("click", warmUpAudio, { once: true });
    return () => window.removeEventListener("click", warmUpAudio);
  }, []);

  const handleScrollToSection = (selector: string) => {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleJoinClick = () => {
    handleScrollToSection("#join");
  };

  const handleReportProblemClick = () => {
    handleScrollToSection("#burning");
    // Dispatch a custom event to tell WhatsBurning component to expand the log form
    const customEvent = new CustomEvent("ajp_open_report_form");
    window.dispatchEvent(customEvent);
  };

  return (
    <div className="relative min-h-screen bg-ajp-white text-ajp-black overflow-x-hidden font-sans select-none selection:bg-ajp-yellow selection:text-black">
      
      {/* Dynamic Navigation Header */}
      <Header
        onJoinClick={handleJoinClick}
        onReportClick={handleReportProblemClick}
      />

      {/* Main Sections Structure Stack */}
      <main className="relative">
        
        {/* SECTION 1: HERO */}
        <Hero
          onJoinClick={handleJoinClick}
          onManifestoClick={() => handleScrollToSection("#manifesto")}
        />

        {/* SECTION 2: WHO WE ARE */}
        <WhoWeAre />

        {/* SECTION 3: MANIFESTO */}
        <Manifesto />

        {/* SECTION 4: WHAT'S BURNING (Interactive Problem Board Wall) */}
        <WhatsBurning />

        {/* SECTION 5: SOLUTION BOARD */}
        <SolutionBoard />

        {/* SECTION 6: IMPACT counters metrics */}
        <Impact />

        {/* SECTION 8: EVENTS field meet schedule */}
        <Events />

        {/* SECTION 9: JOIN MOVEMENT massive CTAs forms */}
        <JoinMovement onReportProblemClick={handleReportProblemClick} />

      </main>

      {/* SECTION 10: MASSIVE BRAND FOOTER */}
      <Footer />

      {/* PERSISTENT PLAYFUL MASCOT: Balti-Ji (Bucket Helper) */}
      <MascotWidget />

    </div>
  );
}
