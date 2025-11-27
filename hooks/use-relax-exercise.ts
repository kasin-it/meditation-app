import { useMemo } from "react";
import { createRelaxExercise, RELAX_EXERCISE_CONFIG } from "../services/breathing-exercise/relax";
import { useBreathingExercise } from "./use-breathing-exercise";

export const useRelaxExercise = (repetitions: number = RELAX_EXERCISE_CONFIG.defaultRepetitions) => {
  const exercise = useMemo(() => createRelaxExercise(repetitions), [repetitions]);
  return useBreathingExercise(exercise);
};

