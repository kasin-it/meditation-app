export type BreathingPattern = {
  id: string;
  name: string;
  description: string;
  inhale: number;
  holdIn: number;
  exhale: number;
  holdOut: number;
};

export const PATTERNS: BreathingPattern[] = [
  {
    id: "box",
    name: "Box Breathing",
    description: "Focus • Stress Relief",
    inhale: 4,
    holdIn: 4,
    exhale: 4,
    holdOut: 4,
  },
  {
    id: "relax",
    name: "4-7-8 Relax",
    description: "Sleep • Deep Calm",
    inhale: 4,
    holdIn: 7,
    exhale: 8,
    holdOut: 0,
  },
  {
    id: "balance",
    name: "Coherent",
    description: "Balance • Heart Rate",
    inhale: 6,
    holdIn: 0,
    exhale: 6,
    holdOut: 0,
  },
];

