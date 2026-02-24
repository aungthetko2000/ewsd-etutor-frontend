import { useState } from "react";

const BlogUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        
        setUploading(true);
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += 10;
            setProgress(currentProgress);
            if (currentProgress >= 100) {
                clearInterval(interval);
                setUploading(false);
            }
        }, 200);
    };

    const removeImage = () => {
        setPreviewUrl(null);
        setProgress(0);
    };

    return (
        <div className="w-full bg-white border border-gray-100 rounded-[2rem] shadow-sm overflow-hidden transition-all hover:shadow-md">
            <form className="flex flex-col">
                {/* 1. Title Row */}
                <div className="flex items-center justify-between p-5 border-b border-gray-50">
                    <input
                        type="text"
                        placeholder="Blog Title..."
                        className="flex-1 bg-transparent text-xl font-black text-gray-800 outline-none placeholder:text-gray-200"
                    />
                    <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 transition-all active:scale-95">
                        Publish
                    </button>
                </div>

                {/* 2. Text Content Area */}
                <div className="px-5 pt-4">
                    <textarea
                        rows="3"
                        placeholder="What's on your mind?..."
                        className="w-full bg-transparent text-sm text-gray-500 outline-none resize-none leading-relaxed placeholder:text-gray-300 font-medium"
                    ></textarea>
                </div>

                {/* 3. Dynamic Image Preview Section (Only shows when needed) */}
                {(previewUrl || uploading) && (
                    <div className="px-5 pb-4">
                        <div className="relative h-48 w-full rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 group">
                            {previewUrl && (
                                <img
                                    src={previewUrl}
                                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${uploading ? 'blur-md grayscale opacity-50' : 'blur-0 grayscale-0 opacity-100'}`}
                                    alt="Preview"
                                />
                            )}
                            
                            {/* Loading Overlay */}
                            {uploading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm">
                                    <svg className="w-12 h-12 transform -rotate-90">
                                        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-200" />
                                        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={125.6} strokeDashoffset={125.6 - (progress / 100) * 125.6} className="text-orange-500 transition-all duration-300" />
                                    </svg>
                                    <span className="mt-2 text-[10px] font-black text-gray-600 uppercase tracking-widest">Uploading {progress}%</span>
                                </div>
                            )}

                            {/* Remove Button */}
                            {!uploading && previewUrl && (
                                <button 
                                    onClick={removeImage}
                                    className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-xl text-gray-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* 4. Bottom Row: Quick Tools */}
                <div className="flex items-center justify-between p-4 bg-gray-50/50 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-orange-300 hover:shadow-sm transition-all group">
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-[11px] font-black text-gray-500 uppercase tracking-tight">
                                {previewUrl ? "Change Cover" : "Add Cover"}
                            </span>
                            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                        </label>
                        
                        <button type="button" className="p-2 text-gray-400 hover:bg-white hover:text-indigo-500 rounded-xl transition-all">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                        </button>
                    </div>

                    <div className="flex items-center text-[10px] font-bold text-gray-300 uppercase tracking-widest px-2">
                        Draft Auto-saved
                    </div>
                </div>
            </form>
        </div>
    );
};

export default BlogUpload;