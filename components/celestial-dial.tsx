"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Play, Minus, Plus } from "lucide-react";

interface CelestialDialProps {
  onStart: (duration: number) => void;
}

const PRESETS = [
  { label: "Quick", minutes: 5 },
  { label: "Deep", minutes: 20 },
  { label: "Astral", minutes: 45 },
];

export function CelestialDial({ onStart }: CelestialDialProps) {
  const [minutes, setMinutes] = useState(15);
  const dialRef = useRef<HTMLDivElement>(null);
  
  // Calculate angle based on minutes (0-60)
  // 0 mins = -90deg (top), 60 mins = 270deg
  const angle = (minutes / 60) * 360;
  
  const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: { point: { x: number; y: number } }) => {
    if (!dialRef.current) return;
    
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = info.point.x - centerX;
    const y = info.point.y - centerY;
    
    let newAngle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (newAngle < 0) newAngle += 360;
    
    const newMinutes = Math.round((newAngle / 360) * 60);
    const clamped = Math.max(1, Math.min(60, newMinutes === 0 ? 60 : newMinutes));
    setMinutes(clamped);
  };

  const adjustTime = (amount: number) => {
    setMinutes(prev => Math.max(1, Math.min(60, prev + amount)));
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-md mx-auto">
      {/* Dial Container */}
      <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center touch-none" ref={dialRef}>
        
        {/* Outer Glow Ring */}
        <div className="absolute inset-0 rounded-full border border-primary/20 shadow-[0_0_60px_-10px_var(--primary)] opacity-20" />
        
        {/* Ticks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const isHour = i % 5 === 0;
          return (
            <div
              key={i}
              className={cn(
                "absolute left-1/2 top-0 w-[1px] h-full origin-center transition-colors pointer-events-none",
                isHour ? "bg-primary/50" : "bg-secondary/20"
              )}
              style={{ transform: `rotate(${i * 6}deg)` }}
            >
              <div className={cn(
                "w-full bg-current mx-auto",
                isHour ? "h-4" : "h-2"
              )} />
            </div>
          );
        })}

        {/* Active Arc */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
          <circle
            cx="50%"
            cy="50%"
            r="48%"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary opacity-80"
            strokeDasharray="301.6" 
          />
        </svg>
        
        {/* SVG for precise arc drawing */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="1.5"
            className="opacity-50"
            pathLength={100}
            strokeDasharray={`${(minutes / 60) * 100} 100`}
            strokeLinecap="round"
          />
        </svg>

        {/* Draggable Orb - Increased touch target size */}
        <motion.div
          className="absolute w-full h-full cursor-grab active:cursor-grabbing z-30 pointer-events-none"
          style={{ rotate: angle - 90 }}
        >
           {/* Interactive Wrapper that receives gestures - only around the handle */}
           <motion.div 
             className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-transparent pointer-events-auto"
             onPan={handleDrag}
             whileTap={{ scale: 0.9 }}
           >
              {/* Visible Knob */}
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-8 h-8 rounded-full bg-background border-2 border-primary shadow-[0_0_20px_var(--primary)] flex items-center justify-center">
                   <div className="w-2 h-2 rounded-full bg-primary" />
                 </div>
              </div>
           </motion.div>
        </motion.div>

        {/* Center Time Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
          <span className="text-6xl md:text-8xl font-display font-light text-primary tracking-tight">
            {minutes}
          </span>
          <span className="text-sm text-secondary tracking-[0.2em] uppercase mt-2">Minutes</span>
          
          {/* Mobile Fine Tune Controls */}
          <div className="flex items-center gap-8 mt-4 md:hidden pointer-events-auto">
             <button 
               onClick={() => adjustTime(-1)}
               className="p-2 rounded-full bg-card/50 border border-white/10 active:scale-90 transition-transform hover:bg-card/80"
             >
               <Minus className="w-4 h-4 text-secondary" />
             </button>
             <button 
               onClick={() => adjustTime(1)}
               className="p-2 rounded-full bg-card/50 border border-white/10 active:scale-90 transition-transform hover:bg-card/80"
             >
               <Plus className="w-4 h-4 text-secondary" />
             </button>
          </div>
        </div>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap justify-center gap-3 z-10 w-full px-4">
        {PRESETS.map((p) => (
          <button
            key={p.minutes}
            onClick={() => setMinutes(p.minutes)}
            className={cn(
              "flex-1 min-w-[80px] py-3 rounded-2xl border transition-all duration-300 active:scale-95",
              minutes === p.minutes
                ? "border-primary bg-primary/10 text-primary shadow-[0_0_15px_-5px_var(--primary)]"
                : "border-white/10 text-secondary hover:border-primary/30 hover:text-primary/70 bg-card/30"
            )}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest block opacity-70">{p.label}</span>
            <span className="text-xl font-display">{p.minutes}m</span>
          </button>
        ))}
      </div>

      {/* Start Button */}
      <motion.button
        onClick={() => onStart(minutes * 60)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group relative w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-card to-background border border-white/10 shadow-2xl z-10 mt-4"
      >
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl group-hover:bg-primary/30 transition-colors duration-500 animate-pulse-slow" />
        <Play className="w-8 h-8 text-primary ml-1 fill-primary/20" strokeWidth={1.5} />
      </motion.button>
    </div>
  );
}
