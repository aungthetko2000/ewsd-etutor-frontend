import Header from "./Header";
import SideBar from "./SideBar";

type DashboardLayoutProps = {
    menu: any[];
    activeTab: string;
    onTabChange: (key: string) => void;
    children: React.ReactNode;
};

const DashboardLayout = ({
    menu,
    activeTab,
    onTabChange,
    children,
}: DashboardLayoutProps) => {
    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            <SideBar
                menu={menu}
                activeTab={activeTab}
                onTabChange={onTabChange}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <Header />

                {/* Content */}
                <main className="flex-1 p-10 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;