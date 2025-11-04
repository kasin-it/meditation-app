import { useRef, useEffect, useState } from 'react';
import { BreatingExerciseService, ExcerciseType } from '@/services/breathing-exercise-service';

type UseBreathingExerciseProps = {
  excercise: ExcerciseType;
};

export function useBreathingExercise({ excercise }: UseBreathingExerciseProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const breatingExcerciseServiceRef = useRef<BreatingExerciseService | null>(null);

  // Initialize service once
  if (!breatingExcerciseServiceRef.current) {
    breatingExcerciseServiceRef.current = new BreatingExerciseService({
      excercise: excercise,
    });
  }

  const service = breatingExcerciseServiceRef.current;

  // Subscribe to service updates
  useEffect(() => {
    const unsubscribe = service.subscribe((elapsed, step) => {
      setElapsedTime(elapsed);
      setCurrentStep(step);
    });

    // Initial values
    setElapsedTime(service.getElapsedTime());
    setCurrentStep(service.getCurrentStep());

    // Cleanup on unmount
    return () => {
      unsubscribe();
      service.destroy();
    };
  }, [service]);

  return {
    // Time values
    elapsedTime,
    remainingTime: service.getRemainingTime(),
    totalDuration: service.getTotalDuration(),
    progress: service.getProgress(),

    // Current state
    currentStep,
    isRunning,

    // Control functions
    start: () => {
      service.start();
      setIsRunning(true);
    },
    pause: () => {
      service.pause();
      setIsRunning(false);
    },
    reset: () => {
      service.reset();
      setIsRunning(false);
    },
  };
}
