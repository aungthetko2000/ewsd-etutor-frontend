import { useState } from "react";
import CalendarSchedule from "../schedule/CalendarSchedule";
import DashboardLayout from "./layout/DashboardLayout";
import AssignedStudents from "../assignedStudent/AssignedStudents";
import NewBlog from "../blog/NewBlog";
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

const IconStudent = ({ className }: any) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const TutorDashBoard = () => {

    const [activeTab, setActiveTab] = useState("dashboard");
    const [showNewBlog, setShowNewBlog] = useState(false);

    const menu = [
        { key: "dashboard", label: "Dashboard", icon: IconDashboard },
        { key: "schedule", label: "Schedule", icon: IconSchedule },
        { key: "assigned-students", label: "Students", icon: IconStudent }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return;
            case "schedule":
                return <CalendarSchedule />;
            case "assigned-students":
                return <AssignedStudents />;
            default:
                return;
        }
    };

    return (
        <>
            <DashboardLayout
                menu={menu}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                name="Tutor Dashboard"
                 onBlogClick={() => setShowNewBlog(true)}
            >
                {renderContent()}
            </DashboardLayout>
            {showNewBlog && (
                <NewBlog show={showNewBlog} onClose={() => setShowNewBlog(false)} />
            )}
        </>
    );
};

export default TutorDashBoard;