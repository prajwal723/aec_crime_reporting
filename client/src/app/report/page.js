"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const DEPARTMENTS = [
  { id: "police", label: "Police Department", icon: "🚔", description: "Crime, theft, violence, vandalism" },
  { id: "fire", label: "Fire & Rescue Services", icon: "🚒", description: "Fires, rescues, hazardous spills" },
  { id: "medical", label: "Emergency Medical Services", icon: "🚑", description: "Medical emergencies, accidents" },
  { id: "sanitation", label: "Sanitation & Waste Mgmt.", icon: "🗑️", description: "Garbage, sewage, cleanliness" },
  { id: "roads", label: "Public Works & Roads", icon: "🛣️", description: "Potholes, road damage, flooding" },
  { id: "electricity", label: "Electricity Board", icon: "⚡", description: "Power outages, faulty wiring" },
  { id: "water", label: "Water Supply Authority", icon: "💧", description: "Water shortage, pipe leaks" },
  { id: "environment", label: "Environment Department", icon: "🌳", description: "Pollution, illegal dumping, deforestation" },
];

const OFFICIAL_ENTITIES = [
  "@MunicipalCorporation",
  "@CityPoliceHQ",
  "@DisasterMgmtCell",
  "@PublicHealthDept",
  "@UrbanDevelopment",
  "@TrafficControl",
  "@ParksDepartment",
  "@ChildWelfareBoard",
];

const CATEGORY_OPTIONS = [
  "Crime & Safety",
  "Fire Emergency",
  "Medical Emergency",
  "Roads & Infrastructure",
  "Water Supply",
  "Electricity",
  "Sanitation",
  "Environment",
  "Other",
];

const INITIAL_FORM = {
  title: "",
  description: "",
  category: "",
  department: "",
  location: "",
  tags: [],
  image: "",
};

