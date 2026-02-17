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

const IconAllocate = ({ className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={className}>
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
    </svg>

);


const StaffDashboard = () => {
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
        { key: "schedule", label: "Allocation", icon: IconAllocate },
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
                    <span>Staff DashBoard</span>
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

export default StaffDashboard;
