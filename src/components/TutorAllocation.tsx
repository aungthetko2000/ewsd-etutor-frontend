import  { useState, useEffect } from 'react';

const Dashboard = () => {
  // --- LocalStorage Logic ---
  const getInitialData = (key: string, defaultValue: any) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  // --- States ---
  const [students, setStudents] = useState<any[]>(() => getInitialData('students', [])); 
  const [tutors, setTutors] = useState<any[]>(() => getInitialData('tutors', []));     
  const [allocatedPairs, setAllocatedPairs] = useState<any[]>(() => getInitialData('allocatedPairs', []));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: 'Student', subject: '' });
  const [selectedTutorId, setSelectedTutorId] = useState<any>(null);
  const [selectedStudents, setSelectedStudents] = useState<any[]>([]);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('tutors', JSON.stringify(tutors));
    localStorage.setItem('allocatedPairs', JSON.stringify(allocatedPairs));
  }, [students, tutors, allocatedPairs]);

  // --- Handlers ---
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

  // Pair ဖျက်လိုက်ရင် Student Status ပါ ပြန်ပြင်ပေးမယ့် logic
  const removePair = (pairId: number, studentId: number) => {
    // 1. Table ထဲကနေ pair ကို ဖျက်တယ်
    setAllocatedPairs(allocatedPairs.filter(p => p.id !== pairId));

    // 2. Student List ထဲမှာ status ကို 'Unassigned' လို့ ပြန်ပြင်တယ်
    setStudents(prevStudents => 
      prevStudents.map(s => 
        s.id === studentId ? { ...s, status: 'Unassigned' } : s
      )
    );
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

  const toggleStudentSelection = (s: any) => {
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
      id: Date.now() + Math.random(),
      studentId: student.id,
      studentName: student.name,
      tutorId: tutor.id,
      tutorName: tutor.name,
      date: new Date().toLocaleDateString()
    }));

    setAllocatedPairs([...allocatedPairs, ...newEntries]);

    // Update students status
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
        <div className="p-6 font-bold text-xl tracking-tight">NexusTutoring</div>
        <nav className="flex-1 px-4 mt-6 space-y-2">
          <div className="p-3 bg-blue-600/10 text-blue-400 rounded-lg text-sm font-medium">Allocation System</div>
        </nav>
        <div 
          className="p-6 text-red-400 text-sm cursor-pointer border-t border-slate-700" 
          onClick={() => { localStorage.clear(); window.location.reload(); }}
        >
          🧹 Reset All Data
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shrink-0 shadow-sm text-sm font-bold uppercase tracking-widest text-slate-400">
          Staff Control Panel
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            + Add New User
          </button>
        </header>

        <div className="p-8 flex-1 overflow-y-auto space-y-8">
          <h1 className="text-2xl font-bold text-[#1e293b]">Tutor Allocation System</h1>

          <div className="grid grid-cols-12 gap-6 h-[400px]">
            {/* Student Selection */}
            <div className="col-span-4 bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col overflow-hidden">
              <h3 className="font-bold text-sm mb-4">Select Students ({students.length})</h3>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {students.map(s => (
                  <div key={s.id} className="group flex items-center gap-3 p-3 rounded-lg border border-slate-50 hover:border-blue-200 hover:bg-blue-50/20 transition">
                    <input type="checkbox" checked={selectedStudents.some(item => item.id === s.id)} onChange={() => toggleStudentSelection(s)} className="w-4 h-4" />
                    <div className="flex-1 min-w-0 text-sm italic">{s.name} <span className="text-[10px] text-gray-400">({s.status})</span></div>
                    <button onClick={() => deleteStudent(s.id)} className="opacity-0 group-hover:opacity-100 text-red-400">🗑</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tutor Selection */}
            <div className="col-span-4 bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col overflow-hidden">
              <h3 className="font-bold text-sm mb-4">Select Tutor</h3>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {tutors.map(t => (
                  <label key={t.id} className={`group flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${selectedTutorId === t.id ? 'bg-blue-50 border-blue-400' : 'border-slate-50 hover:bg-slate-50'}`}>
                    <input type="radio" name="tutor" checked={selectedTutorId === t.id} onChange={() => setSelectedTutorId(t.id)} />
                    <div className="flex-1 text-sm font-medium ml-2">{t.name} <span className="text-[10px] text-blue-500 block italic">{t.sub}</span></div>
                    <button onClick={(e) => { e.stopPropagation(); deleteTutor(t.id); }} className="opacity-0 group-hover:opacity-100 text-red-400">🗑</button>
                  </label>
                ))}
              </div>
            </div>

            {/* Preview Section */}
            <div className="col-span-4 bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col text-sm">
              <h3 className="font-bold mb-4 underline decoration-blue-500 underline-offset-4">Preview</h3>
              <div className="flex-1 space-y-4 overflow-hidden flex flex-col italic">
                <div className="p-3 bg-slate-50 rounded-lg border">
                  <p className="font-bold text-slate-400 uppercase text-[10px] mb-1">Tutor</p>
                  <p>{tutors.find(t => t.id === selectedTutorId)?.name || '---'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border flex-1 overflow-y-auto">
                  <p className="font-bold text-slate-400 uppercase text-[10px] mb-2">Students ({selectedStudents.length})</p>
                  {selectedStudents.map(s => <div key={s.id} className="py-1 border-b border-white">{s.name}</div>)}
                </div>
              </div>
              <button 
                onClick={handleConfirmAllocation}
                disabled={!selectedTutorId || selectedStudents.length === 0}
                className="w-full mt-6 bg-[#0f172a] text-white py-3 rounded-lg font-bold disabled:bg-gray-200 shadow-lg"
              >
                Confirm Allocation
              </button>
            </div>
          </div>

          {/* Allocated Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-12">
            <div className="p-6 border-b bg-slate-50/50">
               <h3 className="font-bold text-lg text-slate-800">Allocated Tutor-Student Pairs</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 border-b">
                  <tr>
                    <th className="px-6 py-4 text-slate-500">Student Name</th>
                    <th className="px-6 py-4 text-slate-500">Tutor Name</th>
                    <th className="px-6 py-4 text-slate-500">Date</th>
                    <th className="px-6 py-4 text-center text-slate-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allocatedPairs.map(pair => (
                    <tr key={pair.id} className="hover:bg-blue-50/20 transition">
                      <td className="px-6 py-4 font-bold italic">{pair.studentName}</td>
                      <td className="px-6 py-4 text-slate-600">{pair.tutorName}</td>
                      <td className="px-6 py-4 text-xs text-slate-400">{pair.date}</td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => removePair(pair.id, pair.studentId)}
                          className="bg-red-50 text-red-500 px-3 py-1 rounded text-[10px] font-bold hover:bg-red-100"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                  {allocatedPairs.length === 0 && (
                    <tr><td colSpan={4} className="p-16 text-center text-gray-300 italic">No allocations yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs p-6 border animate-in zoom-in duration-150">
            <h3 className="text-lg font-bold mb-6 text-slate-800">Add New User</h3>
            <div className="space-y-4">
              <input className="w-full border-b py-2 text-sm outline-none focus:border-blue-500 transition" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Full Name" />
              <select className="w-full border-b py-2 text-sm outline-none bg-transparent" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                <option value="Student">Student</option>
                <option value="Tutor">Tutor</option>
              </select>
              {formData.role === 'Tutor' && (
                <input className="w-full border-b py-2 text-sm outline-none" placeholder="Subject" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
              )}
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setIsModalOpen(false)} className="text-xs font-bold text-slate-400">Cancel</button>
              <button onClick={handleSaveUser} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;