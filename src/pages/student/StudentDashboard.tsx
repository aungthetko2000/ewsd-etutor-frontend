import { useState } from 'react';
import { 
  BookOpen, FileText, GraduationCap, 
  StickyNote, Database, Dna, FlaskConical
} from 'lucide-react';

// --- Types ---
type TabType = 'classes' | 'assignments' | 'exams' | 'notes';

const StudentDashboard = () => {
  
  const [activeTab, setActiveTab] = useState<TabType>('classes');

  // Sidebar Menu List
  const menuItems = [
    { id: 'classes', label: 'Classes & Courses', icon: <BookOpen size={18} /> },
    { id: 'assignments', label: 'Assignments', icon: <FileText size={18} /> },
    { id: 'exams', label: 'Exams', icon: <GraduationCap size={18} /> },
    { id: 'notes', label: 'Study Notes', icon: <StickyNote size={18} /> },
  ];

  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* Sidebar - School Area Section */}
      <aside className="w-64 border-r border-gray-100 p-6">
        <h3 className="text-gray-900 font-bold mb-6 text-lg">School Area</h3>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li 
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-all ${
                  activeTab === item.id 
                  ? 'bg-blue-50 text-blue-600 font-semibold' 
                  : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10">
          <h3 className="text-gray-900 font-bold mb-4 text-lg">Other</h3>
          <div className="flex items-center gap-3 px-3 py-2 text-gray-500 text-sm hover:text-blue-600 cursor-pointer">
            <Database size={18} /> Original Databases
          </div>
        </div>
      </aside>

  
      <main className="flex-1 p-10">
        {activeTab === 'classes' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Classes & Courses</h2>
            <div className="grid grid-cols-2 gap-6">
              {/* Course Card Example */}
              <div className="border border-gray-100 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                <Dna size={48} className="mx-auto mb-4 text-gray-400" />
                <h4 className="font-bold text-lg">Biology</h4>
                <p className="text-sm text-gray-500">Dr. Sarah Thompson</p>
              </div>
              <div className="border border-gray-100 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                <FlaskConical size={48} className="mx-auto mb-4 text-gray-400" />
                <h4 className="font-bold text-lg">Chemistry</h4>
                <p className="text-sm text-gray-500">Prof. James Allen</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Assignments</h2>
            <div className="space-y-4">
              <div className="border border-gray-100 p-5 rounded-xl bg-white shadow-sm">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold">Presentation - Chemistry</h4>
                  <span className="bg-red-50 text-red-600 text-xs px-2 py-1 rounded-full">High Priority</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">Due: August 10, 2024</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'exams' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Exams Schedule</h2>
            <div className="p-10 border-2 border-dashed border-gray-100 rounded-xl text-center text-gray-400">
              No upcoming exams found.
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">My Study Notes</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 h-40">
                <h5 className="font-bold text-sm mb-2">Organic Chemistry Basics</h5>
                <p className="text-xs text-gray-600 line-clamp-4">Review the carbon structures and bonding types...</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;