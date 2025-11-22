"use client";

import React from "react";
import { motion } from "framer-motion";
import { Flower2, Activity, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface DockProps {
  activeTab: "home" | "stats" | "settings";
  onTabChange: (tab: "home" | "stats" | "settings") => void;
  className?: string;
}

const tabs = [
  { id: "home", icon: Flower2, label: "Sanctuary" },
  { id: "stats", icon: Activity, label: "Journey" },
  { id: "settings", icon: Settings, label: "Rituals" },
] as const;

export function BottomDock({ activeTab, onTabChange, className }: DockProps) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
        "flex items-center gap-4 px-6 py-4",
        "rounded-full",
        "bg-surface/30 backdrop-blur-md border border-white/10 shadow-2xl shadow-black/5",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="relative group flex flex-col items-center justify-center w-12 h-12"
          >
            {isActive && (
              <motion.div
                layoutId="activeTabBlob"
                className="absolute inset-0 bg-primary/10 rounded-full blur-md"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <tab.icon
              className={cn(
                "w-6 h-6 transition-colors duration-300 relative z-10",
                isActive ? "text-primary" : "text-secondary group-hover:text-primary/70"
              )}
              strokeWidth={1.5}
            />
            {isActive && (
               <motion.div
                layoutId="activeTabDot"
                className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary"
               />
            )}
          </button>
        );
      })}
    </motion.div>
  );
}