export default function ReportIssue() {
  const router = useRouter();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData((prev) => ({ ...prev, image: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const toggleTag = (tag) => {
    setFormData((prev) => {
      const exists = prev.tags.includes(tag);
      return { ...prev, tags: exists ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag] };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.category) newErrors.category = "Please select a category.";
    if (!formData.department) newErrors.department = "Please select a department to route this report.";
    if (!formData.location.trim()) newErrors.location = "Location is required.";
    if (!formData.description.trim()) newErrors.description = "Description is required.";
    if (!formData.image) newErrors.image = "Photo evidence is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          location: formData.location,
          image: formData.image,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit report.");

      setSubmitted(true);
      setTimeout(() => router.push("/home"), 2000);
    } catch (err) {
      setServerError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-white">Report Submitted!</h2>
          <p className="text-slate-400 text-lg">
            The <span className="text-emerald-400 font-semibold">{DEPARTMENTS.find((d) => d.id === formData.department)?.label || "relevant department"}</span> has been notified. Your report is now live on the community feed.
          </p>
          <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            Redirecting you to the feed...
          </div>
          <button
            onClick={() => router.push("/home")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            View My Post Now →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white">File a Report</h1>
          <p className="text-xs text-slate-500">All fields marked * are required</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm font-semibold hover:bg-red-500/20 transition-colors"
        >
          Sign Out
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-10 pb-20 space-y-8">
        {serverError && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/40 text-red-300 text-sm font-medium flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <h2 className="font-bold text-lg text-white border-b border-slate-800 pb-3">1. Basic Information</h2>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Large pothole on 5th Avenue"
                className={`w-full px-4 py-3 bg-slate-800 border ${errors.title ? "border-rose-500" : "border-slate-700 focus:border-indigo-500"} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all`}
                value={formData.title}
                onChange={(e) => { setFormData((p) => ({ ...p, title: e.target.value })); setErrors((p) => ({ ...p, title: "" })); }}
              />
              {errors.title && <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1">⚠ {errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                  Category <span className="text-rose-400">*</span>
                </label>
                <select
                  className={`w-full px-4 py-3 bg-slate-800 border ${errors.category ? "border-rose-500" : "border-slate-700 focus:border-indigo-500"} rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all appearance-none`}
                  value={formData.category}
                  onChange={(e) => { setFormData((p) => ({ ...p, category: e.target.value })); setErrors((p) => ({ ...p, category: "" })); }}
                >
                  <option value="" className="bg-slate-800 text-slate-400">-- Select Category --</option>
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c} className="bg-slate-800">{c}</option>
                  ))}
                </select>
                {errors.category && <p className="text-rose-400 text-xs mt-1.5">⚠ {errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                  Location <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="123 Main St, Near Central Park…"
                  className={`w-full px-4 py-3 bg-slate-800 border ${errors.location ? "border-rose-500" : "border-slate-700 focus:border-indigo-500"} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all`}
                  value={formData.location}
                  onChange={(e) => { setFormData((p) => ({ ...p, location: e.target.value })); setErrors((p) => ({ ...p, location: "" })); }}
                />
                {errors.location && <p className="text-rose-400 text-xs mt-1.5">⚠ {errors.location}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                Description <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows="4"
                placeholder="Provide as much detail as possible — time, severity, any witnesses…"
                className={`w-full px-4 py-3 bg-slate-800 border ${errors.description ? "border-rose-500" : "border-slate-700 focus:border-indigo-500"} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all resize-none`}
                value={formData.description}
                onChange={(e) => { setFormData((p) => ({ ...p, description: e.target.value })); setErrors((p) => ({ ...p, description: "" })); }}
              />
              {errors.description && <p className="text-rose-400 text-xs mt-1.5">⚠ {errors.description}</p>}
            </div>
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="font-bold text-lg text-white">2. Route to Department <span className="text-rose-400">*</span></h2>
              <p className="text-slate-500 text-sm mt-0.5">Select the official department responsible for handling this type of issue.</p>
            </div>
            {errors.department && (
              <p className="text-rose-400 text-sm flex items-center gap-1.5 font-medium">⚠ {errors.department}</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEPARTMENTS.map((dept) => {
                const isSelected = formData.department === dept.id;
                return (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => { setFormData((p) => ({ ...p, department: dept.id })); setErrors((p) => ({ ...p, department: "" })); }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{dept.icon}</span>
                      <div>
                        <div className={`font-semibold text-sm ${isSelected ? "text-indigo-300" : "text-slate-200"}`}>{dept.label}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{dept.description}</div>
                      </div>
                      {isSelected && (
                        <div className="ml-auto w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="font-bold text-lg text-white">3. Tag Official Entities <span className="text-slate-500 font-normal text-sm">(Optional)</span></h2>
              <p className="text-slate-500 text-sm mt-0.5">Select any additional city bodies you want to notify directly.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {OFFICIAL_ENTITIES.map((entity) => {
                const isTagged = formData.tags.includes(entity);
                return (
                  <button
                    key={entity}
                    type="button"
                    onClick={() => toggleTag(entity)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                      isTagged
                        ? "bg-indigo-600 border-indigo-500 text-white"
                        : "bg-slate-800 border-slate-700 text-slate-400 hover:border-indigo-500/50 hover:text-slate-200"
                    }`}
                  >
                    {isTagged ? "✓ " : ""}{entity}
                  </button>
                );
              })}
            </div>
            {formData.tags.length > 0 && (
              <p className="text-xs text-slate-500">{formData.tags.length} entit{formData.tags.length > 1 ? "ies" : "y"} tagged</p>
            )}
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="font-bold text-lg text-white">4. Photo Evidence <span className="text-rose-400">*</span></h2>
              <p className="text-slate-500 text-sm mt-0.5">Clear photographic evidence helps authorities act faster.</p>
            </div>
            {errors.image && (
              <p className="text-rose-400 text-sm flex items-center gap-1.5 font-medium">⚠ {errors.image}</p>
            )}
            <div className="flex flex-col items-center gap-4 py-4">
              <input type="file" accept="image/*" id="file-upload" className="hidden" onChange={handleImageChange} />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-slate-800 border border-dashed border-slate-600 text-slate-300 rounded-xl text-sm font-semibold hover:border-indigo-500 hover:text-indigo-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upload Photo Evidence
              </label>
              {formData.image && (
                <div className="w-full max-w-sm rounded-xl overflow-hidden border border-slate-700 relative">
                  <img src={formData.image} alt="Preview" className="w-full h-48 object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, image: "" }))}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/60 text-white rounded-full flex items-center justify-center text-xs hover:bg-black/80"
                  >✕</button>
                </div>
              )}
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Submitting Report…
              </>
            ) : (
              "Submit Secure Report →"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
