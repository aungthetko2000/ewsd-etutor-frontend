import { useNavigate } from "react-router-dom";

type MenuItem = {
    key: string;
    label: string;
    icon: React.ComponentType<any>;
};

type SidebarProps = {
    menu: MenuItem[];
    activeTab: string;
    onTabChange: (key: string) => void;
    isOpen: boolean;
    onClose: () => void;
};

const SideBar = ({
    menu,
    activeTab,
    onTabChange,
    isOpen,
    onClose,
}: SidebarProps) => {
    const navigate = useNavigate();

    const handleLogOut = () => {
        sessionStorage.clear();
        navigate("/");
    };
    
    return (
        <aside className={`
    /* 1. Mobile Styles: Floating on top */
    fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col
    transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full"}

    /* 2. Desktop Styles: Sitting side-by-side */
    lg:static lg:translate-x-0 lg:z-auto
`}>
            {/* Mobile Close Button */}
            <button
                onClick={onClose}
                className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
            <div className="p-8 mb-4">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
                        <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-500 to-rose-500 shadow-lg shadow-orange-200">
                            <svg
                                className="w-6 h-6 text-white"
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
                    <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500">
                        QEducato
                    </span>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1.5">
                {menu.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => onTabChange(key)}
                        className={`cursor-pointer flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200
                                        ${activeTab === key
                                ? "bg-gradient-to-br from-orange-50 to-rose-50 text-rose-600 shadow-sm shadow-orange-100"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                            }`}
                    >
                        <Icon
                            className={`w-5 h-5 ${activeTab === key ? "text-orange-500" : "text-slate-400"}`}
                        />
                        {label}
                    </button>
                ))}
            </nav>
            {/* Add this section at the bottom of your <aside> */}
            <div className="p-4 mt-auto border-t border-slate-100">
                <button
                    onClick={() => handleLogOut()}
                    className="cursor-pointer group relative flex items-center justify-center gap-3 w-full bg-slate-900 text-white px-5 py-3.5 rounded-xl font-semibold text-sm transition-all hover:bg-gradient-to-br from-orange-500 to-rose-500 hover:shadow-lg hover:shadow-orange-200 active:scale-[0.98]"
                >
                    {/* Modern Exit SVG (Placed before text) */}
                    <svg
                        className="w-5 h-5 opacity-80 group-hover:-translate-x-1 group-hover:opacity-100 transition-all duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3-3H21m0 0l-3-3m3 3l-3 3"
                        />
                    </svg>

                    <span>Log Out</span>
                </button>
            </div>
        </aside>
    );
};

export default SideBar;
