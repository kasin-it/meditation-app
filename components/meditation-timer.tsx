'use client';

import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useBreathingExercise } from '@/hooks/use-breathing-excercise';

export default function MeditationTimer() {
  const { onStart, remainingTime, onStop, onReset, isProcessing, currentStep, timeToChangeStep } =
    useBreathingExercise();

  const getBreathText = () => {
    if (!isProcessing) return 'Ready to begin';
    if (currentStep?.name === 'inhale') return 'Breathe in...';
    if (currentStep?.name === 'hold') return 'Hold...';
    if (currentStep?.name === 'exhale') return 'Breathe out...';
    return 'Ready to begin';
  };

  const formatTime = (milliseconds: number): string => {
    // Use Math.ceil for countdown to avoid visual delay
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative">
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-4000 ease-in-out ${
          isProcessing
            ? currentStep?.name === 'inhale'
              ? 'scale-100'
              : currentStep?.name === 'hold'
              ? 'scale-100'
              : 'scale-75'
            : 'scale-75'
        }`}
      >
        <div
          className={`w-[500px] h-[500px] rounded-full transition-all duration-4000 ease-in-out ${
            isProcessing
              ? currentStep?.name === 'inhale'
                ? 'bg-primary/20 shadow-[0_0_100px_40px_rgba(209,148,108,0.3)]'
                : currentStep?.name === 'hold'
                ? 'bg-primary/20 shadow-[0_0_100px_40px_rgba(209,148,108,0.3)]'
                : 'bg-primary/10 shadow-[0_0_60px_20px_rgba(209,148,108,0.2)]'
              : 'bg-primary/10 shadow-[0_0_60px_20px_rgba(209,148,108,0.2)]'
          }`}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Breathing indicator text */}
        <div className="mb-8 text-center">
          <p className="text-muted-foreground text-sm uppercase tracking-wider mb-2">
            Meditation Session
          </p>
          <h2 className="text-2xl font-light text-foreground">{getBreathText()}</h2>
        </div>

        {/* Timer display */}
        <div className="mb-12">
          <div className="text-8xl font-light tabular-nums text-foreground mb-2">
            {formatTime(remainingTime)}
          </div>
          <div className="text-8xl font-light tabular-nums text-foreground mb-2">
            {formatTime(timeToChangeStep - remainingTime)}
          </div>
          <div className="text-center text-sm text-muted-foreground uppercase tracking-wider">
            {isProcessing ? 'In Progress' : 'Paused'}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <Button
            size="lg"
            variant="outline"
            onClick={onReset}
            className="w-14 h-14 rounded-full p-0 bg-card/80 backdrop-blur-sm"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>

          <Button
            size="lg"
            onClick={isProcessing ? onStop : onStart}
            className="w-20 h-20 rounded-full p-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
          >
            {isProcessing ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-8 text-center">Find your inner peace</p>
      </div>
    </div>
  );
}
