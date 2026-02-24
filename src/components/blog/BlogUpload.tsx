const BlogUpload = () => {

    return (
        <div className="w-full bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden transition-all hover:shadow-md">
            <form className="flex flex-col">
                {/* Top Row: Title & Action */}
                <div className="flex items-center justify-between p-4 border-b border-gray-50">
                    <div className="flex-1 mr-4">
                        <input
                            type="text"
                            placeholder="Blog Title..."
                            className="w-full bg-transparent text-lg font-bold text-gray-800 outline-none placeholder:text-gray-300"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button type="button" className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                        <button type="submit" className="cursor-pointer px-5 py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-sm font-bold rounded-xl shadow-sm hover:opacity-90 transition-all active:scale-95">
                            Publish
                        </button>
                    </div>
                </div>

                {/* Middle Row: Content Area */}
                <div className="p-4">
                    <textarea
                        rows="3"
                        placeholder="Write a quick lesson or update..."
                        className="w-full bg-transparent text-sm text-gray-600 outline-none resize-none leading-relaxed placeholder:text-gray-300"
                    ></textarea>
                </div>

                {/* Bottom Row: Quick Tools */}
                <div className="flex items-center justify-between p-3 bg-gray-50/50 border-t border-gray-50">
                    <div className="flex items-center gap-1">
                        {/* Compact Image Upload Button */}
                        <label className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-orange-300 transition-all group">
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-[11px] font-bold text-gray-500 group-hover:text-gray-700">Add Cover</span>
                            <input type="file" className="hidden" />
                        </label>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default BlogUpload;