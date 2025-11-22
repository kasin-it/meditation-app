"use client";

import React from "react";
import { motion } from "framer-motion";
// Removed unused import: cn
// import { cn } from "@/lib/utils";
import { Sparkles, Flame, Clock } from "lucide-react";

// Mock Data Generation
const generateData = () => {
  const data = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    // Randomly decide if meditated (mostly yes for demo)
    const meditated = Math.random() > 0.3;
    // Random positions for "Star Cluster" feel, but kept somewhat ordered
    // We'll arrange them in a rough spiral or wave pattern
    // Unused variables removed: angle, radius
    // const angle = i * 0.5; // rad
    // const radius = 20 + i * 2; 
    // Just use a grid with jitter for simplicity in SVG
    data.push({
      date,
      meditated,
      id: i,
    });
  }
  return data;
};

const DATA = generateData();

// Stats Cards
const STATS = [
  { label: "Current Streak", value: "12", unit: "Days", icon: Flame },
  { label: "Total Time", value: "48.5", unit: "Hours", icon: Clock },
  { label: "Sessions", value: "84", unit: "Journeys", icon: Sparkles },
];

export function ConstellationHeatmap() {
  // Calculate positions for the stars
  // We'll map the 30 days into a responsive area
  // Let's just use percentage based positions for a "constellation" look
  // We can pre-calculate fixed positions to form a shape, e.g., a spiral
  
  const stars = DATA.map((d, i) => {
    // Create a spiral layout
    const angle = i * 0.6; // spacing
    const r = 10 + (i * 2.5); // radius expansion
    // Convert polar to cartesian (center 50, 50)
    const x = 50 + r * Math.cos(angle) * 0.8; // Stretch slightly x
    const y = 50 + r * Math.sin(angle) * 0.6; // Compress slightly y
    return { ...d, x, y };
  });

  return (
    <div className="w-full h-full flex flex-col p-6 space-y-8 overflow-y-auto pb-24">
      
      <header className="text-center space-y-2">
        <h2 className="text-3xl font-display text-primary">Your Constellation</h2>
        <p className="text-secondary text-sm">30 Day Journey</p>
      </header>

      {/* Stats Cards (Tarot Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative overflow-hidden rounded-2xl bg-surface/30 backdrop-blur-md border border-white/10 p-6 flex flex-col items-center text-center group hover:bg-surface/40 transition-colors"
          >
             <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <stat.icon className="w-6 h-6 text-primary mb-3 opacity-80" />
             <span className="text-3xl font-display text-foreground">{stat.value}</span>
             <span className="text-xs text-secondary uppercase tracking-wider mt-1">{stat.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Star Map */}
      <div className="relative w-full aspect-square md:aspect-[2/1] bg-surface/5 rounded-3xl border border-white/5 backdrop-blur-sm overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--primary)_0%,transparent_70%)] opacity-5" />
         
         <svg className="w-full h-full p-8" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {/* Constellation Lines */}
            {stars.map((star, i) => {
               if (i === 0) return null;
               const prev = stars[i-1];
               if (star.meditated && prev.meditated) {
                 return (
                   <motion.line
                     key={`line-${i}`}
                     x1={prev.x}
                     y1={prev.y}
                     x2={star.x}
                     y2={star.y}
                     stroke="var(--primary)"
                     strokeWidth="0.2"
                     className="opacity-40"
                     initial={{ pathLength: 0, opacity: 0 }}
                     animate={{ pathLength: 1, opacity: 0.4 }}
                     transition={{ duration: 1.5, delay: i * 0.05 }}
                   />
                 );
               }
               return null;
            })}

            {/* Stars */}
            {stars.map((star, i) => (
              <motion.g
                key={`star-${i}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                {star.meditated ? (
                   // Glowing Star
                   <g>
                     <circle cx={star.x} cy={star.y} r="3" fill="var(--primary)" className="opacity-10 blur-sm animate-pulse" />
                     <circle cx={star.x} cy={star.y} r="0.8" fill="var(--primary)" className="shadow-[0_0_10px_var(--primary)]" />
                   </g>
                ) : (
                   // Dim Star
                   <circle cx={star.x} cy={star.y} r="0.5" fill="var(--secondary)" className="opacity-30" />
                )}
              </motion.g>
            ))}
         </svg>
      </div>
    </div>
  );
}
