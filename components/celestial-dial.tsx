"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";

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
  // Removed unused ref: constraintsRef
  // const constraintsRef = useRef<HTMLDivElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);
  
  // Calculate angle based on minutes (0-60)
  // 0 mins = -90deg (top), 60 mins = 270deg
  const angle = (minutes / 60) * 360;
  
  // Fixed type for event and info using explicit types if possible or minimal `any` for now since PanInfo is from Framer Motion
  // Importing PanInfo from framer-motion
  // But to keep it simple without extra imports if they are not available easily, using 'any' is what caused the error.
  // I should try to import PanInfo or use a simpler type like `MouseEvent | TouchEvent | PointerEvent` and `{ point: { x: number, y: number } }`
  
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
    // Snap to nearest 1 to avoid jitter, clamp 1-60
    const clamped = Math.max(1, Math.min(60, newMinutes === 0 ? 60 : newMinutes));
    setMinutes(clamped);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      {/* Dial Container */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center" ref={dialRef}>
        
        {/* Outer Glow Ring */}
        <div className="absolute inset-0 rounded-full border border-primary/20 shadow-[0_0_60px_-10px_var(--primary)] opacity-20" />
        
        {/* Ticks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const isHour = i % 5 === 0;
          return (
            <div
              key={i}
              className={cn(
                "absolute left-1/2 top-0 w-[1px] h-full origin-center transition-colors",
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
            strokeDasharray="301.6" /* 2 * PI * 48 (assuming 100 viewBox, but here it's % based) - let's use viewBox for precision */
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

        {/* Draggable Orb */}
        <motion.div
          className="absolute w-full h-full cursor-grab active:cursor-grabbing"
          style={{ rotate: angle - 90 }}
          onPan={handleDrag}
          whileTap={{ scale: 0.9 }}
        >
           <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background border-2 border-primary shadow-[0_0_20px_var(--primary)] flex items-center justify-center z-20">
             <div className="w-2 h-2 rounded-full bg-primary" />
           </div>
        </motion.div>

        {/* Center Time Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-6xl md:text-8xl font-display font-light text-primary tracking-tight">
            {minutes}
          </span>
          <span className="text-sm text-secondary tracking-[0.2em] uppercase mt-2">Minutes</span>
        </div>
      </div>

      {/* Presets */}
      <div className="flex gap-4 z-10">
        {PRESETS.map((p) => (
          <button
            key={p.minutes}
            onClick={() => setMinutes(p.minutes)}
            className={cn(
              "px-6 py-2 rounded-2xl border transition-all duration-300",
              minutes === p.minutes
                ? "border-primary bg-primary/10 text-primary shadow-[0_0_15px_-5px_var(--primary)]"
                : "border-white/10 text-secondary hover:border-primary/30 hover:text-primary/70"
            )}
          >
            <span className="text-xs font-bold uppercase tracking-widest block">{p.label}</span>
            <span className="text-lg font-display">{p.minutes}m</span>
          </button>
        ))}
      </div>

      {/* Start Button */}
      <motion.button
        onClick={() => onStart(minutes * 60)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group relative w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-surface to-background border border-white/10 shadow-2xl z-10"
      >
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl group-hover:bg-primary/30 transition-colors duration-500 animate-pulse-slow" />
        <Play className="w-8 h-8 text-primary ml-1 fill-primary/20" strokeWidth={1.5} />
      </motion.button>
    </div>
  );
}
