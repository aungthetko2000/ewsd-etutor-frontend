import { useState } from "react";
import DashboardLayout from "./layout/DashboardLayout";
import NewBlog from '../blog/NewBlog';
import BlogDashboard from "../blog/BlogDashboard";
import DocumentUpload from "../document/DocumentUpload";

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

const StudentDashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");

    const menu = [
        { key: "dashboard", label: "Dashboard", icon: IconDashboard },
        { key: "document", label: "Documents", icon: IconDashboard },
    ];

    const [showNewBlog, setShowNewBlog] = useState(false);

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <BlogDashboard />;
            case "document":
                return <DocumentUpload />;
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
            name="Student Dashboard"
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

export default StudentDashboard;
