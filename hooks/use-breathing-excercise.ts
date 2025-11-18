import { useState, useEffect, useCallback, useRef } from 'react';
import { BreathingExerciseService } from '@/services/breathing-exercise/service';
import { BreathingExercise, BreathingExerciseStep } from '@/services/breathing-exercise/types';

export function useBreathingExercise() {
  const [remainingTime, setRemainingTime] = useState(0);
  const [timeToStepEnd, setTimeToStepEnd] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [currentStep, setCurrentStep] = useState<BreathingExerciseStep | null>(null);
  const serviceRef = useRef<BreathingExerciseService | null>(null);

  // Initialize the service and set up a default breathing exercise
  useEffect(() => {
    const exercise: BreathingExercise = {
      exerciseName: '4-7-8 Breathing',
      exerciseSteps: [
        { name: 'inhale', duration: 4000 }, // 4 seconds
        { name: 'hold', duration: 7000 }, // 7 seconds
        { name: 'exhale', duration: 8000 }, // 8 seconds
      ],
    };

    serviceRef.current = new BreathingExerciseService(exercise);

    const unsubscribe = serviceRef.current.subscribe((props) => {
      setRemainingTime(props.currentBreathingExerciseTimer);
      setTimeToStepEnd(props.timeToStepEnd);
      setCurrentStep(props.currentBreathingExerciseStep);
      setIsFinished(props.isFinished);
      setIsProcessing(props.isRunning);
    });

    // Set initial state
    return () => {
      unsubscribe();
    };
  }, []);

  const onStart = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.startExercise();
    }
  }, []);

  const onStop = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.stopExercise();
    }
  }, []);

  const onReset = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.resetExercise();
    }
  }, []);

  return {
    onStart,
    onStop,
    onReset,
    remainingTime,
    timeToStepEnd,
    isProcessing,
    currentStep,
    isFinished,
  };
}
