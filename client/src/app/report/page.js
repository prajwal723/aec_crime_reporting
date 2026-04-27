"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ReportIssue() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Crime",
    location: "",
    image: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to submit report");

      setMessage("Report submitted successfully! The authorities have been notified.");
      setFormData({
        title: "",
        description: "",
        category: "Crime",
        location: "",
        image: "",
      });
    } catch (err) {
      setMessage("Error submitting report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-[url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2144&auto=format&fit=crop')] bg-cover bg-fixed bg-center">
      <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-md"></div>

      <div className="glass-card relative z-10 w-full max-w-3xl p-10 transform transition-all mt-4 mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 border-b border-indigo-500/20 pb-6">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Report an Issue</h2>
            <p className="text-indigo-200 mt-1 font-medium text-sm">Help us keep the city safe</p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 sm:mt-0 px-6 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-full text-sm font-bold hover:bg-red-500/20 hover:text-red-300 transition-all backdrop-blur-sm"
          >
            Sign Out
          </button>
        </div>

        {message && (
          <div className={`p-4 rounded-xl mb-8 backdrop-blur-md font-medium text-center ${message.includes("Error") ? "bg-red-500/20 border border-red-500/50 text-red-200" : "bg-emerald-500/20 border border-emerald-500/50 text-emerald-200"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 pl-1">Title</label>
              <input
                type="text"
                required
                placeholder="Brief summary..."
                className="w-full px-5 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all backdrop-blur-sm"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 pl-1">Category</label>
              <select
                className="w-full px-5 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all backdrop-blur-sm appearance-none"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Crime" className="bg-slate-800">Crime</option>
                <option value="Fire" className="bg-slate-800">Fire</option>
                <option value="Medical" className="bg-slate-800">Medical</option>
                <option value="Cleanliness" className="bg-slate-800">Cleanliness</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2 pl-1">Location</label>
            <input
              type="text"
              required
              placeholder="123 Main St, Near Central Park..."
              className="w-full px-5 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all backdrop-blur-sm"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2 pl-1">Description</label>
            <textarea
              required
              rows="4"
              placeholder="Provide more details about the situation..."
              className="w-full px-5 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all backdrop-blur-sm resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="p-5 border border-dashed border-slate-600 rounded-xl bg-slate-800/30">
            <label className="block text-sm font-semibold text-slate-300 mb-3 text-center">Attach Photo Evidence</label>
            <div className="flex flex-col items-center justify-center">
              <input
                type="file"
                accept="image/*"
                id="file-upload"
                className="hidden"
                onChange={handleImageChange}
              />
              <label 
                htmlFor="file-upload" 
                className="cursor-pointer px-6 py-2.5 bg-slate-700/50 text-indigo-300 border border-indigo-500/30 rounded-full text-sm font-medium hover:bg-slate-700 hover:text-indigo-200 transition-colors"
              >
                Choose Image
              </label>
              {formData.image && (
                <div className="mt-4 relative rounded-xl overflow-hidden shadow-lg border border-slate-700">
                  <img src={formData.image} alt="Preview" className="h-40 object-cover" />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? "Processing..." : "Submit Secure Report"}
          </button>
        </form>
      </div>
    </div>
  );
}
