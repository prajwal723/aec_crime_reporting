"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const DEPT_STYLES = {
  Crime:         { bg: "bg-red-50 dark:bg-red-900/20",     text: "text-red-700 dark:text-red-300",     border: "border-red-200 dark:border-red-800",     dot: "bg-red-500"    },
  Fire:          { bg: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-700 dark:text-orange-300", border: "border-orange-200 dark:border-orange-800", dot: "bg-orange-500" },
  Medical:       { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-800", dot: "bg-emerald-500" },
  Sanitation:    { bg: "bg-yellow-50 dark:bg-yellow-900/20", text: "text-yellow-700 dark:text-yellow-300", border: "border-yellow-200 dark:border-yellow-800", dot: "bg-yellow-500" },
  "Crime & Safety": { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-700 dark:text-red-300", border: "border-red-200 dark:border-red-800", dot: "bg-red-500" },
  default:       { bg: "bg-indigo-50 dark:bg-indigo-900/20", text: "text-indigo-700 dark:text-indigo-300", border: "border-indigo-200 dark:border-indigo-800", dot: "bg-indigo-500" },
};

function getDeptStyle(category) {
  return DEPT_STYLES[category] || DEPT_STYLES.default;
}

function ReportCard({ report, currentUser, onLike, onComment }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const [localLikes, setLocalLikes] = useState(report.likes || []);
  const [localComments, setLocalComments] = useState(report.comments || []);

  useEffect(() => { setLocalLikes(report.likes || []); }, [report.likes]);
  useEffect(() => { setLocalComments(report.comments || []); }, [report.comments]);

  const liked = localLikes.some(
    id => String(id) === String(currentUser?._id)
  );
  const likeCount = localLikes.length;
  const commentCount = localComments.length;
  const deptStyle = getDeptStyle(report.category);
  const initials = report.userId?.name?.charAt(0)?.toUpperCase() || "U";
  const timeAgo = (() => {
    const diff = Date.now() - new Date(report.createdAt);
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  })();

  const handleLikeClick = async () => {
    if (!currentUser) return;
    const uid = String(currentUser._id);
    const isLiked = localLikes.some(id => String(id) === uid);

    setLocalLikes(prev =>
      isLiked ? prev.filter(id => String(id) !== uid) : [...prev, uid]
    );

    const serverLikes = await onLike(report._id);
    if (serverLikes) setLocalLikes(serverLikes);
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isPosting) return;

    const optimistic = {
      _id: `temp_${Date.now()}`,
      userId: currentUser?._id,
      name: currentUser?.name || "You",
      text: commentText.trim(),
    };

    setLocalComments(prev => [...prev, optimistic]);
    setCommentText("");
    setShowComments(true);
    setIsPosting(true);

    const serverComments = await onComment(report._id, optimistic.text);
    if (serverComments) setLocalComments(serverComments);
    setIsPosting(false);
  };

  return (
    <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-base flex-shrink-0 select-none">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 dark:text-slate-100 leading-tight truncate">
              {report.userId?.name || "Unknown User"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
              <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{report.location}</span>
              <span className="flex-shrink-0">· {timeAgo}</span>
            </p>
          </div>
        </div>
        <div className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wide ${deptStyle.bg} ${deptStyle.text} ${deptStyle.border}`}>
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${deptStyle.dot}`}></span>
          {report.category || "General"}
        </div>
      </div>

      <div className="px-5 pb-4">
        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50 leading-snug mb-2">
          {report.title}
        </h3>
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-4 whitespace-pre-line">
          {report.description}
        </p>
      </div>

      {report.image && (
        <div className="mx-5 mb-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video bg-slate-100 dark:bg-slate-800">
          <img src={report.image} alt={report.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-6">
        <button
          onClick={handleLikeClick}
          className={`flex items-center gap-2 text-sm font-semibold transition-colors group ${
            liked ? "text-rose-500" : "text-slate-500 dark:text-slate-400 hover:text-rose-500"
          }`}
        >
          <span className={`p-1.5 rounded-full transition-colors ${
            liked ? "bg-rose-100 dark:bg-rose-900/30" : "group-hover:bg-rose-100 dark:group-hover:bg-rose-900/30"
          }`}>
            <svg className="w-[18px] h-[18px]" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </span>
          {likeCount} {likeCount === 1 ? "Like" : "Likes"}
        </button>

        <button
          onClick={() => setShowComments(v => !v)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
        >
          <span className="p-1.5 rounded-full group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </span>
          {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
        </button>
      </div>

      {showComments && (
        <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
          {commentCount > 0 && (
            <div className="px-5 pt-4 pb-2 space-y-3">
              {localComments.map((comment, i) => (
                <div key={comment._id || i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-xs flex-shrink-0">
                    {comment.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">{comment.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <form onSubmit={submitComment} className="px-5 py-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xs flex-shrink-0">
              {currentUser?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <input
              type="text"
              placeholder="Write a comment…"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={!commentText.trim() || isPosting}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-full disabled:opacity-40 hover:bg-indigo-700 transition-colors flex-shrink-0"
            >
              {isPosting ? "…" : "Post"}
            </button>
          </form>
        </div>
      )}
    </article>
  );
}

export default function HomeFeed() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setCurrentUser(await res.json());
      } catch { console.error("Failed to fetch user"); }
    };

    const fetchReports = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/report/all", { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || "Failed to load");
        setReports(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchReports();
  }, [router]);

  const handleLogout = () => { localStorage.removeItem("token"); router.push("/"); };

  const filteredReports = reports.filter(report => {
    const matchesCategory = categoryFilter === "All" || report.category === categoryFilter;
    const matchesLocation = report.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesCategory && matchesLocation;
  });

  const handleLike = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/report/like/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setReports(prev => prev.map(r => r._id === id ? { ...r, likes: data } : r));
        return data;
      }
      console.error("Like failed:", data);
    } catch (err) {
      console.error("Like error:", err);
    }
    return null;
  };

  const handleComment = async (id, text) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/report/comment/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (res.ok) {
        setReports(prev => prev.map(r => r._id === id ? { ...r, comments: data } : r));
        return data;
      }
      console.error("Comment failed:", data);
    } catch (err) {
      console.error("Comment error:", err);
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-500">
          <svg className="w-8 h-8 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-sm font-medium">Loading bulletin board…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col">
      <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/home" className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
            SmartCity
          </Link>
          <div className="flex items-center gap-2 sm:gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hidden sm:block">Dashboard</Link>
            <Link
              href="/report"
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              + Report
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">Community Bulletin Board</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {filteredReports.length} public {filteredReports.length === 1 ? "report" : "reports"} from your city
            </p>
          </div>
        </div>

        <div className="mb-8 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">Filter by Category</label>
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 px-4 text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Crime & Safety">Crime & Safety</option>
                <option value="Fire Emergency">Fire Emergency</option>
                <option value="Medical Emergency">Medical Emergency</option>
                <option value="Roads & Infrastructure">Roads & Infrastructure</option>
                <option value="Water Supply">Water Supply</option>
                <option value="Electricity">Electricity</option>
                <option value="Sanitation">Sanitation</option>
                <option value="Environment">Environment</option>
                <option value="Other">Other</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">Search Location</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Mangalore, Bangalore"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-2.5 px-10 text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm font-medium">
            {error}
          </div>
        )}

        {filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 mb-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-2xl">🔍</div>
            <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-2">No matching reports</h3>
            <p className="text-slate-500 text-sm mb-6">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredReports.map((report) => (
              <ReportCard
                key={report._id}
                report={report}
                currentUser={currentUser}
                onLike={handleLike}
                onComment={handleComment}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
