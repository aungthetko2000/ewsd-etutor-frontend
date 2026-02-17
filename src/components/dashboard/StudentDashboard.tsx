import { useState } from "react";

const IconDashboard = ({ className }: any) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
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

const IconMessage = ({ className }: any) => (
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
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
        />
    </svg>
);

const IconSettings = ({ className }: any) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c0 .69.4 1.31 1.02 1.59.31.14.65.21.98.21H21a2 2 0 110 4h-.09c-.69 0-1.31.4-1.51 1z" />
    </svg>
);

const StudentDashboard = () => {
    const [activeTab, setActiveTab] = useState("courses");

    const students = [
        {
            id: 1,
            name: "Khaing Phu Wai Kay",
            email: "khaing@example.com",
            course: "Computing",
            joined: "Jan 2026",
        },
        {
            id: 2,
            name: "John Doe",
            email: "john@example.com",
            course: "Business",
            joined: "Feb 2026",
        },
    ];

    const tutors = [
        { id: 1, name: "Dr. Smith", subject: "Java Programming", status: "Online" },
        {
            id: 2,
            name: "Prof. Sarah",
            subject: "Web Development",
            status: "Offline",
        },
    ];

    const menu = [
        { key: "overview", label: "Dashboard", icon: IconDashboard },
        { key: "schedule", label: "Schedule", icon: IconSchedule },
        { key: "message", label: "Message", icon: IconMessage },
        { key: "settings", label: "Setting", icon: IconSettings },
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r flex flex-col">
                {/* Logo Section */}
                <div className="px-6 py-6 flex justify-center border-b">
                    <div className="relative">
                        {/* Glow */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 blur-lg opacity-40"></div>

                        {/* Logo */}
                        <div
                            className="relative flex items-center justify-center w-14 h-14
                    rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500
                    shadow-xl ring-1 ring-white/20"
                        >
                            <svg
                                className="w-7 h-7 text-white drop-shadow"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {menu.map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm transition
                ${activeTab === key
                                    ? "bg-orange-50 text-orange-600 font-semibold"
                                    : "text-gray-500 hover:bg-gray-100"
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            {label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Content */}
            <div className="flex-1 flex flex-col">
                {/* Top bar */}
                <header className="bg-slate-800 text-white px-8 py-3 flex justify-between items-center text-xs">
                    <span>Student DashBoard</span>
                    <button className="cursor-pointer bg-gradient-to-br from-orange-500 to-rose-500 px-4 py-2 rounded font-bold">
                        Log Out
                    </button>
                </header>

                {/* Main */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <h1 className="text-2xl font-bold capitalize mb-6 text-slate-800">
                        {activeTab}
                    </h1>

                    {/* Students */}
                    {activeTab === "students" && (
                        <div className="bg-white rounded-xl border p-6">
                            <table className="w-full text-sm">
                                <thead className="text-xs text-gray-400 uppercase border-b">
                                    <tr>
                                        <th className="text-left py-3">Name</th>
                                        <th>Course</th>
                                        <th>Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((s) => (
                                        <tr key={s.id} className="border-b last:border-0">
                                            <td className="py-3">
                                                <p className="font-medium">{s.name}</p>
                                                <p className="text-xs text-gray-400">{s.email}</p>
                                            </td>
                                            <td className="text-center">{s.course}</td>
                                            <td className="text-center text-gray-500">{s.joined}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Tutors */}
                    {activeTab === "tutors" && (
                        <div className="grid grid-cols-2 gap-6">
                            {tutors.map((t) => (
                                <div
                                    key={t.id}
                                    className="bg-white p-6 rounded-xl border flex items-center gap-4"
                                >
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center font-bold text-orange-600">
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{t.name}</p>
                                        <p className="text-xs text-gray-500">{t.subject}</p>
                                        <span
                                            className={`text-xs ${t.status === "Online" ? "text-green-500" : "text-gray-400"}`}
                                        >
                                            {t.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Courses & Overview */}
                    {(activeTab === "courses" || activeTab === "overview") && (
                        <div className="border-2 border-dashed rounded-xl p-16 text-center text-gray-400">
                            {activeTab} content here
                        </div>
                    )}

                    {/* Settings */}
                    {activeTab === "settings" && (
                        <div className="max-w-xl bg-white p-8 rounded-xl border space-y-6">
                            <div>
                                <label className="text-xs font-bold text-gray-500">
                                    Institution Name
                                </label>
                                <input
                                    className="w-full mt-2 border p-2 rounded"
                                    defaultValue="QEDUCATO University"
                                />
                            </div>
                            <button className="w-full bg-slate-800 text-white py-2 rounded font-bold">
                                Save Changes
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default StudentDashboard;
