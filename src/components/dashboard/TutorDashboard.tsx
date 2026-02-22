import { useState } from "react";
import CalendarSchedule from "../schedule/CalendarSchedule";

const IconDashboard = ({ className }: any) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconSchedule = ({ className }: any) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        className={className}
    >
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
    </svg>
);

const IconStudents = ({ className }: any) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const IconTutors = ({ className }: any) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const IconSettings = ({ className }: any) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const TutorDashBoard = () => {
    const [activeTab, setActiveTab] = useState("overview");

    const students = [
        { id: 1, name: "Khaing Phu Wai Kay", email: "khaing@example.com", course: "Computing", joined: "Jan 2026", img: "KP" },
        { id: 2, name: "John Doe", email: "john@example.com", course: "Business", joined: "Feb 2026", img: "JD" },
    ];

    const tutors = [
        { id: 1, name: "Dr. Smith", subject: "Java Programming", status: "Online" },
        { id: 2, name: "Prof. Sarah", subject: "Web Development", status: "Offline" },
    ];

    const menu = [
        { key: "overview", label: "Dashboard", icon: IconDashboard },
        { key: "schedule", label: "Schedule", icon: IconSchedule },
        { key: "students", label: "Students", icon: IconStudents },
        { key: "tutors", label: "Tutors", icon: IconTutors },
        { key: "settings", label: "Settings", icon: IconSettings },
    ];

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
                <div className="p-8 mb-4">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-orange-500 to-rose-500 blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
                            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-500 to-rose-500 shadow-lg shadow-orange-200">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                        </div>
                        <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500">
                            QEducato
                        </span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1.5">
                    {menu.map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200
                                ${activeTab === key
                                    ? "bg-orange-50 text-orange-600 shadow-sm shadow-orange-100"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${activeTab === key ? "text-orange-500" : "text-slate-400"}`} />
                            {label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 mt-auto border-t border-slate-100">
                    <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-600">AD</div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold truncate">Tutor</p>
                            <p className="text-xs text-slate-400 truncate">tutor@qeducato.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top bar */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-10 flex justify-between items-center sticky top-0 z-20">
                    <div className="flex flex-col">
                        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">Portal</h2>
                        <span className="text-sm font-bold text-slate-700">Tutor Dashboard</span>
                    </div>
                    <button className="group relative flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
                        <span>Log Out</span>
                        <svg className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </button>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 p-10 overflow-y-auto custom-scrollbar">
                    <div className="max-w-6xl mx-auto">
                        <header className="mb-8">
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 capitalize">
                                {activeTab}
                            </h1>
                        </header>

                        {/* Schedule Tab */}
                        <h1 className="text-2xl font-bold capitalize mb-6 text-slate-800">
                       {activeTab === "schedule" && <CalendarSchedule />}
                        </h1>

                        {/* Students Tab */}
                        {activeTab === "students" && (
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Student Details</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Enrolled Course</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">Join Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {students.map((s) => (
                                            <tr key={s.id} className="hover:bg-slate-50/80 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                                                            {s.img}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-700 group-hover:text-orange-600 transition-colors">{s.name}</p>
                                                            <p className="text-xs text-slate-400">{s.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                                                        {s.course}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm text-slate-500 font-medium">
                                                    {s.joined}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Tutors Tab */}
                        {activeTab === "tutors" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {tutors.map((t) => (
                                    <div key={t.id} className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all">
                                        <div className="flex items-center gap-5">
                                            <div className="relative">
                                                <div className="w-16 h-16 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl flex items-center justify-center font-bold text-xl text-orange-600 border border-orange-200">
                                                    {t.name[0]}
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${t.status === "Online" ? "bg-emerald-500" : "bg-slate-300"}`}></div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold text-lg text-slate-800">{t.name}</h3>
                                                    <span className={`text-[10px] uppercase tracking-widest font-heavy px-2 py-0.5 rounded-md ${t.status === "Online" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                                                        {t.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-500 mb-2">{t.subject}</p>
                                                <button className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors">View Profile &rarr;</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Overview Content */}
                        {activeTab === "overview" && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { label: 'Total Students', value: '1,284', color: 'from-blue-500 to-indigo-600' },
                                    { label: 'Active Courses', value: '42', color: 'from-orange-500 to-rose-500' },
                                    { label: 'Avg Attendance', value: '94%', color: 'from-emerald-500 to-teal-600' }
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative group">
                                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-[0.03] -mr-8 -mt-8 rounded-full group-hover:scale-150 transition-transform duration-500`}></div>
                                        <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                                        <p className="text-4xl font-black text-slate-800 mt-2">{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === "settings" && (
                            <div className="max-w-2xl bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
                                <div className="space-y-8">
                                    <div className="group">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">
                                            Institution Name
                                        </label>
                                        <input
                                            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-medium"
                                            defaultValue="QEDUCATO University"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button className="bg-slate-100 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                                            Discard
                                        </button>
                                        <button className="bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 shadow-lg shadow-slate-200 hover:-translate-y-0.5 transition-all">
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default TutorDashBoard;