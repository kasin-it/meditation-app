"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BreathingTimer from "@/components/breathing-timer";
import { PATTERNS } from "@/lib/patterns";

function TimerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  
  const pattern = PATTERNS.find((p) => p.id === id) || PATTERNS[0];

  return (
    <BreathingTimer 
      pattern={pattern} 
      onExit={() => router.push("/")}
    />
  );
}

export default function TimerPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-white/50 tracking-widest">LOADING...</div>}>
      <TimerContent />
    </Suspense>
  );
}

