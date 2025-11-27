import { useEffect, useRef, useState, useCallback } from "react";
import { BreathingExerciseService } from "../services/breathing-exercise/service";
import { BreathingExercise, BreathingExerciseStep } from "../services/breathing-exercise/types";

export interface UseBreathingExerciseState {
  currentTimer: number;
  timeToStepEnd: number;
  currentStep: BreathingExerciseStep | null;
  isFinished: boolean;
  isRunning: boolean;
}

export const useBreathingExercise = (exercise: BreathingExercise) => {
  const serviceRef = useRef<BreathingExerciseService | null>(null);
  
  // We use a ref to track if the exercise config changed, to recreate the service if needed
  // However, usually we want to persist the service unless explicit reset.
  // For now, we'll initialize it once or when exercise deeply changes (which is hard to track).
  // We'll assume the consumer passes a stable exercise object or we recreate on change.
  
  const [state, setState] = useState<UseBreathingExerciseState>({
    currentTimer: 0,
    timeToStepEnd: 0,
    currentStep: exercise.exerciseSteps[0] || null,
    isFinished: false,
    isRunning: false,
  });

  useEffect(() => {
    const service = new BreathingExerciseService(exercise);
    serviceRef.current = service;

    const unsubscribe = service.subscribe((newState) => {
      setState({
        currentTimer: newState.currentBreathingExerciseTimer,
        timeToStepEnd: newState.timeToStepEnd,
        currentStep: newState.currentBreathingExerciseStep,
        isFinished: newState.isFinished,
        isRunning: newState.isRunning,
      });
    });

    // Initialize state
    service.notify();

    return () => {
      unsubscribe();
      service.stopExercise();
    };
  }, [JSON.stringify(exercise)]); // serialization for deep comparison, careful with large objects but exercise is small

  const start = useCallback(() => {
    serviceRef.current?.startExercise();
  }, []);

  const stop = useCallback(() => {
    serviceRef.current?.stopExercise();
  }, []);

  const reset = useCallback(() => {
    serviceRef.current?.resetExercise();
  }, []);

  return {
    ...state,
    start,
    stop,
    reset,
  };
};

