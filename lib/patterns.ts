export type Step = {
  name: "inhale" | "exhale" | "hold";
  duration: number;
};

export type BreathingPattern = {
  id: string;
  name: string;
  description: string;
  initialSteps?: Step[];
  loopSteps: Step[];
  finalSteps?: Step[];
  defaultRepetitions: number; // Default number of loop repetitions
};

export const PATTERNS: BreathingPattern[] = [
  {
    id: "box",
    name: "Box Breathing",
    description: "Focus • Stress Relief",
    defaultRepetitions: 10,
    loopSteps: [
      { name: "inhale", duration: 4 },
      { name: "hold", duration: 4 },
      { name: "exhale", duration: 4 },
      { name: "hold", duration: 4 },
    ],
  },
  {
    id: "relax",
    name: "4-7-8 Relax",
    description: "Sleep • Deep Calm",
    defaultRepetitions: 4,
    initialSteps: [
      { name: "inhale", duration: 4 },
      { name: "exhale", duration: 4 },
      { name: "hold", duration: 4 },
    ],
    loopSteps: [
      { name: "inhale", duration: 4 },
      { name: "hold", duration: 7 },
      { name: "exhale", duration: 8 },
    ],
    finalSteps: [
      { name: "inhale", duration: 4 },
      { name: "exhale", duration: 4 },
      { name: "hold", duration: 4 },
    ],
  },
  {
    id: "balance",
    name: "Coherent",
    description: "Balance • Heart Rate",
    defaultRepetitions: 10,
    loopSteps: [
      { name: "inhale", duration: 6 },
      { name: "exhale", duration: 6 },
    ],
  },
];
