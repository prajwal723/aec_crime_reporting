import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-tr from-indigo-900 via-slate-900 to-black">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="relative z-10 max-w-5xl px-6 text-center space-y-10 mt-[-5vh]">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-4">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400"></span>
            Welcome to the Future of Civic Safety
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 drop-shadow-lg">
            SmartCity AI
          </h1>
          <p className="text-xl md:text-3xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed">
            Report emergencies and local issues instantly. Our intelligent routing ensures your voice reaches the right authorities faster than ever.
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
              className="px-8 py-4 bg-slate-900/50 border-2 border-indigo-400/30 text-indigo-200 rounded-full font-bold text-lg hover:bg-indigo-900/80 hover:border-indigo-400 transition-all duration-300 hover:-translate-y-1 backdrop-blur-md"
            >
              Access Dashboard
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none"></div>
      </section>

      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Why SmartCity AI?</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Traditional reporting systems are slow and fragmented. We built a unified platform that leverages AI to prioritize and route issues immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "AI-Powered Routing",
              desc: "Reports are automatically analyzed and sent directly to the relevant municipal department, cutting out the middleman.",
              icon: "🧠",
            },
            {
              title: "Real-time Updates",
              desc: "Track the status of your reports in real-time. Get notified when action is taken or when an issue is resolved.",
              icon: "⚡",
            },
            {
              title: "Community Driven",
              desc: "See what others are reporting in your neighborhood. Upvote critical issues to increase their visibility to authorities.",
              icon: "🤝",
            },
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-colors group">
              <div className="text-4xl mb-6 bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 bg-slate-900/30 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white">How It Works</h2>
              
              <div className="space-y-6">
                {[
                  { step: "01", title: "Spot an Issue", desc: "Notice a pothole, broken streetlight, or hazard? Snap a picture and open the app." },
                  { step: "02", title: "Submit a Report", desc: "Provide a quick description and location. Our AI instantly categorizes the severity." },
                  { step: "03", title: "Action Taken", desc: "The responsible department receives the alert and deploys a team to fix it." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="text-indigo-400 font-mono text-xl font-bold mt-1">{item.step}</div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                      <p className="text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-1 relative w-full aspect-square max-w-md">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative h-full w-full bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 flex flex-col gap-4 overflow-hidden">
                <div className="w-full h-8 bg-slate-800 rounded-full mb-4"></div>
                <div className="w-3/4 h-6 bg-slate-800 rounded-full"></div>
                <div className="w-1/2 h-6 bg-slate-800 rounded-full"></div>
                <div className="mt-auto w-full h-48 bg-slate-800 rounded-2xl flex items-center justify-center">
                  <span className="text-slate-600">Map Interface</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-20 text-center border-t border-slate-900 bg-black">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Ready to make a difference?</h2>
        <Link
          href="/register"
          className="inline-block px-10 py-5 bg-white text-black rounded-full font-bold text-xl hover:bg-slate-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        >
          Join Your Community
        </Link>
        <p className="mt-12 text-slate-600 text-sm">
          © 2026 SmartCity AI. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
