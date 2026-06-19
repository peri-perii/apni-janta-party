import React from "react";
import { motion } from "motion/react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "massive";
  animated?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  size = "md",
  animated = true,
}) => {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-14 h-14",
    lg: "w-24 h-24",
    xl: "w-36 h-36",
    massive: "w-56 h-56 xl:w-72 xl:h-72",
  };

  const containerAnimations = animated
    ? {
        hover: { scale: 1.05, rotate: -3 },
        tap: { scale: 0.95, rotate: 3 },
      }
    : {};

  return (
    <motion.div
      className={`relative inline-block ${sizeMap[size]} ${className}`}
      whileHover={animated ? "hover" : undefined}
      whileTap={animated ? "tap" : undefined}
      variants={containerAnimations}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[2px_2px_0px_rgba(17,17,17,1)]"
        aria-label="APNI JANTA PARTY Logo"
      >
        {/* Flame Background: Actively getting extinguished (faded/submerged below water checkmark) */}
        <motion.path
          d="M 68 78 C 68 55, 88 50, 75 30 C 65 42, 60 52, 60 62 C 55 52, 45 48, 52 78 Z"
          fill="#FF5A36"
          stroke="#111111"
          strokeWidth="3.5"
          strokeLinejoin="round"
          animate={
            animated
              ? {
                  y: [0, -2, 0],
                  scaleY: [1, 0.9, 1.1, 1],
                  skewX: [-2, 2, -1, 0],
                  opacity: [0.95, 0.85, 1, 0.95],
                }
              : {}
          }
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Small rising dynamic smoke lines */}
        {animated && (
          <>
            <motion.path
              d="M 65 24 Q 63 18, 66 14"
              stroke="#111111"
              strokeWidth="2"
              strokeLinecap="round"
              animate={{ y: [-3, -15], opacity: [0.8, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
            />
            <motion.path
              d="M 72 26 Q 74 20, 72 16"
              stroke="#111111"
              strokeWidth="2"
              strokeLinecap="round"
              animate={{ y: [-2, -12], opacity: [0.8, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: 0.7 }}
            />
          </>
        )}

        {/* The Splashing Water pouring from bucket and forming a distinct CHECKMARK (✓) */}
        {/* Left side of checkmark: 35 34 down to 50 63, Right side extending up to 66 45 */}
        <motion.path
          d="M 28 35 L 42 63 L 64 38 M 42 63 C 50 65, 58 60, 68 76 L 62 78 C 50 72, 42 68, 38 72 Z"
          fill="#2563EB"
          stroke="#111111"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={
            animated
              ? {
                  rotate: [0, -1, 1, 0],
                  scaleY: [1, 1.02, 0.98, 1],
                }
              : {}
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Splashing small droplets (Checkmark dynamic splatters) */}
        <circle cx="21" cy="38" r="3.5" fill="#2563EB" stroke="#111111" strokeWidth="2.5" />
        <circle cx="58" cy="32" r="3" fill="#FFD600" stroke="#111111" strokeWidth="2.5" />
        <circle cx="45" cy="72" r="2.5" fill="#2563EB" stroke="#111111" strokeWidth="2" />
        <circle cx="34" cy="54" r="2" fill="#FFFFFF" stroke="#111111" strokeWidth="2" />

        {/* The Bucket: The hero taking action. Styled bold, tilted pouring down */}
        <motion.g
          animate={
            animated
              ? {
                  rotate: [0, -4, 2, 0],
                }
              : {}
          }
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Bucket handle */}
          <path
            d="M 12 40 C 6 25, 28 15, 34 32"
            fill="none"
            stroke="#111111"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Bucket main structural geometry */}
          <polygon
            points="14,35 38,24 48,50 25,60"
            fill="#FFD600"
            stroke="#111111"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Highlight / shadow line on bucket */}
          <line
            x1="22" y1="31"
            x2="33" y2="56"
            stroke="#111111"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Metal rim accent on bucket top */}
          <polygon
            points="14,35 38,24 35,28 11,39"
            fill="#FFFFFF"
            stroke="#111111"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </motion.g>
      </svg>
    </motion.div>
  );
};
