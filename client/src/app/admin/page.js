"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function StatCard({ label, value, sublabel, tone = "indigo" }) {
  const tones = {
    indigo: "from-indigo-500 to-violet-600",
    emerald: "from-emerald-500 to-teal-600",
    amber: "from-amber-500 to-orange-600",
    rose: "from-rose-500 to-pink-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${tones[tone]}`}>
        {label}
      </div>
      <div className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-slate-50">{value}</div>
      {sublabel && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{sublabel}</p>}
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== "admin") {
      router.push("/login");
      return;
    }

    const loadStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/stats", {
          headers: { Authorization: "Bearer admin" },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || "Failed to load admin stats");
        setStats(data);
      } catch (err) {
        setError(err.message || "Failed to load admin stats");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-500">
          <svg className="w-8 h-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-sm font-medium">Loading admin dashboard…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/admin" className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
            SmartCity
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Live platform statistics and reporting activity.</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm font-medium">
            {error}
          </div>
        )}

        {stats && (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard label="Registered Users" value={stats.totalUsers} sublabel="Total accounts created" tone="indigo" />
              <StatCard label="Logins (24h)" value={stats.loginsLast24Hours} sublabel="Unique users in the last 24 hours" tone="emerald" />
              <StatCard label="Logins (All Time)" value={stats.totalLogins} sublabel="Total successful logins" tone="amber" />
              <StatCard label="Posts (24h)" value={stats.postsLast24Hours} sublabel="Reports submitted in the last 24 hours" tone="rose" />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
                <h2 className="text-lg font-bold">Posts Till Date</h2>
                <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-slate-50">{stats.totalPosts}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Total reports submitted across the platform.</p>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
                <h2 className="text-lg font-bold">Top Locations</h2>
                <div className="mt-4 space-y-3">
                  {stats.topLocations.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">No location data available yet.</p>
                  ) : (
                    stats.topLocations.map((item, index) => (
                      <div key={`${item.location}-${index}`} className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{item.location}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Most reported locations</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-sm font-bold">{item.count}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
