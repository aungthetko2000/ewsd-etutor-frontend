import { useState } from "react";
import CalendarSchedule from "../schedule/CalendarSchedule";
import DashboardLayout from "./layout/DashboardLayout";

const IconDashboard = ({ className }: any) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path
            d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
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

const TutorDashBoard = () => {

    const [activeTab, setActiveTab] = useState("dashboard");

    const menu = [
        { key: "dashboard", label: "Dashboard", icon: IconDashboard },
        { key: "schedule", label: "Schedule", icon: IconSchedule }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return;
            case "schedule":
                return <CalendarSchedule />;
            default:
                return;
        }
    };

    return (
        <DashboardLayout
            menu={menu}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            name="Tutor Dashboard"
        >
            {renderContent()}
        </DashboardLayout>
    );
};

export default TutorDashBoard;