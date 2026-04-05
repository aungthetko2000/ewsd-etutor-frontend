import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import { observer } from "mobx-react-lite";
import LoaderIcon from "../common/LoaderIcon";

const AllocationScreen = observer(() => {

    const { tutorStore, studentStore, staffStore } = useStore();

    // --- STUDENT PAGINATION STATE ---
    const ITEMS_PER_PAGE = 8;
    const [currentPage, setCurrentPage] = useState(1);
    const students = studentStore.state.filterStudents ?? [];
    const totalPages = Math.ceil(students.length / ITEMS_PER_PAGE);
    const paginatedStudents = students.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // --- TUTOR PAGINATION & SEARCH STATE ---
    const TUTORS_PER_PAGE = 4;
    const [tutorCurrentPage, setTutorCurrentPage] = useState(1);
    const [tutorSearchText, setTutorSearchText] = useState("");
    
    const filteredTutors = (tutorStore.state.tutors ?? []).filter(tutor => 
        tutor.fullName.toLowerCase().includes(tutorSearchText.toLowerCase()) ||
        tutor.expertise.toLowerCase().includes(tutorSearchText.toLowerCase())
    );
    
    const tutorTotalPages = Math.ceil(filteredTutors.length / TUTORS_PER_PAGE);
    const paginatedTutors = filteredTutors.slice(
        (tutorCurrentPage - 1) * TUTORS_PER_PAGE,
        tutorCurrentPage * TUTORS_PER_PAGE
    );

    useEffect(() => {
        clearData();
        tutorStore.getAllTutors();
        studentStore.getAllUnassignedStudents();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [studentStore.state.searchText]);

    // Reset tutor page when search changes
    useEffect(() => {
        setTutorCurrentPage(1);
    }, [tutorSearchText]);

    const clearData = () => {
        tutorStore.state.clearSelectedTutor();
        studentStore.state.clearSelectedStudents();
    };

    const toggleStudent = (id: number) => {
        studentStore.state.toggleStudent(id);
    };

    const handleBulkAllocate = () => {
        const tutorId = tutorStore.state.selectedTutor?.id;
        const studentsId = studentStore.state.selectedStudent;

        if (!tutorId || studentsId.length === 0) return;

        staffStore.bulkAllocateStudents(studentsId, tutorId);

        // Update Student List in state
        studentStore.state.removeStudentsByIds(studentsId);
    };

    const handleOnChagne = (value: string) => {
        studentStore.state.searchStudent(value);
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-8">
            {/* Header Section */}
            <header className="max-w-[1600px] mx-auto mb-10 flex justify-between items-end">
                <div>
                    <span className="text-orange-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">
                        Management System
                    </span>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        Allocation
                    </h1>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                        Active Session
                    </p>
                </div>
            </header>

            {/* 1. Added 'relative' here to contain the absolute loader */}
            <div className="max-w-[1600px] mx-auto relative">
                {(tutorStore.state.loading || staffStore.state.loading || studentStore.state.loading) && (
                    <LoaderIcon />
                )}

                <div className="grid grid-cols-12 gap-8">
                    {/* --- COLUMN 1: STUDENT SELECTION --- */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col h-[750px]">
                        <div className="flex flex-col gap-4 mb-4 px-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-orange-500 font-bold border border-slate-100">
                                        01
                                    </div>
                                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">
                                        Unassigned Students
                                    </h2>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                                    Total: {studentStore.state.students.length}
                                </span>
                            </div>

                            <div className="relative group">
                                <svg
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search student name..."
                                    className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all shadow-sm"
                                    onChange={(e) => handleOnChagne(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 bg-white/60 backdrop-blur-sm border border-white rounded-[2.5rem] p-4 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col">
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                                {paginatedStudents.map((student) => (
                                    <div
                                        key={student.id}
                                        onClick={() => toggleStudent(student.id)}
                                        className={`group p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${studentStore.state.selectedStudent?.includes(student.id)
                                            ? "border-orange-500 bg-white shadow-md"
                                            : "border-transparent bg-white hover:border-slate-200"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${studentStore.state.selectedStudent?.includes(
                                                    student.id,
                                                )
                                                    ? "bg-orange-500 text-white"
                                                    : "bg-slate-100 text-slate-400"
                                                    }`}
                                            >
                                                {student.fullName.charAt(0)}
                                            </div>
                                            <div className="flex-1 truncate">
                                                <h4 className="font-bold text-slate-800 text-sm truncate">
                                                    {student.fullName}
                                                </h4>
                                            </div>
                                            {studentStore.state.selectedStudent?.includes(
                                                student.id,
                                            ) && (
                                                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                                                )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} 
                                    className="cursor-pointer p-2 hover:bg-slate-100 rounded-xl text-rose-400 transition-colors">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 19l-7-7 7-7"
                                        />
                                    </svg>
                                </button>
                                <div className="flex gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`cursor-pointer w-8 h-8 text-[10px] font-black rounded-lg transition-all ${page === currentPage
                                                ? "bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-lg shadow-rose-200"
                                                : "text-slate-400 hover:bg-slate-100"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="cursor-pointer p-2 hover:bg-slate-100 rounded-xl text-rose-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* --- COLUMN 2: TUTOR SELECTION --- */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col h-[750px]">
                        <div className="flex flex-col gap-4 mb-4 px-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-orange-500 font-bold border border-slate-100">
                                        02
                                    </div>
                                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">
                                        Expert Tutors
                                    </h2>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                                    Total: {filteredTutors.length}
                                </span>
                            </div>

                            <div className="relative group">
                                <svg
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search tutor name or expertise..."
                                    className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all shadow-sm"
                                    onChange={(e) => setTutorSearchText(e.target.value)}
                                    value={tutorSearchText}
                                />
                            </div>
                        </div>

                        <div className="flex-1 bg-white/60 backdrop-blur-sm border border-white rounded-[2.5rem] p-4 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col">
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                                {paginatedTutors.map((tutor) => (
                                    <div
                                        key={tutor.id}
                                        onClick={() => tutorStore.state.selectTutor(tutor)}
                                        className={`group p-6 rounded-[2.5rem] border-2 transition-all duration-500 cursor-pointer overflow-hidden relative ${tutorStore.state.selectedTutor?.id === tutor.id
                                            ? "border-orange-500 bg-white shadow-2xl -translate-y-1"
                                            : "border-white bg-white/40 hover:bg-white hover:border-orange-500"
                                            }`}
                                    >
                                        {tutorStore.state.selectedTutor?.id === tutor.id && (
                                            <div className="absolute top-0 right-0 h-full w-2 bg-orange-500" />
                                        )}
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-black text-slate-800 tracking-tight group-hover:text-orange-500 transition-colors">
                                                    {tutor.fullName}
                                                </h3>
                                                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
                                                    {tutor.expertise}
                                                </p>
                                                <p className="text-xs text-orange-400 mt-1 tracking-widest">
                                                    {tutor.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                                <button
                                    onClick={() => setTutorCurrentPage((p) => Math.max(1, p - 1))} 
                                    className="cursor-pointer p-2 hover:bg-slate-100 rounded-xl text-rose-400 transition-colors">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 19l-7-7 7-7"
                                        />
                                    </svg>
                                </button>
                                <div className="flex gap-1">
                                    {Array.from({ length: tutorTotalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setTutorCurrentPage(page)}
                                            className={`cursor-pointer w-8 h-8 text-[10px] font-black rounded-lg transition-all ${page === tutorCurrentPage
                                                ? "bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-lg shadow-rose-200"
                                                : "text-slate-400 hover:bg-slate-100"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setTutorCurrentPage((p) => Math.min(tutorTotalPages, p + 1))}
                                    disabled={tutorCurrentPage === tutorTotalPages || tutorTotalPages === 0}
                                    className="cursor-pointer p-2 hover:bg-slate-100 rounded-xl text-rose-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* --- COLUMN 3: SUMMARY --- */}
                    <div className="col-span-12 lg:col-span-4 h-full">
                        <div className="sticky top-8 flex flex-col h-[750px]">
                            <div className="flex items-center gap-3 mb-4 px-2">
                                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-orange-500 font-bold border border-slate-100">
                                    03
                                </div>
                                <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">
                                    Allocation Summary
                                </h2>
                            </div>

                            <div className="flex-1 bg-white border border-slate-100 rounded-[3rem] p-8 shadow-2xl shadow-slate-200/50 flex flex-col relative overflow-hidden">
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-60" />
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="mb-8">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4 px-1">
                                            Assigned Professional
                                        </p>
                                        {tutorStore.state.selectedTutor ? (
                                            <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-4 rounded-[2rem] transition-all">
                                                <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200">
                                                    {tutorStore.state.selectedTutor.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-slate-800">
                                                        {tutorStore.state.selectedTutor.fullName}
                                                    </h4>
                                                    <span className="italic text-[10px] text-slate-800 uppercase tracking-tight">
                                                        {tutorStore.state.selectedTutor.expertise}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/30">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                                                    No Tutor Selected
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 flex flex-col min-h-0 mb-8">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4 px-1">
                                            Allocation List (
                                            {studentStore.state.selectedStudent?.length})
                                        </p>
                                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                                            {studentStore.state.selectedStudent?.length > 0 ? (
                                                studentStore.state.selectedStudent?.map((id) => {
                                                    const s = studentStore.state.students.find(
                                                        (st) => st.id === id,
                                                    );
                                                    return (
                                                        <div
                                                            key={id}
                                                            className="bg-white border border-slate-50 px-4 py-3 rounded-2xl shadow-sm text-[12px] font-bold text-slate-700 flex items-center justify-between group hover:border-orange-100 transition-all"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                                                                {s?.fullName}
                                                            </div>
                                                            <button
                                                                onClick={() => toggleStudent(id)}
                                                                className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                                            >
                                                                <svg
                                                                    className="w-4 h-4"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2.5"
                                                                        d="M6 18L18 6M6 6l12 12"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-10 opacity-20">
                                                    <svg
                                                        className="w-12 h-12 mb-2"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="1"
                                                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                                        />
                                                    </svg>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                                                        Select Students
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleBulkAllocate()}
                                        disabled={
                                            staffStore.state.loading ||
                                            !tutorStore.state.selectedTutor ||
                                            studentStore.state.selectedStudent.length === 0
                                        }
                                        className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] transition-all duration-300 shadow-xl ${tutorStore.state.selectedTutor &&
                                            studentStore.state.selectedStudent.length > 0
                                            ? "cursor-pointer bg-gradient-to-br from-orange-500 to-rose-500 text-white hover:-translate-y-1 active:scale-95"
                                            : "bg-slate-100 text-slate-300 cursor-not-allowed"
                                            }`}
                                    >
                                        Confirm Allocation
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default AllocationScreen;