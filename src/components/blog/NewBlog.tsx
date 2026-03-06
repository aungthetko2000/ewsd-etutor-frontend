import React, { useState, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface NewBlogProps {
  show: boolean;
  onClose: () => void;
  onSave?: (blog: BlogData) => void;
}

interface BlogData {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  image: string | null;
  views: number;
  comments: number;
  helpful: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: "React",      icon: "⚛️" },
  { label: "TypeScript", icon: "🔷" },
  { label: "CSS",        icon: "🎨" },
  { label: "Backend",    icon: "🛠️" },
  { label: "JavaScript", icon: "✨" },
];

const SUGGESTED_TAGS = [
  "React", "TypeScript", "JavaScript", "CSS",
  "Hooks", "API", "Performance", "Testing", "UI", "Node.js",
];

// ─── Main Component ───────────────────────────────────────────────────────────
const NewBlog: React.FC<NewBlogProps> = ({ show, onClose, onSave }) => {
  const [title,    setTitle]    = useState("");
  const [excerpt,  setExcerpt]  = useState("");
  const [category, setCategory] = useState("");
  const [tags,     setTags]     = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [image,    setImage]    = useState<File | null>(null);
  const [preview,  setPreview]  = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [errors,   setErrors]   = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!show) return null;

  // ─── Image Handlers ──────────────────────────────────────────────────────────
  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };
  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ─── Tag Handlers ────────────────────────────────────────────────────────────
  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed) && tags.length < 6)
      setTags(prev => [...prev, trimmed]);
    setTagInput("");
  };
  const removeTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag));
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags(prev => prev.slice(0, -1));
    }
  };

  // ─── Validation & Submit ─────────────────────────────────────────────────────
  const inputCls = (field: string) =>
    `w-full rounded-xl border bg-gray-50 px-3 py-2.5 sm:px-4 text-sm text-gray-800 outline-none transition ${
      errors[field]
        ? "border-rose-400 focus:ring-2 focus:ring-rose-100"
        : "border-gray-200 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
    }`;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim())    e.title    = "Blog title is required.";
    if (!category.trim()) e.category = "Please select a category.";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    const newBlog: BlogData = {
      id: Date.now(),
      title: title.trim(),
      excerpt: excerpt.trim(),
      category,
      tags,
      date: new Date().toISOString().split("T")[0],
      image: preview,
      views: 0,
      comments: 0,
      helpful: 0,
    };
    onSave?.(newBlog);
    setTitle(""); setExcerpt(""); setCategory("");
    setTags([]); setTagInput("");
    setImage(null); setPreview(null); setErrors({});
    onClose();
  };

  const suggestedFiltered = SUGGESTED_TAGS.filter(
    t => !tags.includes(t) && t.toLowerCase().includes(tagInput.toLowerCase())
  );

  return (
    // ── Backdrop ──────────────────────────────────────────────────────────────
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm p-0 sm:p-4 lg:p-6">

      {/* ── Modal Card ────────────────────────────────────────────────────────── */}
      <div className="
        w-full bg-white shadow-2xl border border-gray-100
        rounded-t-3xl sm:rounded-3xl
        sm:max-w-lg lg:max-w-2xl
        max-h-[92vh] sm:max-h-[88vh]
        flex flex-col
        overflow-hidden
      ">

        {/* Drag handle — mobile only */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
          <div className="h-1 w-10 rounded-full bg-gray-200" />
        </div>

        {/* ── Header ───────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-3 sm:px-6 sm:py-4 shrink-0 border-b border-gray-100">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 leading-tight">Create New Blog</h3>
            <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">Fill in the details below to publish</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition shrink-0 ml-4"
          >
            ✕
          </button>
        </div>

        {/* ── Scrollable Body ───────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          {/* Single column on mobile/tablet, two columns on lg+ */}
          <div className="px-5 sm:px-6 py-4 space-y-4 lg:grid lg:grid-cols-2 lg:gap-x-6 lg:gap-y-4 lg:space-y-0 lg:items-start">

            {/* ── LEFT: Image + Title + Excerpt ─────────────────────────────────── */}
            <div className="space-y-4">

              {/* Cover Image */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-600">Cover Image</label>
                {preview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-gray-200 group">
                    <img src={preview} alt="Cover" className="w-full h-36 sm:h-44 object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 rounded-xl bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-white transition"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Change
                      </button>
                      <button
                        onClick={removeImage}
                        className="flex items-center gap-1.5 rounded-xl bg-rose-500/90 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500 transition"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2 rounded-lg bg-black/50 px-2 py-0.5 text-[10px] text-white font-medium truncate max-w-[80%]">
                      {image?.name}
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed h-36 sm:h-44 cursor-pointer transition ${
                      dragging
                        ? "border-orange-400 bg-orange-50"
                        : "border-gray-200 bg-gray-50 hover:border-orange-300 hover:bg-orange-50/50"
                    }`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full transition ${dragging ? "bg-orange-100" : "bg-gray-100"}`}>
                      <svg className={`w-5 h-5 transition ${dragging ? "text-orange-500" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-center px-4">
                      <p className={`text-sm font-semibold transition ${dragging ? "text-orange-500" : "text-gray-500"}`}>
                        {dragging ? "Drop to upload" : "Upload cover image"}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">Drag & drop or click · PNG, JPG, WEBP</p>
                    </div>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>

              {/* Blog Title */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-600">Blog Title</label>
                <input
                  className={inputCls("title")}
                  placeholder="e.g., Getting Started with React Hooks"
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); setErrors(p => ({ ...p, title: "" })); }}
                />
                {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title}</p>}
              </div>

              {/* Excerpt */}
              <div>
                <div className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-3 sm:px-4 py-3 focus-within:border-orange-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100 transition">
                  <svg className="mt-0.5 w-4 h-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h10" />
                  </svg>
                  <textarea
                    rows={3}
                    className="flex-1 resize-none bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                    placeholder="Brief summary of your blog..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                  />
                </div>
              </div>

            </div>

            {/* ── RIGHT: Category + Tags ─────────────────────────────────────────── */}
            <div className="space-y-4">

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">Category</label>
                <div className={`rounded-2xl border overflow-hidden ${errors.category ? "border-rose-300" : "border-gray-200"}`}>
                  {CATEGORIES.map((cat, idx) => (
                    <button
                      key={cat.label}
                      onClick={() => { setCategory(cat.label); setErrors(p => ({ ...p, category: "" })); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition text-left ${
                        idx !== CATEGORIES.length - 1 ? "border-b border-gray-100" : ""
                      } ${category === cat.label
                          ? "bg-orange-50 text-orange-600"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span className="flex-1">{cat.label}</span>
                      {category === cat.label && (
                        <svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
                {errors.category && <p className="mt-1 text-xs text-rose-500">{errors.category}</p>}
              </div>

              {/* Tags */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-600">Tags</label>
                  <span className="text-xs text-gray-400">{tags.length}/6</span>
                </div>

                <div className={`flex flex-wrap gap-1.5 rounded-xl border bg-gray-50 px-3 py-2 transition focus-within:border-orange-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100 ${
                  tags.length >= 6 ? "opacity-60 pointer-events-none border-gray-200" : "border-gray-200"
                }`}>
                  {tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 rounded-lg bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-600">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="ml-0.5 text-orange-400 hover:text-orange-600 transition leading-none">×</button>
                    </span>
                  ))}
                  <input
                    className="min-w-[80px] flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                    placeholder={tags.length === 0 ? "Type & press Enter..." : "Add more..."}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    disabled={tags.length >= 6}
                  />
                </div>

                {/* Suggested */}
                {tags.length < 6 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {suggestedFiltered.slice(0, 6).map(tag => (
                      <button
                        key={tag}
                        onClick={() => addTag(tag)}
                        className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-500 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-500 transition"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* ── Footer ───────────────────────────────────────────────────────────── */}
        <div className="shrink-0 px-5 sm:px-6 py-4 border-t border-gray-100 bg-white">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 py-2.5 text-sm font-bold text-white shadow-md hover:opacity-90 active:scale-95 transition-all"
            >
              Create Blog
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NewBlog;