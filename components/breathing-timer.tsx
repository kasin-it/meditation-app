"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

type Phase = "inhale" | "hold-in" | "exhale" | "hold-out";

const CYCLE_DURATION = 4; // seconds per phase

export default function BreathingTimer() {
  const [phase, setPhase] = useState<Phase>("inhale");
  const [timeLeft, setTimeLeft] = useState(CYCLE_DURATION);

  // Timer and Phase Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Transition to next phase
          setPhase((currentPhase) => {
            switch (currentPhase) {
              case "inhale":
                return "hold-in";
              case "hold-in":
                return "exhale";
              case "exhale":
                return "hold-out";
              case "hold-out":
                return "inhale";
              default:
                return "inhale";
            }
          });
          return CYCLE_DURATION;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Text Helpers
  const getInstruction = (p: Phase) => {
    switch (p) {
      case "inhale":
        return "INHALE";
      case "hold-in":
      case "hold-out":
        return "HOLD";
      case "exhale":
        return "EXHALE";
    }
  };

  // Framer Motion Variants
  const haloVariants = {
    inhale: {
      scale: 1.5,
      opacity: 1,
      transition: { duration: CYCLE_DURATION, ease: "easeInOut" },
    },
    "hold-in": {
      scale: [1.5, 1.55, 1.5], // Subtle pulse
      opacity: 0.9,
      transition: {
        duration: CYCLE_DURATION,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror" as const,
      },
    },
    exhale: {
      scale: 1,
      opacity: 0.6, // Slightly dim as it contracts
      transition: { duration: CYCLE_DURATION, ease: "easeInOut" },
    },
    "hold-out": {
      scale: [1, 1.05, 1], // Subtle pulse at smaller size
      opacity: 0.6,
      transition: {
        duration: CYCLE_DURATION,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror" as const,
      },
    },
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#050507] font-sans text-white">
      {/* Grain Texture Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content Container */}
      <div className="z-10 flex flex-col items-center justify-center gap-12">
        
        {/* Text: Instruction */}
        <motion.h1
          key={phase} // Re-animate on phase change
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-4xl font-medium tracking-[0.2em] text-white sm:text-5xl"
        >
          {getInstruction(phase)}
        </motion.h1>

        {/* The Halo */}
        <div className="relative flex items-center justify-center py-8">
          {/* Glow effects */}
          <motion.div
            variants={haloVariants}
            animate={phase}
            className="h-64 w-64 rounded-full border border-cyan-500/30 bg-transparent"
            style={{
              boxShadow:
                "0 0 20px #4DEEEA, 0 0 60px rgba(77, 238, 234, 0.4), inset 0 0 10px rgba(77, 238, 234, 0.1)",
            }}
          />
          
          {/* Inner "Void" Circle (Optional for more depth or just keep simple) */}
        </div>

        {/* Timer */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-xl font-light text-[#E0E0E0] opacity-80">
            00:0{timeLeft}
          </span>
        </div>
      </div>
    </div>
  );
}

