import React from "react";

const BlogList = () => {
    const posts = [
        {
            id: 1,
            title: "Quantum Physics: The Basics",
            desc: "An entry-level guide to understanding subatomic particles and wave-particle duality. Perfect for beginners...",
            date: "Feb 20",
            cat: "Science",
            color: "bg-indigo-500",
            image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600",
        },
        {
            id: 2,
            title: "10 Math Hacks",
            desc: "Quick mental math tricks that will save you time during your exams. Including the 'Multiply by 11' rule and more...",
            date: "Feb 18",
            cat: "Math",
            color: "bg-orange-500",
            image: "https://images.unsplash.com/photo-1509228468518-180dd48a5791?auto=format&fit=crop&q=80&w=600",
        },
        {
            id: 3,
            title: "Modern Poetry",
            desc: "Exploring the shift from traditional rhyme schemes to free verse in the 21st century...",
            date: "Feb 15",
            cat: "Arts",
            color: "bg-rose-500",
            image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=600",
        },
    ];

    const popular = [
        { id: 1, title: "How to Ace Exams", views: "12.4k", icon: "🔥" },
        { id: 2, title: "Python for Beginners", views: "8.2k", icon: "🐍" },
        { id: 3, title: "History of Art", views: "5.1k", icon: "🎨" },
    ];

    return (
        <div className="w-full max-w-[1400px] mx-auto p-4 flex flex-col lg:flex-row gap-8">
            
            {/* --- LEFT SECTION: MAIN BLOG LIST --- */}
            <div className="flex-1">
                <div className="mb-8 px-2 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-gray-800 tracking-tight">Recent Publications</h2>
                    <button className="text-xs font-bold text-orange-500 hover:bg-orange-50 px-4 py-2 rounded-full transition-all">Back</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="group relative flex flex-col bg-white border border-gray-100 rounded-[2.5rem] p-2 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-3"
                        >
                            <div className="relative h-48 w-full overflow-hidden rounded-[2rem] mb-4">
                                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                <div className="absolute top-4 left-4">
                                    <span className="text-[9px] font-black text-white bg-black/20 backdrop-blur-md px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">
                                        {post.cat}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-gray-50/50 rounded-[2rem] p-6 flex-grow flex flex-col">
                                <div className="flex justify-between items-center mb-4">
                                    <span className={`w-10 h-1 rounded-full ${post.color} opacity-40`} />
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{post.date}</span>
                                </div>
                                <h4 className="text-xl font-black text-gray-800 leading-tight mb-3 group-hover:text-orange-600 transition-colors">{post.title}</h4>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium line-clamp-3 mb-6">{post.desc}</p>
                                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
                                    <button className="text-[11px] font-black uppercase tracking-widest text-gray-900 flex items-center gap-1 hover:text-orange-500 transition-colors">
                                        Full Read
                                        <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </button>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                        <button className="p-2 bg-white rounded-xl shadow-sm border border-gray-50 text-gray-400 hover:text-indigo-500 transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                                        <button className="p-2 bg-white rounded-xl shadow-sm border border-gray-50 text-gray-400 hover:text-red-500 transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- RIGHT SECTION: POPULAR SIDEBAR --- */}
            <div className="w-full lg:w-80 flex flex-col gap-6">
                <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /></svg>
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-800">Popular</h3>
                    </div>

                    <div className="space-y-6">
                        {popular.map((item, index) => (
                            <div key={item.id} className="group cursor-pointer">
                                <div className="flex items-start gap-4">
                                    <span className="text-2xl">{item.icon}</span>
                                    <div>
                                        <h5 className="text-sm font-bold text-gray-800 group-hover:text-orange-500 transition-colors leading-tight mb-1">
                                            {item.title}
                                        </h5>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{item.views} readers</span>
                                            <span className="w-1 h-1 rounded-full bg-orange-200" />
                                            <span className="text-[10px] font-bold text-orange-400">#0{index + 1}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-8 py-4 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 rounded-2xl hover:bg-orange-50 hover:text-orange-500 transition-all">
                        Trending Topics
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlogList;