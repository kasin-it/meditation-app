"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BreathingMandalaProps {
  durationSeconds: number;
  onComplete: () => void;
}

export function BreathingMandala({ durationSeconds, onComplete }: BreathingMandalaProps) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [durationSeconds, onComplete]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Mandala Container */}
      <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] flex items-center justify-center">
        
        {/* Layer 1: Base Aura (Breathing) */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/5 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
        />

        {/* Layer 2: Outer Geometry */}
        <motion.div
          className="absolute w-full h-full border border-primary/20 rounded-full"
          animate={{ scale: [0.8, 1, 0.8], rotate: [0, 45, 0] }}
          transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
        />
        
        {/* Layer 3: Middle Geometry (Square rotated) */}
        <motion.div
          className="absolute w-[70%] h-[70%] border border-secondary/30"
          style={{ rotate: 45 }}
          animate={{ scale: [0.9, 1.1, 0.9], rotate: [45, 90, 45] }}
          transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
        />

        {/* Layer 4: Inner Circle */}
        <motion.div
          className="absolute w-[50%] h-[50%] rounded-full border border-primary/40"
          animate={{ scale: [1, 0.8, 1] }}
          transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
        />
        
        {/* Layer 5: Core Flower */}
        <motion.div
            className="absolute w-[20%] h-[20%] flex items-center justify-center"
            animate={{ scale: [1, 1.5, 1], rotate: [0, -180, 0] }}
            transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
        >
            <FlowerIcon className="w-full h-full text-primary opacity-80" />
        </motion.div>

        {/* Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
           <circle
            cx="50%"
            cy="50%"
            r="48%" /* Match outer geometry radius roughly */
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-white/5"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="48%"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 - timeLeft / durationSeconds }}
            transition={{ duration: 1, ease: "linear" }} /* Smooth update per second */
          />
        </svg>
      </div>

      {/* Timer Text */}
      <motion.div 
        className="absolute z-10 flex flex-col items-center mt-80 md:mt-0"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
      >
        <span className="text-5xl font-display text-foreground/80 tabular-nums tracking-wider">
            {formatTime(timeLeft)}
        </span>
        <span className="text-sm text-secondary uppercase tracking-[0.3em] mt-2">Breathe</span>
      </motion.div>

      {/* Stop Button (Hidden by default, visible on hover area or tap) */}
       <button 
          onClick={onComplete}
          className="absolute bottom-12 text-xs text-secondary/50 hover:text-destructive transition-colors uppercase tracking-widest"
       >
          End Session
       </button>
    </div>
  );
}

function FlowerIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className={className}>
             <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9-4.03-9-9-4.97 0-9 4.03-9 9 0 4.97 4.03 9 9 9z" />
             <path d="M12 22c-4.97 0-9-4.03-9-9 4.97 0 9-4.03 9-9 4.97 0 9 4.03 9 9 0 4.97-4.03 9-9 9z" transform="rotate(60 12 13)" />
             <path d="M12 22c-4.97 0-9-4.03-9-9 4.97 0 9-4.03 9-9 4.97 0 9 4.03 9 9 0 4.97-4.03 9-9 9z" transform="rotate(120 12 13)" />
        </svg>
    )
}

