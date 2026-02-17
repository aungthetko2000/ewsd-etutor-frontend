import { useState } from 'react';
import { 
  LayoutDashboard, BookOpen, Users, Settings, 
  Edit, Trash2, GraduationCap, 
  Mail, Phone, ShieldCheck, UserPlus
} from 'lucide-react';

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('courses');


  // --- Example Data ---
  const students = [
    { id: 101, name: 'Khaing Phu Wai Kay', email: 'khaing@example.com', course: 'Computing', joined: 'Jan 2026' },
    { id: 102, name: 'John Doe', email: 'john@example.com', course: 'Business', joined: 'Feb 2026' },
  ];

  const tutors = [
    { id: 1, name: 'Dr. Smith', subject: 'Java Programming', students: 45, status: 'Online' },
    { id: 2, name: 'Prof. Sarah', subject: 'Web Development', students: 30, status: 'Offline' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* 1. Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col flex-shrink-0">
        <div className="p-6 border-b flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FF5421] rounded flex items-center justify-center text-white font-bold">Q</div>
          <span className="text-xl font-bold text-[#002147]">QEDUCATO</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-3 w-full p-3 rounded-lg text-sm ${activeTab === 'overview' ? 'bg-orange-50 text-[#FF5421] font-bold' : 'text-gray-500 hover:bg-gray-50'}`}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('courses')} className={`flex items-center gap-3 w-full p-3 rounded-lg text-sm ${activeTab === 'courses' ? 'bg-orange-50 text-[#FF5421] font-bold' : 'text-gray-500 hover:bg-gray-50'}`}>
            <BookOpen size={18} /> Manage Courses
          </button>
          <button onClick={() => setActiveTab('students')} className={`flex items-center gap-3 w-full p-3 rounded-lg text-sm ${activeTab === 'students' ? 'bg-orange-50 text-[#FF5421] font-bold' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Users size={18} /> Student List
          </button>
          <button onClick={() => setActiveTab('tutors')} className={`flex items-center gap-3 w-full p-3 rounded-lg text-sm ${activeTab === 'tutors' ? 'bg-orange-50 text-[#FF5421] font-bold' : 'text-gray-500 hover:bg-gray-50'}`}>
            <GraduationCap size={18} /> Tutor List
          </button>
          <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-3 w-full p-3 rounded-lg text-sm ${activeTab === 'settings' ? 'bg-orange-50 text-[#FF5421] font-bold' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Settings size={18} /> Settings
          </button>
        </nav>
      </aside>

      {/* 2. Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <nav className="bg-[#002147] text-white px-8 py-3 flex justify-between items-center">
          <div className="flex gap-6 text-xs">
            <span className="flex items-center gap-1"><Phone size={12} /> +91 7052 101 786</span>
            <span className="flex items-center gap-1"><Mail size={12} /> info@example.com</span>
          </div>
          <button className="bg-[#FF5421] px-4 py-2 text-xs font-bold uppercase rounded">Admission Open</button>
        </nav>

        <main className="flex-1 overflow-y-auto p-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#002147] capitalize">{activeTab.replace('_', ' ')}</h1>
            <p className="text-gray-500 text-sm">Manage your institution's {activeTab} efficiently.</p>
          </div>

          {/* Conditional Rendering for Tabs */}
          {activeTab === 'students' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between mb-6">
                <h3 className="font-bold">Enrolled Students</h3>
                <button className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs flex items-center gap-2"><UserPlus size={14}/> Add Student</button>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-[10px]">
                  <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Course</th><th className="px-4 py-3">Joined</th><th className="px-4 py-3">Action</th></tr>
                </thead>
                <tbody className="divide-y">
                  {students.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{s.name}<br/><span className="text-[10px] text-gray-400">{s.email}</span></td>
                      <td className="px-4 py-3">{s.course}</td>
                      <td className="px-4 py-3 text-gray-500">{s.joined}</td>
                      <td className="px-4 py-3"><Trash2 size={14} className="text-red-400 cursor-pointer"/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'tutors' && (
            <div className="grid grid-cols-2 gap-6">
              {tutors.map(t => (
                <div key={t.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">{t.name[0]}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#002147]">{t.name}</h4>
                    <p className="text-xs text-gray-500">{t.subject}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`w-2 h-2 rounded-full ${t.status === 'Online' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      <span className="text-[10px] text-gray-400">{t.status}</span>
                    </div>
                  </div>
                  <button className="text-gray-400"><Edit size={16}/></button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h3 className="font-bold mb-6 flex items-center gap-2"><ShieldCheck className="text-green-500"/> System Settings</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2">Institution Name</label>
                  <input type="text" defaultValue="QEDUCATO University" className="w-full p-2 border rounded text-sm outline-none focus:ring-1 focus:ring-orange-500" />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-bold">Maintenance Mode</p>
                    <p className="text-[10px] text-gray-400">Offline the portal for maintenance</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4 accent-orange-500" />
                </div>
                <button className="w-full bg-[#002147] text-white py-2 rounded font-bold text-sm">Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === 'courses' && <div className="p-10 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-400">Course Management Content Here</div>}
          {activeTab === 'overview' && <div className="p-10 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-400">Dashboard Overview Content Here</div>}
        </main>
      </div>
    </div>
  );
};

export default StaffDashboard;