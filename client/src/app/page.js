import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-tr from-indigo-900 via-slate-900 to-black animate-gradient">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      
      <div className="relative z-10 max-w-4xl px-6 text-center space-y-10 mt-[-5vh]">
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 drop-shadow-lg">
          SmartCity AI
        </h1>
        <p className="text-2xl md:text-3xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
          The future of civic safety. Report emergencies instantly, powered by intelligent routing.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12">
          <Link
            href="/register"
            className="group relative px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg overflow-hidden shadow-[0_0_40px_rgba(79,70,229,0.5)] hover:shadow-[0_0_60px_rgba(79,70,229,0.8)] transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10">Get Started</span>
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-transparent border-2 border-indigo-400/30 text-indigo-200 rounded-full font-bold text-lg hover:bg-indigo-900/40 hover:border-indigo-400 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
          >
            Access Dashboard
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none"></div>
    </div>
  );
}
