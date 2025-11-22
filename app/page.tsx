"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { CelestialDial } from "@/components/celestial-dial";
import { BreathingMandala } from "@/components/breathing-mandala";
import { ConstellationHeatmap } from "@/components/constellation-heatmap";
import { BottomDock } from "@/components/bottom-dock";
import { MeditationSelection, MeditationMethod } from "@/components/meditation-selection";
import { CreateMeditation } from "@/components/create-meditation";

type MeditationStage = "selection" | "create" | "setup" | "meditating";

export default function Page() {
  const [activeTab, setActiveTab] = useState<"home" | "stats" | "settings">("home");
  const [stage, setStage] = useState<MeditationStage>("selection");
  const [selectedMethod, setSelectedMethod] = useState<MeditationMethod | null>(null);
  const [duration, setDuration] = useState(0);

  // Handle tab changes to reset home state if needed, or preserve it
  const handleTabChange = (tab: "home" | "stats" | "settings") => {
    setActiveTab(tab);
    // Optional: Reset to selection when leaving home? No, keep state.
  };

  const handleMethodSelect = (method: MeditationMethod) => {
    setSelectedMethod(method);
    setStage("setup");
  };

  const handleCreateStart = () => {
    setStage("create");
  };

  const handleCreateSave = async (method: MeditationMethod) => {
    // Save to Service Worker / IDB
    try {
      await fetch('/_api/meditations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(method),
      });
    } catch (error) {
      console.error("Failed to save meditation method:", error);
    }
    
    setSelectedMethod(method);
    setStage("setup");
  };

  const handleCreateBack = () => {
    setStage("selection");
  };

  const handleSetupBack = () => {
    setStage("selection");
    setSelectedMethod(null);
  };

  const handleStart = (seconds: number) => {
    setDuration(seconds);
    setStage("meditating");
  };

  const handleComplete = () => {
    setStage("selection");
    setSelectedMethod(null);
    setActiveTab("stats");
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      
      <AnimatePresence mode="wait">
        {stage === "meditating" ? (
          <motion.div
            key="mandala"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full bg-background z-50"
          >
            <BreathingMandala durationSeconds={duration} onComplete={handleComplete} />
          </motion.div>
        ) : (
          <motion.div
             key="dashboard"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="w-full h-full flex flex-col relative"
          >
            {/* Background Decor */}
            <div className="absolute inset-0 pointer-events-none">
               <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[100px]" />
               <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[100px]" />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-md mx-auto relative z-10 overflow-y-auto no-scrollbar">
               <div className="min-h-full flex flex-col items-center justify-center p-6 pb-32">
                 <AnimatePresence mode="wait">
                   {activeTab === "home" && (
                     <motion.div
                       key="home"
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -20 }}
                       transition={{ duration: 0.4 }}
                       className="w-full flex flex-col items-center"
                     >
                       {stage === "selection" && (
                         <MeditationSelection 
                           onSelect={handleMethodSelect} 
                           onCreate={handleCreateStart} 
                         />
                       )}

                       {stage === "create" && (
                         <CreateMeditation 
                           onSave={handleCreateSave} 
                           onBack={handleCreateBack} 
                         />
                       )}

                       {stage === "setup" && selectedMethod && (
                         <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full flex flex-col items-center"
                         >
                           <div className="w-full flex items-center justify-between mb-8 px-4">
                             <button 
                               onClick={handleSetupBack}
                               className="p-2 rounded-full hover:bg-white/5 transition-colors"
                             >
                               <ArrowLeft className="text-secondary" />
                             </button>
                             <div className="text-center">
                               <h2 className="text-xl font-display text-foreground">{selectedMethod.title}</h2>
                               <p className="text-xs text-secondary tracking-widest uppercase">Configure Ritual</p>
                             </div>
                             <div className="w-10" /> {/* Spacer for alignment */}
                           </div>
                           
                           <CelestialDial onStart={handleStart} />
                         </motion.div>
                       )}
                     </motion.div>
                   )}

                   {activeTab === "stats" && (
                     <motion.div
                       key="stats"
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, x: -20 }}
                       transition={{ duration: 0.4 }}
                       className="w-full h-full flex flex-col"
                     >
                       <ConstellationHeatmap />
                     </motion.div>
                   )}

                   {activeTab === "settings" && (
                     <motion.div
                       key="settings"
                       initial={{ opacity: 0, scale: 0.95 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.95 }}
                       transition={{ duration: 0.4 }}
                       className="w-full text-center"
                     >
                        <h2 className="text-2xl font-display text-foreground">Rituals</h2>
                        <p className="text-secondary mt-4">Settings and Preferences coming soon.</p>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
            </main>

            {/* Dock */}
            <BottomDock activeTab={activeTab} onTabChange={handleTabChange} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
