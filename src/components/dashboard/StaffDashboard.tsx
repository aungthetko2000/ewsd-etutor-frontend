import { useState } from "react";
import DashboardLayout from "./layout/DashboardLayout";
import AllocationScreen from "../allocation/AllocationScreen";

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

const IconAllocation = ({ className }: any) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M19 8v6" />
        <path d="M22 11h-6" />
    </svg>
);


const StaffDashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");

    const menu = [
        { key: "dashboard", label: "Dashboard", icon: IconDashboard },
        { key: "allocation", label: "Allocation", icon: IconAllocation }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <div></div>;
            case "allocation":
                return <AllocationScreen />;
            default:
                return;
        }
    };

    return (
        <DashboardLayout
            menu={menu}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            name="Staff Dashboard"
        >
            {renderContent()}
        </DashboardLayout>
    );
};

export default StaffDashboard;
