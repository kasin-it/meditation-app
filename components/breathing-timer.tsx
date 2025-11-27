"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { saveSession } from "@/lib/api";
import { BreathingPattern } from "@/lib/patterns";
import { ChevronUp, ChevronDown } from "lucide-react";

export type Phase = "inhale" | "hold-in" | "exhale" | "hold-out";

const DEFAULT_PATTERN: BreathingPattern = {
  id: "box",
  name: "Box Breathing",
  description: "Focus • Stress Relief",
  defaultRepetitions: 10,
  loopSteps: [
    { name: "inhale", duration: 4 },
    { name: "hold", duration: 4 },
    { name: "exhale", duration: 4 },
    { name: "hold", duration: 4 },
  ],
};

interface BreathingTimerProps {
  pattern?: BreathingPattern;
  initialRepetitions?: number;
  onExit?: () => void;
}

interface WakeLockSentinel extends EventTarget {
  released: boolean;
  type: "screen";
  release: () => Promise<void>;
}

export default function BreathingTimer({
  pattern = DEFAULT_PATTERN,
  initialRepetitions,
  onExit,
}: BreathingTimerProps) {
  const [phase, setPhase] = useState<Phase>("inhale");
  const [repetitions, setRepetitions] = useState(initialRepetitions || pattern.defaultRepetitions);
  const [currentRepetition, setCurrentRepetition] = useState(0);

  // Calculate total duration based on current repetitions
  const totalDuration = useMemo(() => {
    const initialDuration = pattern.initialSteps?.reduce((acc, step) => acc + step.duration, 0) || 0;
    const loopDuration = pattern.loopSteps.reduce((acc, step) => acc + step.duration, 0);
    const finalDuration = pattern.finalSteps?.reduce((acc, step) => acc + step.duration, 0) || 0;
    return initialDuration + (loopDuration * repetitions) + finalDuration;
  }, [pattern, repetitions]);

  // Format duration as MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Helper to extract duration from loopSteps for backward compatibility
  // This is a temporary adapter to keep the visual timer working with the new structure
  // It assumes standard cycles: inhale -> [hold] -> exhale -> [hold]
  const getDurationForPhase = useCallback((p: Phase) => {
    const inhaleStep = pattern.loopSteps.find(s => s.name === "inhale");
    const exhaleStep = pattern.loopSteps.find(s => s.name === "exhale");
    
    // Find hold steps
    const inhaleIndex = pattern.loopSteps.findIndex(s => s.name === "inhale");
    const exhaleIndex = pattern.loopSteps.findIndex(s => s.name === "exhale");
    
    // Hold-in is typically after inhale
    let holdInStep = null;
    if (inhaleIndex !== -1) {
      const next = pattern.loopSteps[inhaleIndex + 1];
      if (next && next.name === "hold") holdInStep = next;
    }

    // Hold-out is typically after exhale
    let holdOutStep = null;
    if (exhaleIndex !== -1) {
      const next = pattern.loopSteps[exhaleIndex + 1];
      if (next && next.name === "hold") holdOutStep = next;
    }

    switch (p) {
      case "inhale": return inhaleStep?.duration || 4;
      case "hold-in": return holdInStep?.duration || 0;
      case "exhale": return exhaleStep?.duration || 4;
      case "hold-out": return holdOutStep?.duration || 0;
    }
  }, [pattern]);

  const [timeLeft, setTimeLeft] = useState(getDurationForPhase("inhale"));
  const [isActive, setIsActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  // Auto-start
  useEffect(() => {
    setIsActive(true);
    startTimeRef.current = Date.now();
  }, []);

  // Wake Lock
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          type WakeLockAPI = { request: (type: 'screen') => Promise<WakeLockSentinel> };
          type NavigatorWithWakeLock = { wakeLock: WakeLockAPI };
          const nav = navigator as unknown as NavigatorWithWakeLock;
          wakeLock = await nav.wakeLock.request('screen');
        }
      } catch (err) {}
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isActive) requestWakeLock();
    };
    if (isActive) {
      requestWakeLock();
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }
    return () => {
      if (wakeLock) wakeLock.release().catch(() => {});
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive]);

  const handleExit = async () => {
    if (startTimeRef.current) {
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
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
    const holdInDuration = getDurationForPhase("hold-in");
    const holdOutDuration = getDurationForPhase("hold-out");

    switch (current) {
      case "inhale":
        return holdInDuration > 0 ? "hold-in" : "exhale";
      case "hold-in":
        return "exhale";
      case "exhale":
        return holdOutDuration > 0 ? "hold-out" : "inhale";
      case "hold-out":
        return "inhale";
      default:
        return "inhale";
    }
  }, [getDurationForPhase]);

  useEffect(() => {
    if (!isActive) return;

    const duration = getDurationForPhase(phase);
    setTimeLeft(duration);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Determine next phase
          const next = getNextPhase(phase);
          
          // If we completed a full cycle (back to inhale), increment rep count
          if (next === "inhale") {
             setCurrentRepetition(c => c + 1);
             // Check if we finished all reps
             if (currentRepetition >= repetitions - 1) {
                // We're done!
                handleExit();
                setIsActive(false);
                return 0;
             }
          }

          setPhase(next);
          return 0; 
        }
        return prev - 1;
      });
      setElapsedTime(e => e + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, isActive, getDurationForPhase, getNextPhase, repetitions, currentRepetition]); // Added deps for termination logic

  // Text Helpers
  const getInstruction = (p: Phase) => {
    switch (p) {
      case "inhale": return "INHALE";
      case "hold-in":
      case "hold-out": return "HOLD";
      case "exhale": return "EXHALE";
    }
  };

  // Framer Motion Variants
  const haloVariants = {
    inhale: {
      scale: 1.5,
      opacity: 1,
      transition: { duration: getDurationForPhase("inhale"), ease: "easeInOut" as const },
    },
    "hold-in": {
      scale: [1.5, 1.55, 1.5],
      opacity: 0.9,
      transition: {
        duration: getDurationForPhase("hold-in"),
        ease: "easeInOut" as const,
        repeat: Infinity,
        repeatType: "mirror" as const,
      },
    },
    exhale: {
      scale: 1,
      opacity: 0.6,
      transition: { duration: getDurationForPhase("exhale"), ease: "easeInOut" as const },
    },
    "hold-out": {
      scale: [1, 1.05, 1],
      opacity: 0.6,
      transition: {
        duration: getDurationForPhase("hold-out"),
        ease: "easeInOut" as const,
        repeat: Infinity,
        repeatType: "mirror" as const,
      },
    },
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden font-sans text-white p-4">
      {/* Settings / Stats Overlay */}
      <div className="absolute top-6 left-0 right-0 flex justify-between px-6 sm:px-12 z-20 text-white/40 text-xs tracking-widest">
         <div className="flex flex-col items-start gap-1">
            <span>REPETITIONS</span>
            <div className="flex items-center gap-2 text-white">
               <span className="min-w-[2ch] text-left font-mono">{repetitions}</span>
            </div>
         </div>
         <div className="flex flex-col items-end gap-1">
            <span>TOTAL TIME</span>
            <span className="text-white font-mono">{formatDuration(totalDuration)}</span>
         </div>
      </div>

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
            {timeLeft < 10 ? `00:0${timeLeft}` : `00:${timeLeft}`}
          </span>
          <span className="text-[10px] tracking-widest text-white/30">
             REP {currentRepetition + 1} / {repetitions}
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
