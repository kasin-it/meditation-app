"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getSessions, calculateStats } from "@/lib/api";

export default function StatsPage() {
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    streak: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const sessions = await getSessions();
      const calculated = calculateStats(sessions);
      setStats(calculated);
      setLoading(false);
    }
    loadStats();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-8">
      <h2 className="mb-12 sm:mb-16 text-xl sm:text-2xl font-light tracking-[0.3em] text-white/80 text-center">
        STATISTICS
      </h2>
      
      <div className="grid w-full max-w-md grid-cols-2 gap-3 sm:gap-4">
        <div className="flex flex-col items-center justify-center border border-white/10 bg-white/5 p-6 sm:p-8 text-center transition-colors hover:bg-white/10">
          <span className="text-3xl sm:text-4xl font-light text-white">
            {loading ? "-" : stats.totalSessions}
          </span>
          <span className="mt-2 text-[0.6rem] sm:text-xs tracking-widest text-white/40">SESSIONS</span>
        </div>
        <div className="flex flex-col items-center justify-center border border-white/10 bg-white/5 p-6 sm:p-8 text-center transition-colors hover:bg-white/10">
          <span className="text-3xl sm:text-4xl font-light text-white">
            {loading ? "-" : stats.totalMinutes}
          </span>
          <span className="mt-2 text-[0.6rem] sm:text-xs tracking-widest text-white/40">MINUTES</span>
        </div>
        <div className="col-span-2 flex flex-col items-center justify-center border border-white/10 bg-white/5 p-6 sm:p-8 text-center transition-colors hover:bg-white/10">
          <span className="text-3xl sm:text-4xl font-light text-[#4DEEEA]">
            {loading ? "-" : stats.streak}
          </span>
          <span className="mt-2 text-[0.6rem] sm:text-xs tracking-widest text-white/40">DAY STREAK</span>
        </div>
      </div>
      
      <Link
        href="/"
        className="mt-12 sm:mt-16 text-[0.65rem] sm:text-xs tracking-widest text-white/30 transition-colors hover:text-white"
      >
        BACK
      </Link>
    </div>
  );
}
