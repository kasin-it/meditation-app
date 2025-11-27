import { BreathingExercise, BreathingExerciseStep } from "./types";

export const RELAX_EXERCISE_CONFIG = {
  name: "4-7-8 Relax",
  initialSteps: [
    { name: "inhale", duration: 4000 },
    { name: "exhale", duration: 4000 },
    { name: "hold", duration: 4000 },
  ],
  loopSteps: [
    { name: "inhale", duration: 4000 },
    { name: "hold", duration: 7000 },
    { name: "exhale", duration: 8000 },
  ],
  finalSteps: [
    { name: "inhale", duration: 4000 },
    { name: "exhale", duration: 4000 },
    { name: "hold", duration: 4000 },
  ],
  defaultRepetitions: 4,
};

export const createRelaxExercise = (repetitions: number = RELAX_EXERCISE_CONFIG.defaultRepetitions): BreathingExercise => {
  const steps: BreathingExerciseStep[] = [];

  // Add initial steps
  steps.push(...RELAX_EXERCISE_CONFIG.initialSteps);

  // Add loop steps
  for (let i = 0; i < repetitions; i++) {
    steps.push(...RELAX_EXERCISE_CONFIG.loopSteps);
  }

  // Add final steps
  steps.push(...RELAX_EXERCISE_CONFIG.finalSteps);

  return {
    exerciseName: RELAX_EXERCISE_CONFIG.name,
    exerciseSteps: steps,
  };
};
