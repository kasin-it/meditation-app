import { BreathingExercise, BreathingExerciseCallbackType } from './types';

export class BreathingExerciseService {
  private exercise: BreathingExercise | null = null;
  private exerciseTotalDuration: number = 0;
  private currentStepIndex: number = 0;
  private currentExerciseTimer: number = 0; // in ms
  private exerciseTimerInterval: NodeJS.Timeout | null = null;
  private isExerciseFinished: boolean = false;
  private isExerciseRunning: boolean = false;
  private callbacks: BreathingExerciseCallbackType[] = [];
  private stepsWithTimeToEndStep: Record<number, number> = {};

  constructor(exercise: BreathingExercise) {
    if (exercise.exerciseSteps.length === 0) {
      throw new Error('Exercise must have at least one step');
    }
    this.exercise = exercise;
    this.exerciseTotalDuration = this.exercise.exerciseSteps.reduce((acc, step) => acc + step.duration, 0);

    this.stepsWithTimeToEndStep = this.exercise.exerciseSteps.reduce(
      (acc, step, index) => {
        acc.accumulatedTime += step.duration;
        acc.record[index] = acc.accumulatedTime;
        return acc;
      },
      { record: {} as Record<number, number>, accumulatedTime: 0 },
    ).record;
  }

  private checkIfExerciseIsSet() {
    if (!this.exercise) {
      throw new Error('Exercise is not set');
    }
  }

  startExercise() {
    if (this.exerciseTimerInterval) {
      return;
    }

    // Initialize the state before starting the interval
    this.updateExerciseState();

    this.checkIfExerciseIsSet();
    this.isExerciseRunning = true;

    this.exerciseTimerInterval = setInterval(() => {
      this.currentExerciseTimer += 1000;
      // Update the exercise state
      this.updateExerciseState();
      // Check if the exercise is finished
      if (this.checkIfTheExerciseIsFinished()) {
        this.stopExercise();
        this.currentExerciseTimer = this.exerciseTotalDuration;
        this.isExerciseFinished = true;
        this.notify();
        return;
      }
    }, 1000);
  }

  private checkIfTheExerciseIsFinished() {
    return this.currentExerciseTimer >= this.exerciseTotalDuration;
  }

  private updateExerciseState() {

    if (this.currentStepIndex < this.exercise!.exerciseSteps.length - 1) {
      const timeToEndCurrentStep = this.stepsWithTimeToEndStep[this.currentStepIndex];
      if (this.currentExerciseTimer >= timeToEndCurrentStep) {
        this.currentStepIndex++;
      }
    }
    this.notify();
  }

  stopExercise() {
    this.isExerciseRunning = false;
    this.notify();
    if (this.exerciseTimerInterval) {
      clearInterval(this.exerciseTimerInterval);
      this.exerciseTimerInterval = null;
    }
  }

  resetExercise() {
    this.checkIfExerciseIsSet();
    this.stopExercise();
    this.currentExerciseTimer = 0;
    this.currentStepIndex = 0;
    this.isExerciseFinished = false;
    this.isExerciseRunning = false;
    this.notify();
  }

  subscribe(callback: BreathingExerciseCallbackType) {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback);
    };
  }

  notify() {
    this.callbacks.forEach((callback) => {
      callback({
        currentBreathingExerciseTimer: this.currentExerciseTimer,
        timeToStepEnd: this.stepsWithTimeToEndStep[this.currentStepIndex] - this.currentExerciseTimer,
        currentBreathingExerciseStep: this.exercise!.exerciseSteps[this.currentStepIndex],
        isFinished: this.isExerciseFinished,
        isRunning: this.isExerciseRunning,
      });
    });
  }
}
