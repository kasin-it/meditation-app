export type BreathingExerciseCallbackType = (props: {
  currentBreathingExerciseTimer: number;
  timeToStepEnd: number;
  currentBreathingExerciseStep: BreathingExerciseStep;
  isFinished: boolean;
  isRunning: boolean;
}) => void;

export type BreathingExercise = {
  exerciseName: string;
  exerciseSteps: BreathingExerciseStep[];
};

export type BreathingExerciseStep = {
  name: string;
  duration: number;
};
