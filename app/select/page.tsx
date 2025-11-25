import Link from "next/link";
import { PATTERNS } from "@/lib/patterns";

export default function SelectPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-8">
      <h2 className="mb-8 sm:mb-12 text-xl sm:text-2xl font-light tracking-[0.3em] text-white/80 text-center">
        SELECT RHYTHM
      </h2>
      
      <div className="flex w-full max-w-md flex-col gap-4 sm:gap-6">
        {PATTERNS.map((pattern) => (
          <Link
            key={pattern.id}
            href={`/timer?id=${pattern.id}`}
            className="group relative overflow-hidden border border-white/10 bg-white/5 p-5 sm:p-6 text-center transition-all duration-500 hover:border-[#4DEEEA]/50 hover:bg-[#4DEEEA]/5"
          >
            <h3 className="mb-1 sm:mb-2 text-lg sm:text-xl font-normal tracking-widest text-white group-hover:text-[#4DEEEA] transition-colors duration-300">
              {pattern.name.toUpperCase()}
            </h3>
            <p className="text-[0.65rem] sm:text-xs tracking-widest text-white/40 group-hover:text-white/60 transition-colors duration-300">
              {pattern.description}
            </p>
            
            {/* Hover Glow Effect */}
             <div className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#4DEEEA]/10 to-transparent" />
          </Link>
        ))}
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

