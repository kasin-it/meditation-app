"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wind, Eye, Sparkles, Plus, Infinity as InfinityIcon, Moon, Sun, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";

export type MeditationType = "breathing" | "vipassana" | "zen" | "mantra" | "custom";

export interface MeditationMethod {
  id: string;
  type: MeditationType;
  title: string;
  description: string;
  iconName?: string; // For serialization
  icon?: React.ElementType; // Runtime only
  color: string;
}

// Helper to map icon names back to components
const ICON_MAP: Record<string, React.ElementType> = {
  "Sparkles": Sparkles,
  "Wind": Wind,
  "Eye": Eye,
  "Infinity": InfinityIcon,
  "Moon": Moon,
  "Sun": Sun,
  "Cloud": Cloud,
  "Plus": Plus
};

const DEFAULT_METHODS: MeditationMethod[] = [
  {
    id: "breathing",
    type: "breathing",
    title: "Breathing",
    description: "Focus on the rhythm of your breath.",
    icon: Wind,
    iconName: "Wind",
    color: "text-sky-400",
  },
  {
    id: "vipassana",
    type: "vipassana",
    title: "Vipassana",
    description: "Insight into the true nature of reality.",
    icon: Eye,
    iconName: "Eye",
    color: "text-amber-400",
  },
  {
    id: "zen",
    type: "zen",
    title: "Zen",
    description: "Just sitting. Observing thoughts pass.",
    icon: InfinityIcon,
    iconName: "Infinity",
    color: "text-emerald-400",
  },
  {
    id: "mantra",
    type: "mantra",
    title: "Mantra",
    description: "Repetition of sacred sounds.",
    icon: Sparkles,
    iconName: "Sparkles",
    color: "text-purple-400",
  },
];

interface MeditationSelectionProps {
  onSelect: (method: MeditationMethod) => void;
  onCreate: () => void;
}

export function MeditationSelection({ onSelect, onCreate }: MeditationSelectionProps) {
  const [methods, setMethods] = useState<MeditationMethod[]>(DEFAULT_METHODS);

  useEffect(() => {
    // Fetch custom methods from Service Worker / IDB
    const fetchCustomMethods = async () => {
      try {
        const res = await fetch('/_api/meditations');
        if (res.ok) {
          const customMethods: MeditationMethod[] = await res.json();
          
          // Rehydrate icons
          const hydratedCustomMethods = customMethods.map(m => ({
            ...m,
            icon: m.iconName ? ICON_MAP[m.iconName] : Sparkles // Fallback
          }));

          setMethods([...DEFAULT_METHODS, ...hydratedCustomMethods]);
        }
      } catch (error) {
        console.error("Failed to load custom meditations", error);
      }
    };

    fetchCustomMethods();
  }, []);

  return (
    <div className="w-full max-w-md px-4 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-display text-foreground mb-2">Choose Your Path</h2>
        <p className="text-secondary text-sm tracking-widest uppercase">Select a method</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4">
        {methods.map((method, index) => {
          const Icon = method.icon || Sparkles;
          return (
            <motion.button
              key={method.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelect(method)}
              className="group relative p-6 rounded-3xl bg-surface/30 backdrop-blur-md border border-white/5 text-left transition-all hover:bg-surface/50 hover:border-white/10"
            >
              <div className="flex items-start gap-4">
                <div className={cn("p-3 rounded-2xl bg-background/50 border border-white/5 group-hover:scale-110 transition-transform duration-500", method.color)}>
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-lg font-display text-foreground mb-1 group-hover:text-primary transition-colors">{method.title}</h3>
                  <p className="text-sm text-secondary font-light">{method.description}</p>
                </div>
              </div>
            </motion.button>
          );
        })}

        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: methods.length * 0.1 }}
          onClick={onCreate}
          className="group relative p-6 rounded-3xl border-2 border-dashed border-white/10 text-left transition-all hover:border-primary/50 hover:bg-primary/5"
        >
          <div className="flex items-center gap-4 justify-center h-full">
            <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
            <span className="text-lg font-display text-secondary group-hover:text-primary transition-colors">Create Custom</span>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
