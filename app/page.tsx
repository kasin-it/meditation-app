import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-12 sm:gap-16 p-4">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-5xl sm:text-6xl font-light tracking-[0.5em] text-white opacity-90 text-center ml-[0.5em]">
          VOID
        </h1>
        <p className="text-[0.6rem] sm:text-xs uppercase tracking-[0.3em] text-white/40 text-center">
          Cosmic Mindfulness
        </p>
      </div>
      
      <nav className="flex flex-col items-center gap-6 sm:gap-8">
        <Link 
          href="/select" 
          className="group relative px-8 sm:px-12 py-4 text-lg sm:text-xl font-light tracking-[0.2em] text-white transition-all duration-500 hover:text-[#4DEEEA] hover:shadow-[0_0_40px_-10px_rgba(77,238,234,0.3)]"
        >
          <span className="relative z-10">BEGIN</span>
          <div className="absolute inset-0 -z-10 scale-90 border border-white/10 opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:border-[#4DEEEA]/30 group-hover:opacity-100" />
        </Link>

        <Link 
          href="/stats" 
          className="text-xs font-light tracking-[0.2em] text-white/40 transition-colors duration-300 hover:text-white/80"
        >
          STATISTICS
        </Link>
      </nav>
    </div>
  );
}
