import React from "react";
import { motion } from "motion/react";

interface AjpFlagProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const AjpFlag: React.FC<AjpFlagProps> = ({ size = "md", className = "" }) => {
  const sizeMap = {
    sm: { width: "w-20", height: "h-12", pole: "h-20", container: "h-20" },
    md: { width: "w-36", height: "h-24", pole: "h-36", container: "h-36" },
    lg: { width: "w-56", height: "h-36", pole: "h-56", container: "h-56" },
    xl: { width: "w-72", height: "h-48", pole: "h-72", container: "h-72" },
  };

  const selectedSize = sizeMap[size];

  // Rippling waviness for the flag body
  const waveTransition = {
    y: {
      duration: 2.2,
      repeat: Infinity,
      ease: "easeInOut",
    },
    skewY: {
      duration: 2.2,
      repeat: Infinity,
      ease: "easeInOut",
    },
    scaleX: {
      duration: 4.4,
      repeat: Infinity,
      ease: "easeInOut",
    }
  };

  return (
    <div className={`relative flex items-start select-none ${className} ${selectedSize.container}`}>
      {/* Structural Flagpole - Neo-Brutalist Solid Black */}
      <div className="flex flex-col items-center mr-[2px] z-10 shrink-0">
        {/* Flagpole Knob/Finial */}
        <div className="w-3 h-3 bg-ajp-yellow border-2 border-black rounded-full shadow-[1px_1px_0px_#111111]" />
        {/* Pole Body */}
        <div className={`w-1.5 bg-black border-l border-white/20 rounded-b-sm ${selectedSize.pole}`} />
      </div>

      {/* Flag Canvas body */}
      <motion.div
        animate={{
          y: [0, -4, 2, 0],
          skewY: [-1.5, 1.5, -1, -1.5],
          scaleX: [1, 0.98, 1.02, 1],
        }}
        transition={waveTransition}
        className={`relative ${selectedSize.width} ${selectedSize.height} border-4 border-black bg-white flex flex-col overflow-hidden brutal-shadow-sm rounded-none origin-left`}
      >
        {/* Top Stripe: AJP Orange */}
        <div className="h-1/3 bg-ajp-orange border-b-2 border-black flex items-center justify-center font-mono text-[9px] font-black text-white tracking-widest uppercase">
          AWAZ HAR JANTA KI
        </div>

        {/* Middle Stripe: White (featuring our sacred bucket emblem) */}
        <div className="h-1/3 bg-white flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <span className="font-display font-black text-xs tracking-wider">AJP</span>
          </div>

          {/* Simple Vectorized Bucket Emblem */}
          <div className="relative w-8 h-8 flex items-center justify-center bg-ajp-yellow border-2 border-black rounded-none shadow-[1px_1px_0px_rgba(0,0,0,1)] z-10">
            {/* Handle arc */}
            <span className="absolute -top-1 w-4 h-2 border-t-2 border-x-2 border-black rounded-t-full" />
            <span className="font-display font-black text-[10px] text-black tracking-tighter select-none">AJP</span>
          </div>
        </div>

        {/* Bottom Stripe: AJP Blue */}
        <div className="h-1/3 bg-ajp-blue border-t-2 border-black flex items-center justify-center font-mono text-[8.5px] font-black text-white tracking-wider uppercase">
          APNI JANTA PARTY
        </div>

        {/* Dynamic Shadow Gradients overlay to simulate rippling folds in the flag */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-black/10 to-transparent mix-blend-multiply" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/10 via-transparent to-black/15" />
      </motion.div>
    </div>
  );
};
