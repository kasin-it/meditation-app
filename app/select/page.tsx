"use client";

import Link from "next/link";
import { PATTERNS, BreathingPattern } from "@/lib/patterns";
import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SelectPage() {
  const router = useRouter();
  const [selectedRepetitions, setSelectedRepetitions] = useState<Record<string, number>>(
    PATTERNS.reduce((acc, p) => ({ ...acc, [p.id]: p.defaultRepetitions }), {})
  );

  const handleStart = (patternId: string) => {
    const reps = selectedRepetitions[patternId];
    router.push(`/timer?id=${patternId}&reps=${reps}`);
  };

  const updateRepetitions = (patternId: string, delta: number) => {
    setSelectedRepetitions((prev) => ({
      ...prev,
      [patternId]: Math.max(1, (prev[patternId] || 10) + delta),
    }));
  };

  const formatDuration = (pattern: BreathingPattern, reps: number) => {
    const initialDuration = pattern.initialSteps?.reduce((acc, step) => acc + step.duration, 0) || 0;
    const loopDuration = pattern.loopSteps.reduce((acc, step) => acc + step.duration, 0);
    const finalDuration = pattern.finalSteps?.reduce((acc, step) => acc + step.duration, 0) || 0;
    const totalSeconds = initialDuration + (loopDuration * reps) + finalDuration;
    
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-8">
      <h2 className="mb-8 sm:mb-12 text-xl sm:text-2xl font-light tracking-[0.3em] text-white/80 text-center">
        SELECT RHYTHM
      </h2>
      
      <div className="flex w-full max-w-md flex-col gap-4 sm:gap-6">
        {PATTERNS.map((pattern) => {
          const reps = selectedRepetitions[pattern.id] || pattern.defaultRepetitions;
          
          return (
            <div
              key={pattern.id}
              className="group relative overflow-hidden border border-white/10 bg-white/5 p-5 sm:p-6 transition-all duration-500 hover:border-[#4DEEEA]/50 hover:bg-[#4DEEEA]/5"
            >
              <div 
                onClick={() => handleStart(pattern.id)}
                className="cursor-pointer"
              >
                <h3 className="mb-1 sm:mb-2 text-lg sm:text-xl font-normal tracking-widest text-white group-hover:text-[#4DEEEA] transition-colors duration-300 text-center">
                  {pattern.name.toUpperCase()}
                </h3>
                <p className="text-[0.65rem] sm:text-xs tracking-widest text-white/40 group-hover:text-white/60 transition-colors duration-300 text-center mb-4">
                  {pattern.description}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-6 border-t border-white/10 pt-4 mt-2">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[0.55rem] uppercase tracking-widest text-white/30">Repetitions</span>
                  <div className="flex items-center gap-3 text-white/80">
                    <button 
                      onClick={(e) => { e.stopPropagation(); updateRepetitions(pattern.id, -1); }}
                      className="hover:text-[#4DEEEA] transition-colors p-1"
                    >
                      <ChevronDown size={14} />
                    </button>
                    <span className="font-mono text-sm min-w-[2ch] text-center">{reps}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); updateRepetitions(pattern.id, 1); }}
                      className="hover:text-[#4DEEEA] transition-colors p-1"
                    >
                      <ChevronUp size={14} />
                    </button>
                  </div>
                </div>

                <div className="w-px h-8 bg-white/10" />

                <div className="flex flex-col items-center gap-1">
                  <span className="text-[0.55rem] uppercase tracking-widest text-white/30">Duration</span>
                  <span className="font-mono text-sm text-white/80">{formatDuration(pattern, reps)}</span>
                </div>
              </div>
              
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#4DEEEA]/10 to-transparent pointer-events-none" />
            </div>
          );
        })}
      </div>
      
      <Link
        href="/"
        className="mt-12 sm:mt-16 text-[0.65rem] sm:text-xs tracking-widest text-white/30 transition-colors hover:text-white"
      >
        BACK
      </Link>
    </div>
  );
}
