import { useState } from 'react';

const Dashboard = () => {
  // --- States for Lists ---
  const [students, setStudents] = useState<any[]>([]); 
  const [tutors, setTutors] = useState<any[]>([]);     
  const [allocatedPairs, setAllocatedPairs] = useState<any[]>([]); // 

  // --- UI & Form States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: 'Student', subject: '' });
  const [selectedTutorId, setSelectedTutorId] = useState<any>(null);
  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);

  // --- User Management Logic (Add/Delete) ---
  const handleSaveUser = () => {
    if (!formData.name) return;
    const newId = Date.now();
    if (formData.role === 'Student') {
      setStudents([...students, { id: newId, name: formData.name, status: 'Unassigned' }]);
    } else {
      setTutors([...tutors, { id: newId, name: formData.name, sub: formData.subject || 'General' }]);
    }
    setFormData({ name: '', role: 'Student', subject: '' });
    setIsModalOpen(false);
  };

  const deleteStudent = (id: number) => {
    setStudents(students.filter(s => s.id !== id));
    setSelectedStudents(selectedStudents.filter(s => s.id !== id));
    setAllocatedPairs(allocatedPairs.filter(p => p.studentId !== id)); 
  };

  const deleteTutor = (id: number) => {
    setTutors(tutors.filter(t => t.id !== id));
    if (selectedTutorId === id) setSelectedTutorId(null);
    setAllocatedPairs(allocatedPairs.filter(p => p.tutorId !== id)); 
  };

  // --- Allocation Logic ---
  const toggleStudent = (s: any) => {
    if (selectedStudents.find((item: any) => item.id === s.id)) {
      setSelectedStudents(selectedStudents.filter((item: any) => item.id !== s.id));
    } else {
      setSelectedStudents([...selectedStudents, s]);
    }
  };

  const handleConfirmAllocation = () => {
    const tutor = tutors.find(t => t.id === selectedTutorId);
    if (!tutor || selectedStudents.length === 0) return;

   
    const newEntries = selectedStudents.map(student => ({
      id: Date.now() + Math.random(), // Unique ID
      studentId: student.id,
      studentName: student.name,
      tutorId: tutor.id,
      tutorName: tutor.name,
      date: new Date().toLocaleDateString()
    }));

    setAllocatedPairs([...allocatedPairs, ...newEntries]);

  
    const assignedIds = selectedStudents.map(s => s.id);
    setStudents(students.map(s => 
      assignedIds.includes(s.id) ? { ...s, status: `Assigned to ${tutor.name}` } : s
    ));


    setSelectedStudents([]);
    setSelectedTutorId(null);
  };

  return (
    <div className="flex h-screen bg-[#f8f9fa] text-slate-800 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] text-white flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">N</div>
          <span className="text-xl font-bold tracking-tight">NexusTutoring</span>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <div className="flex items-center gap-3 p-3 bg-blue-600/10 text-blue-400 rounded-lg text-sm font-medium cursor-pointer"><span>🔗</span> Allocation System</div>
        </nav>
        <div className="p-6 text-red-400 text-sm cursor-pointer border-t border-slate-700">🚪 Logout</div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shrink-0 shadow-sm">
          <div className="text-gray-400 text-xl cursor-pointer">☰ STAFF PANEL</div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-md text-sm"
          >
            + Add New User
          </button>
        </header>

        <div className="p-8 flex-1 overflow-y-auto space-y-8">
          <h1 className="text-2xl font-bold text-[#1e293b]">Tutor Allocation System</h1>

          {/* Allocation Selector Section */}
          <div className="grid grid-cols-12 gap-6 h-[450px]">
            {/* 1. Student Selection (Checkbox) */}
            <div className="col-span-4 bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-sm">Select Students ({students.length})</h3>
                <span onClick={() => setSelectedStudents([...students])} className="text-[10px] text-blue-600 font-bold cursor-pointer hover:underline">Select All</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {students.map(s => (
                  <div key={s.id} className="group flex items-center gap-3 p-3 rounded-lg border border-slate-50 hover:border-blue-200 hover:bg-blue-50/20 transition">
                    <input type="checkbox" checked={selectedStudents.some(item => item.id === s.id)} onChange={() => toggleStudent(s)} className="w-4 h-4 cursor-pointer" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{s.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{s.status}</p>
                    </div>
                    <button onClick={() => deleteStudent(s.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition">🗑</button>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Tutor Selection (Radio) */}
            <div className="col-span-4 bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col overflow-hidden">
              <h3 className="font-bold mb-6 text-sm">Select Tutor (Radio)</h3>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {tutors.map(t => (
                  <label key={t.id} className={`group flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${selectedTutorId === t.id ? 'bg-blue-50 border-blue-400' : 'border-slate-50 hover:bg-slate-50'}`}>
                    <input type="radio" name="tutor" checked={selectedTutorId === t.id} onChange={() => setSelectedTutorId(t.id)} className="w-4 h-4 cursor-pointer" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{t.name}</p>
                      <p className="text-[10px] text-blue-600 font-medium truncate">{t.sub}</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); deleteTutor(t.id); }} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition">🗑</button>
                  </label>
                ))}
              </div>
            </div>

            {/* 3. Preview Section */}
            <div className="col-span-4 bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col">
              <h3 className="font-bold mb-6 text-sm">Allocation Preview</h3>
              <div className="flex-1 space-y-4 overflow-hidden flex flex-col">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 shrink-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Tutor Selected</p>
                  <p className="text-sm font-bold text-slate-700">{tutors.find(t => t.id === selectedTutorId)?.name || 'None'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex-1 overflow-y-auto">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Students ({selectedStudents.length})</p>
                  <div className="space-y-1">
                    {selectedStudents.map(s => (
                      <div key={s.id} className="flex justify-between items-center bg-white p-2 rounded text-xs border border-slate-100">
                        {s.name} <span onClick={() => toggleStudent(s)} className="text-red-400 cursor-pointer px-1 font-bold">×</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button 
                onClick={handleConfirmAllocation}
                disabled={!selectedTutorId || selectedStudents.length === 0}
                className="w-full mt-6 bg-[#0f172a] text-white py-3 rounded-lg font-bold hover:bg-black transition text-sm disabled:bg-gray-200 disabled:cursor-not-allowed shadow-lg active:scale-95"
              >
                Confirm Allocation
              </button>
            </div>
          </div>

          {/* Table: Allocated Pairs (Single Rows) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-12">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
               <h3 className="font-bold text-lg text-slate-800">Allocated Tutor-Student Pairs</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Tutor Name</th>
                    <th className="px-6 py-4">Allocation Date</th>
                    <th className="px-6 py-4 text-center">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allocatedPairs.map(pair => (
                    <tr key={pair.id} className="hover:bg-blue-50/30 transition">
                      <td className="px-6 py-4 font-bold text-sm text-slate-700">{pair.studentName}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{pair.tutorName}</td>
                      <td className="px-6 py-4 text-xs text-slate-400">{pair.date}</td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => setAllocatedPairs(allocatedPairs.filter(p => p.id !== pair.id))}
                          className="text-red-500 hover:text-red-700 text-xs font-bold bg-red-50 px-3 py-1 rounded transition"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                  {allocatedPairs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center text-slate-400 italic text-sm">There is no assigned!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modal: Add User */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs p-6 border border-slate-100 animate-in zoom-in duration-150">
            <h3 className="text-lg font-bold mb-6 text-slate-800 border-b pb-2">Add New User</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
                <input className="w-full border-b py-2 text-sm outline-none focus:border-blue-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. John Doe" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Role</label>
                <select className="w-full border-b py-2 text-sm outline-none bg-transparent" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="Student">Student</option>
                  <option value="Tutor">Tutor</option>
                </select>
              </div>
              {formData.role === 'Tutor' && (
                <div className="animate-in slide-in-from-top-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Subject</label>
                  <input className="w-full border-b py-2 text-sm outline-none focus:border-blue-500" placeholder="e.g. Mathematics" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setIsModalOpen(false)} className="text-xs font-bold text-slate-400">Cancel</button>
              <button onClick={handleSaveUser} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-blue-700 transition">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;