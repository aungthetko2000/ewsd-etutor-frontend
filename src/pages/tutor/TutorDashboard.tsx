import  { useState } from 'react';
import { 
  Users, BookOpen,  Folder
} from 'lucide-react';

// --- Interfaces ---
interface Student {
  name: string;
  isClass: boolean;
}

interface Lesson {
  id: string;
  name: string;
  status: 'Ready' | 'In Progress';
  duration: number;
  domain: string;
}

const TutorDashboard = () => {
 
  const [activeTab, setActiveTab] = useState<'students' | 'lessons'>('students');

  const students: Student[] = [
    { name: 'Class 301', isClass: true },
    { name: 'Riley', isClass: false },
    { name: 'Dany', isClass: false },
    { name: 'Jarrod', isClass: false },
    { name: 'Kyle', isClass: false },
    { name: 'Emily', isClass: false },
    { name: 'James', isClass: false },
  ];

  const lessons: Lesson[] = [
    { id: 'L-01', name: 'Linear Functions', status: 'Ready', duration: 1.0, domain: 'Algebra' },
    { id: 'L-02', name: 'Quadratic Equations', status: 'Ready', duration: 1.5, domain: 'Advanced Math' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-700">
      {/* Banner */}
      <div className="h-40 bg-[#5B89AE] flex items-center justify-center text-white relative">
        <h1 className="text-4xl font-serif italic">
          {activeTab === 'students' ? 'My Workspace' : 'My Lessons'}
        </h1>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-4 gap-10">
        {/* Sidebar */}
        <aside className="col-span-1">
          <h3 className="font-bold mb-4">Menu</h3>
          <ul className="space-y-2">
            <li 
              onClick={() => setActiveTab('students')}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer ${activeTab === 'students' ? 'bg-slate-100 font-bold' : ''}`}
            >
              <Users size={18} /> My Students
            </li>
            <li 
              onClick={() => setActiveTab('lessons')}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer ${activeTab === 'lessons' ? 'bg-slate-100 font-bold' : ''}`}
            >
              <BookOpen size={18} /> My Lessons
            </li>
           
          </ul>
        </aside>

        {/* Main Content */}
        <main className="col-span-3">
          {activeTab === 'students' ? (
            <div>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">↗ Students</h2>
              <div className="grid grid-cols-4 gap-4">
                {students.map((s, i) => (
                  <div key={i} className="border p-4 rounded-xl flex flex-col items-center shadow-sm">
                    <div className="w-12 h-12 bg-slate-200 rounded-full mb-2 flex items-center justify-center">
                      {s.isClass ? <Users size={20}/> : <div className="w-6 h-6 bg-slate-400 rounded-full"/>}
                    </div>
                    <span className="text-sm font-medium">{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">Library</h2>
              {/* Folder Gallery */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {['Algebra', 'Advanced Math', 'Data Analysis'].map((folder) => (
                  <div key={folder} className="border p-6 rounded-xl flex flex-col items-center bg-white hover:shadow-md cursor-pointer">
                    <Folder size={40} className="text-blue-300 mb-2" />
                    <span className="text-sm font-semibold">{folder}</span>
                  </div>
                ))}
              </div>

              {/* Lesson Bank Table */}
              <h3 className="font-bold mb-4">Lesson Bank</h3>
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="p-2">№ Lesson ID</th>
                    <th className="p-2">Name of Lesson</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Domain</th>
                  </tr>
                </thead>
                <tbody>
                  {lessons.map((lesson) => (
                    <tr key={lesson.id} className="border-b hover:bg-slate-50">
                      <td className="p-2">{lesson.id}</td>
                      <td className="p-2 font-medium">{lesson.name}</td>
                      <td className="p-2 text-green-600">● {lesson.status}</td>
                      <td className="p-2">{lesson.domain}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TutorDashboard;