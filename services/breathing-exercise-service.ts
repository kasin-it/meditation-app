export type ExcerciseType = {
  excerciseId: number;
  excerciseName: string;
  steps: {
    duration: number;
    stepName: string;
  }[];
};

type BreatingExerciseServiceOptions = {
  excercise: ExcerciseType;
};

export class BreatingExerciseService {
  private readonly excercise: ExcerciseType;
  private readonly excerciseTotalDuration: number;
  private elapsedTime: number = 0;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private isRunning: boolean = false;
  private callbacks: ((elapsedTime: number, currentStep: string) => void)[] = [];

  constructor(options: BreatingExerciseServiceOptions) {
    this.excercise = options.excercise;
    this.excerciseTotalDuration = this.excercise.steps.reduce(
      (accumulator, currentStep) => accumulator + currentStep.duration,
      0
    );
  }

  // Subscribe to timer updates
  subscribe(callback: (elapsedTime: number, currentStep: string) => void) {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback);
    };
  }

  // Notify all subscribers
  private notify() {
    const currentStep = this.getCurrentStep();
    this.callbacks.forEach((callback) => callback(this.elapsedTime, currentStep));
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.elapsedTime += 100; // Update every 100ms for smooth animation

      if (this.elapsedTime >= this.excerciseTotalDuration) {
        this.stop();
        this.elapsedTime = this.excerciseTotalDuration;
      }

      this.notify();
    }, 100);
  }

  pause() {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  stop() {
    this.pause();
    this.elapsedTime = 0;
  }

  reset() {
    this.elapsedTime = 0;
    this.notify();
  }

  getCurrentStep(): string {
    let accumulated = 0;
    for (const step of this.excercise.steps) {
      accumulated += step.duration;
      if (this.elapsedTime < accumulated) {
        return step.stepName;
      }
    }
    return 'Complete';
  }

  getElapsedTime(): number {
    return this.elapsedTime;
  }

  getRemainingTime(): number {
    return Math.max(0, this.excerciseTotalDuration - this.elapsedTime);
  }

  getTotalDuration(): number {
    return this.excerciseTotalDuration;
  }

  getProgress(): number {
    return (this.elapsedTime / this.excerciseTotalDuration) * 100;
  }

  getIsRunning(): boolean {
    return this.isRunning;
  }

  destroy() {
    this.pause();
    this.callbacks = [];
  }
}
