"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Registration failed");
      localStorage.setItem("token", data.token);
      router.push("/report");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-[url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
      
      <div className="glass-card relative z-10 w-full max-w-lg p-10 transform transition-all">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-white tracking-tight">Join SmartCity</h2>
          <p className="text-indigo-200 mt-2 font-medium">Create your secure reporting account</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm font-medium backdrop-blur-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <input
              type="text"
              required
              placeholder="Full Name"
              className="w-full px-5 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all backdrop-blur-sm text-lg"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="group">
            <input
              type="email"
              required
              placeholder="Email Address"
              className="w-full px-5 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all backdrop-blur-sm text-lg"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="group">
            <input
              type="password"
              required
              placeholder="Password"
              className="w-full px-5 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all backdrop-blur-sm text-lg"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:-translate-y-0.5"
          >
            Create Account
          </button>
        </form>

        <p className="mt-8 text-center text-slate-300 font-medium">
          Already a member?{" "}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
