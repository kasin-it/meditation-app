"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Sparkles, Wind, Eye, Infinity as InfinityIcon, Moon, Sun, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { MeditationMethod, MeditationType } from "./meditation-selection";

interface CreateMeditationProps {
  onSave: (method: MeditationMethod) => void;
  onBack: () => void;
}

const ICONS = [
  { icon: Sparkles, label: "Sparkles" },
  { icon: Wind, label: "Wind" },
  { icon: Eye, label: "Eye" },
  { icon: InfinityIcon, label: "Infinity" },
  { icon: Moon, label: "Moon" },
  { icon: Sun, label: "Sun" },
  { icon: Cloud, label: "Cloud" },
];

const COLORS = [
  "text-sky-400",
  "text-amber-400",
  "text-emerald-400",
  "text-purple-400",
  "text-rose-400",
  "text-indigo-400",
];

export function CreateMeditation({ onSave, onBack }: CreateMeditationProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIconIndex, setSelectedIconIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const handleSave = () => {
    if (!title) return;
    
    const iconData = ICONS[selectedIconIndex];

    const newMethod: MeditationMethod = {
      id: `custom-${Date.now()}`,
      type: "custom",
      title,
      description: description || "Custom meditation method",
      iconName: iconData.label, // Save the string name
      icon: iconData.icon, // Runtime component
      color: COLORS[selectedColorIndex],
    };
    
    onSave(newMethod);
  };

  return (
    <div className="w-full max-w-md px-4 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center gap-4"
      >
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="text-secondary" />
        </button>
        <div>
          <h2 className="text-2xl font-display text-foreground">Forging a Path</h2>
          <p className="text-secondary text-sm tracking-widest uppercase">Create new method</p>
        </div>
      </motion.div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-secondary uppercase tracking-wider">Name</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Morning Clarity"
            className="w-full bg-surface/30 border border-white/10 rounded-2xl px-4 py-3 text-foreground placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-secondary uppercase tracking-wider">Intent</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is the purpose of this ritual?"
            rows={3}
            className="w-full bg-surface/30 border border-white/10 rounded-2xl px-4 py-3 text-foreground placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-secondary uppercase tracking-wider">Sigil</label>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {ICONS.map((item, index) => (
              <button
                key={item.label}
                onClick={() => setSelectedIconIndex(index)}
                className={cn(
                  "p-3 rounded-xl border transition-all shrink-0",
                  selectedIconIndex === index
                    ? "bg-primary/20 border-primary text-primary"
                    : "bg-surface/30 border-white/5 text-secondary hover:bg-surface/50"
                )}
              >
                <item.icon size={20} />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-secondary uppercase tracking-wider">Essence</label>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {COLORS.map((color, index) => (
              <button
                key={color}
                onClick={() => setSelectedColorIndex(index)}
                className={cn(
                  "w-10 h-10 rounded-full border-2 transition-all shrink-0 flex items-center justify-center",
                  selectedColorIndex === index
                    ? "border-primary scale-110"
                    : "border-transparent scale-100 opacity-50 hover:opacity-100"
                )}
              >
                <div className={cn("w-6 h-6 rounded-full bg-current", color)} />
              </button>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={!title}
          className="w-full mt-8 py-4 rounded-full bg-primary text-primary-foreground font-bold tracking-wide uppercase disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
        >
          Manifest
        </motion.button>
      </div>
    </div>
  );
}
