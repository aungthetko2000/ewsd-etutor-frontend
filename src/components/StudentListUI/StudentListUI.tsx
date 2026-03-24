import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 

  LayoutGrid,
  List as ListIcon,
  Users,
  CheckCircle2,
  Clock,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { studentApi } from '../../service/student/StudentApi';

// ✅ FIXED TYPE (match backend)
export interface Student {
  id: number;
  fullName: string;
  email: string;
  age: number;
  grade: string;
  assigned: boolean;
  currentTutorId?: number;
}

interface StudentListProps {
  initialStudents?: Student[];
}

export const StudentListUI: React.FC<StudentListProps> = ({ initialStudents = [] }) => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name'>('name');
  const [filter, setFilter] = useState<'all' | 'unassigned'>('all');

  // ✅ FIXED API CALL
  const fetchStudents = async () => {
    setLoading(true);
    try {
     const res = await studentApi.getStudents(filter === 'unassigned');
      setStudents(res.data.data); // ✅ IMPORTANT FIX
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [filter]);

  // ✅ FIXED FILTERING
  const filteredStudents = useMemo(() => {
    return students
      .filter(student => 
        student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => a.fullName.localeCompare(b.fullName));
  }, [students, searchQuery]);

  // ✅ FIXED STATS
  const stats = useMemo(() => ({
    total: students.length,
    assigned: students.filter(s => s.assigned).length,
    unassigned: students.filter(s => !s.assigned).length,
  }), [students]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full min-h-screen bg-[#FFF9F2]">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-gray-900 mb-2">Student Directory</h1>
        <p className="text-gray-500">Manage and view all registered students</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={<Users />} label="Total Students" value={stats.total} />
        <StatCard icon={<CheckCircle2 />} label="Assigned" value={stats.assigned} />
        <StatCard icon={<Clock />} label="Unassigned" value={stats.unassigned} />
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-2xl mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">

        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search students..."
            className="w-full pl-10 pr-4 py-2 border rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">

          {/* Filter */}
          <button onClick={() => setFilter('all')}>All</button>
          <button onClick={() => setFilter('unassigned')}>Unassigned</button>

          {/* View */}
          <button onClick={() => setViewMode('grid')}><LayoutGrid /></button>
          <button onClick={() => setViewMode('list')}><ListIcon /></button>

          {/* Refresh */}
          <button onClick={fetchStudents}>
            <RefreshCw className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {loading ? (
          <div>Loading...</div>
        ) : viewMode === 'grid' ? (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {filteredStudents.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </motion.div>
        ) : (
          <table className="w-full bg-white rounded-xl">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Grade</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.fullName}</td>
                  <td>{student.email}</td>
                  <td>{student.grade}</td>
                  <td><StatusBadge assigned={student.assigned} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AnimatePresence>

      {filteredStudents.length === 0 && !loading && (
        <div className="text-center mt-10">No students found</div>
      )}
    </div>
  );
};

// ✅ Stat Card
function StatCard({ icon, label, value }: any) {
  return (
    <div className="bg-white p-4 rounded-xl">
      <div>{icon}</div>
      <div>{label}</div>
      <div>{value}</div>
    </div>
  );
}

// ✅ Student Card
const StudentCard: React.FC<{ student: Student }> = ({ student }) => {
  const avatar = `https://ui-avatars.com/api/?name=${student.fullName}`;

  return (
    <motion.div className="bg-white p-4 rounded-xl">
      <img src={avatar} className="w-12 h-12 rounded-full" />
      <h3>{student.fullName}</h3>
      <p>{student.email}</p>
      <p>{student.grade}</p>
      <StatusBadge assigned={student.assigned} />
    </motion.div>
  );
};

// ✅ Status Badge
function StatusBadge({ assigned }: { assigned: boolean }) {
  return (
    <span className={assigned ? 'text-green-600' : 'text-yellow-600'}>
      {assigned ? 'Assigned' : 'Unassigned'}
    </span>
  );
}

export default StudentListUI;