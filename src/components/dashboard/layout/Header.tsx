const Header = () => {
    return (
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-8 flex justify-between items-center sticky top-0 z-20">
            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Portal</h2>
                </div>
                <span className="text-lg font-extrabold text-slate-800 tracking-tight">Tutor Dashboard</span>
            </div>

            <div className="flex items-center gap-4">
                <button className="cursor-pointer relative p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-colors">
                    <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></div>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                </button>

                <div className="group flex items-center gap-3 pl-4 border-l border-slate-200 cursor-pointer">
                    <div className="flex flex-col items-end hidden sm:flex">
                        <p className="text-sm font-bold text-slate-700 group-hover:text-orange-600 transition-colors">Admin Tutor</p>
                        <p className="text-[11px] font-medium text-slate-400">tutor@qeducato.com</p>
                    </div>

                    <div className="relative">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-700 transition-transform group-hover:scale-105">
                            AD
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;