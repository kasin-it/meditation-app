"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { saveSession } from "@/lib/api";

export type Phase = "inhale" | "hold-in" | "exhale" | "hold-out";

export type BreathingPattern = {
  id?: string;
  name: string;
  inhale: number;
  holdIn: number;
  exhale: number;
  holdOut: number;
};

const DEFAULT_PATTERN: BreathingPattern = {
  name: "Box Breathing",
  inhale: 4,
  holdIn: 4,
  exhale: 4,
  holdOut: 4,
};

interface BreathingTimerProps {
  pattern?: BreathingPattern;
  onExit?: () => void;
}

export default function BreathingTimer({
  pattern = DEFAULT_PATTERN,
  onExit,
}: BreathingTimerProps) {
  const [phase, setPhase] = useState<Phase>("inhale");
  const [timeLeft, setTimeLeft] = useState(pattern.inhale);
  const [isActive, setIsActive] = useState(false);
  const startTimeRef = useRef<number | null>(null);

  // Auto-start
  useEffect(() => {
    setIsActive(true);
    startTimeRef.current = Date.now();
  }, []);

  const handleExit = async () => {
    if (startTimeRef.current) {
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
      // Only save if session was longer than 10 seconds
      if (duration > 10) {
        await saveSession({
          duration,
          patternId: pattern.id || "unknown",
        });
      }
    }
    onExit?.();
  };

  const getNextPhase = useCallback((current: Phase): Phase => {
    switch (current) {
      case "inhale":
        return pattern.holdIn > 0 ? "hold-in" : "exhale";
      case "hold-in":
        return "exhale";
      case "exhale":
        return pattern.holdOut > 0 ? "hold-out" : "inhale";
      case "hold-out":
        return "inhale";
      default:
        return "inhale";
    }
  }, [pattern]);

  const getDuration = useCallback((p: Phase): number => {
    switch (p) {
      case "inhale": return pattern.inhale;
      case "hold-in": return pattern.holdIn;
      case "exhale": return pattern.exhale;
      case "hold-out": return pattern.holdOut;
    }
  }, [pattern]);

  useEffect(() => {
    if (!isActive) return;

    const duration = getDuration(phase);
    setTimeLeft(duration);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Determine next phase
          setPhase((curr) => getNextPhase(curr));
          return 0; // Visual placeholder until effect re-runs
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, isActive, getDuration, getNextPhase]);

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
      transition: { duration: pattern.inhale, ease: "easeInOut" as const },
    },
    "hold-in": {
      scale: [1.5, 1.55, 1.5],
      opacity: 0.9,
      transition: {
        duration: pattern.holdIn,
        ease: "easeInOut" as const,
        repeat: Infinity,
        repeatType: "mirror" as const,
      },
    },
    exhale: {
      scale: 1,
      opacity: 0.6,
      transition: { duration: pattern.exhale, ease: "easeInOut" as const },
    },
    "hold-out": {
      scale: [1, 1.05, 1],
      opacity: 0.6,
      transition: {
        duration: pattern.holdOut,
        ease: "easeInOut" as const,
        repeat: Infinity,
        repeatType: "mirror" as const,
      },
    },
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden font-sans text-white p-4">
      {/* Content Container */}
      <div className="z-10 flex flex-col items-center justify-center gap-8 sm:gap-12">
        
        {/* Text: Instruction */}
        <motion.h1
          key={phase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-3xl font-medium tracking-[0.2em] text-white sm:text-5xl text-center"
        >
          {getInstruction(phase)}
        </motion.h1>

        {/* The Halo */}
        <div className="relative flex items-center justify-center py-4 sm:py-8">
          <motion.div
            variants={haloVariants}
            animate={phase}
            className="h-48 w-48 sm:h-64 sm:w-64 rounded-full border border-cyan-500/30 bg-transparent"
            style={{
              boxShadow:
                "0 0 20px #4DEEEA, 0 0 60px rgba(77, 238, 234, 0.4), inset 0 0 10px rgba(77, 238, 234, 0.1)",
            }}
          />
        </div>

        {/* Timer */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-lg sm:text-xl font-light text-[#E0E0E0] opacity-80">
            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </span>
        </div>

        {onExit && (
           <button onClick={handleExit} className="mt-6 sm:mt-8 text-xs sm:text-sm text-white/50 hover:text-white transition-colors uppercase tracking-widest">
             End Session
           </button>
        )}
      </div>
    </div>
  );
}
