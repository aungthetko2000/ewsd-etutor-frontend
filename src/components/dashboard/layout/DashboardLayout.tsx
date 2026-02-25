import { useState } from "react";
import Header from "./Header";
import SideBar from "./SideBar";

type DashboardLayoutProps = {
    menu: any[];
    activeTab: string;
    onTabChange: (key: string) => void;
    children: React.ReactNode;
    name: string;
};

const DashboardLayout = ({
    menu,
    activeTab,
    onTabChange,
    children,
    name
}: DashboardLayoutProps) => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="relative flex h-screen w-full bg-[#F8FAFC] overflow-hidden">
            {/* Sidebar with mobile classes */}
            <SideBar
                menu={menu}
                activeTab={activeTab}
                onTabChange={(key) => {
                    onTabChange(key);
                    setIsSidebarOpen(false); // Close sidebar after clicking a link on mobile
                }}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Overlay for mobile to click-to-close */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Pass the toggle function to Header */}
                <Header onMenuClick={() => setIsSidebarOpen(true)} name={name}/>

                <main className="flex-1 p-4 md:p-10 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;