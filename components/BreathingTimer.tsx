"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Plus } from "lucide-react";

type Phase = "inhale" | "hold-in" | "exhale" | "hold-out";

const CYCLE_DURATION = 4; // seconds per phase

export default function BreathingTimer() {
  const [phase, setPhase] = useState<Phase>("inhale");
  const [timeLeft, setTimeLeft] = useState(CYCLE_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [totalTime, setTotalTime] = useState(0); // in seconds

  // Timer and Phase Logic
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isActive) {
      timer = setInterval(() => {
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
        
        setTotalTime((prev) => prev + 1);
      }, 1000);
    } else if (!isActive && timer) {
      clearInterval(timer);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setPhase("inhale");
    setTimeLeft(CYCLE_DURATION);
    setTotalTime(0);
  };

  const addTime = () => {
    setTotalTime((prev) => prev + 60); // Add 1 minute
  };

  // Text Helpers
  const getInstruction = (p: Phase) => {
    if (!isActive) return "PAUSED";
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // PRIMARY CIRCLE VARIANTS (Constant Heartbeat Pulse)
  const primaryCircleVariants: Variants = {
    pulse: {
      scale: [1, 1.02, 1],
      opacity: [0.9, 1, 0.9],
      transition: {
        duration: 2,
        ease: "easeInOut" as const,
        repeat: Infinity,
        repeatType: "mirror" as const,
      },
    },
    paused: {
      scale: 1,
      opacity: 0.8,
      transition: { duration: 0.5 },
    },
  };

  // SECONDARY CIRCLE VARIANTS (Breathing Logic + Irregularity)
  const secondaryCircleVariants: Variants = {
    inhale: {
      scale: 1.8,
      opacity: 0.6,
      rotate: 10,
      borderRadius: ["50%", "45%", "50%"],
      transition: { duration: CYCLE_DURATION, ease: "easeInOut" as const },
    },
    "hold-in": {
      scale: [1.8, 1.85, 1.8],
      opacity: 0.7,
      rotate: 15,
      borderRadius: ["50%", "48%", "52%", "50%"],
      transition: {
        duration: CYCLE_DURATION,
        ease: "easeInOut" as const,
        repeat: Infinity,
        repeatType: "mirror" as const,
      },
    },
    exhale: {
      scale: 1.1,
      opacity: 0.3,
      rotate: 0,
      borderRadius: "50%",
      transition: { duration: CYCLE_DURATION, ease: "easeInOut" as const },
    },
    "hold-out": {
      scale: [1.1, 1.15, 1.1],
      opacity: 0.3,
      rotate: -5,
      borderRadius: ["50%", "52%", "48%", "50%"],
      transition: {
        duration: CYCLE_DURATION,
        ease: "easeInOut" as const,
        repeat: Infinity,
        repeatType: "mirror" as const,
      },
    },
    paused: {
      scale: 1,
      opacity: 0.2,
      rotate: 0,
      borderRadius: "50%",
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-transparent font-sans text-white">
      
      {/* Top Right: Total Time */}
      <div className="absolute top-8 right-8 z-20 flex items-center gap-2">
        <span className="text-sm font-light text-cyan-100/70 tracking-widest uppercase">Total Time</span>
        <span className="font-mono text-xl font-medium text-white">{formatTime(totalTime)}</span>
      </div>

      {/* Content Container */}
      <div className="z-10 flex flex-col items-center justify-center gap-12">
        
        {/* Text: Instruction */}
        <motion.h1
          key={isActive ? phase : "paused"} // Re-animate on phase change or pause
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-4xl font-medium tracking-[0.2em] text-white sm:text-5xl"
        >
          {getInstruction(phase)}
        </motion.h1>

        {/* The Halo Container */}
        <div className="relative flex items-center justify-center py-8 h-80 w-80">
          
          {/* SECONDARY CIRCLE (Background, Breathing, Irregular) */}
          <motion.div
            variants={secondaryCircleVariants}
            animate={isActive ? phase : "paused"}
            className="absolute top-0 left-0 h-full w-full rounded-full border border-cyan-400/30 bg-cyan-500/20 blur-md"
            style={{
                left: '50%', 
                top: '50%',
                x: '-50%',
                y: '-50%',
                width: '16rem',
                height: '16rem',
            }}
          />

          {/* PRIMARY CIRCLE (Foreground, Constant Pulse) */}
          <motion.div
            variants={primaryCircleVariants}
            animate={isActive ? "pulse" : "paused"}
            className="relative h-64 w-64 rounded-full border border-cyan-400/60 bg-cyan-950/80 backdrop-blur-sm"
            style={{
              boxShadow:
                "0 0 40px rgba(77, 238, 234, 0.3), inset 0 0 60px rgba(77, 238, 234, 0.1)",
            }}
          >
              {/* Inner detailed ring */}
              <div className="absolute inset-3 rounded-full border border-white/5"></div>
          </motion.div>
          
        </div>

        {/* Timer & Controls */}
        <div className="flex flex-col items-center gap-8">
          {/* Phase Timer */}
          <span className="font-mono text-2xl font-light text-[#E0E0E0] opacity-80">
            00:0{timeLeft}
          </span>

          {/* Controls */}
          <div className="flex items-center gap-4">
             {/* Start/Stop Button */}
            <Button
              onClick={toggleTimer}
              variant="outline"
              size="icon-lg"
              className="h-14 w-14 rounded-full border-cyan-500/50 bg-cyan-950/40 text-cyan-100 hover:bg-cyan-900/60 hover:text-white hover:border-cyan-400 transition-all duration-300"
            >
              {isActive ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current ml-1" />}
            </Button>

            {/* Paused Actions */}
            <AnimatePresence>
              {!isActive && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                  className="flex items-center gap-4"
                >
                  {/* Reset Button */}
                  <Button
                    onClick={resetTimer}
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full text-zinc-400 hover:text-white hover:bg-white/10"
                    title="Reset Session"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </Button>

                  {/* Add Time Button */}
                  <Button
                    onClick={addTime}
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-zinc-400 hover:text-white hover:bg-white/10 px-3"
                    title="Add 1 Minute"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    1m
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
