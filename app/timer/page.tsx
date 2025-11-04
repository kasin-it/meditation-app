'use client';

import { useBreathingExercise } from '@/hooks/useBreathingExercise';
import React from 'react';

export default function TimerPage() {
  const {
    elapsedTime,
    remainingTime,
    totalDuration,
    progress,
    currentStep,
    isRunning,
    start,
    pause,
    reset,
  } = useBreathingExercise({
    excercise: {
      excerciseId: 1,
      excerciseName: '367',
      steps: [
        { duration: 3000, stepName: 'Breathe In' },
        { duration: 6000, stepName: 'Hold' },
        { duration: 7000, stepName: 'Breathe Out' },
      ],
    },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-linear-to-b from-blue-50 to-purple-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">3-6-7 Breathing</h1>

        {/* Current Step Display */}
        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-blue-600 mb-2">{currentStep}</div>
          <div className="text-2xl text-gray-600">{(remainingTime / 1000).toFixed(1)}s</div>
        </div>

        {/* Progress Bar */}
        <div className="w-full mb-8">
          <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-linear-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-sm text-gray-500 text-center mt-2">
            {(elapsedTime / 1000).toFixed(1)}s / {(totalDuration / 1000).toFixed(1)}s
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-3 justify-center">
          {!isRunning ? (
            <button
              onClick={start}
              className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors shadow-md"
            >
              Start
            </button>
          ) : (
            <button
              onClick={pause}
              className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors shadow-md"
            >
              Pause
            </button>
          )}
          <button
            onClick={reset}
            className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors shadow-md"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
