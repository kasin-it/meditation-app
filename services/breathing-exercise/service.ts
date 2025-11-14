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

  constructor(exercise: BreathingExercise) {
    if (exercise.exerciseSteps.length === 0) {
      throw new Error('Exercise must have at least one step');
    }
    this.exercise = exercise;
    this.exerciseTotalDuration = this.getDurationUntilStepIndex(exercise.exerciseSteps.length);
  }

  getDurationUntilStepIndex(stepIndex: number): number {
    return (
      this.exercise?.exerciseSteps
        .slice(0, stepIndex)
        .reduce((acc, step) => acc + step.duration, 0) ?? 0
    );
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
      this.currentExerciseTimer += 100;
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
    }, 100);
  }

  private checkIfTheExerciseIsFinished() {
    return this.currentExerciseTimer >= this.exerciseTotalDuration;
  }

  private updateExerciseState() {
    // LAST STEP
    if (this.currentStepIndex === this.exercise!.exerciseSteps.length - 1) {
      return;
    }

    let durationUntilNextStep = this.getDurationUntilStepIndex(this.currentStepIndex + 1);

    // UPDATE STEP
    if (this.currentExerciseTimer >= durationUntilNextStep) {
      this.currentStepIndex++;
      this.notify();
      return;
    }

    // IF NOT TIME TO CHANGE STEP, CALCULATE DURATION OF THE CURRENT STEP
    this.notify();
    return;
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

  private getTimeToChangeStep() {
    if (this.currentStepIndex === this.exercise!.exerciseSteps.length - 1) {
      return this.exerciseTotalDuration;
    }

    return this.getDurationUntilStepIndex(this.currentStepIndex + 1);
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
        timeToChangeStep: this.getTimeToChangeStep(),
        currentBreathingExerciseTimer: this.currentExerciseTimer,
        currentBreathingExerciseStep: this.exercise!.exerciseSteps[this.currentStepIndex],
        isFinished: this.isExerciseFinished,
        isRunning: this.isExerciseRunning,
      });
    });
  }
}
