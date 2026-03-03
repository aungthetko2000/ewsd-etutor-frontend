import { useState } from "react";
import DashboardLayout from "./layout/DashboardLayout";
import BlogList from "../blog/BlogList";
import NewBlog from '../blog/NewBlog';

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
    ];

    const [showBlogs, setShowBlogs] = useState(false);
    const [showNewBlog, setShowNewBlog] = useState(false);

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
            return showBlogs ? (
                <BlogList onBack={() => setShowBlogs(false)} />
            ) : (
                <div className="p-6">
                    <button
                        onClick={() => setShowBlogs(true)}
                        className="px-4 py-2 text-sm font-semibold bg-gradient-to-tr from-orange-500 to-rose-500 text-white rounded-lg hover:opacity-90 transition"
                    >
                        See More Blogs
                    </button>
                </div>
            );
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
