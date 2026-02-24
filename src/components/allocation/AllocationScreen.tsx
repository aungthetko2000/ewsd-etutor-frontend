import React, { useState } from "react";

// Interfaces for better Type Safety
interface Student {
    id: number;
    name: string;
    grade: string;
    subject: string;
    avatar?: string;
}

interface Tutor {
    id: number;
    name: string;
    expertise: string;
    rating: string;
    studentsCount: number;
}

const AllocationScreen = () => {
    const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

    const students: Student[] = [
        { id: 1, name: "Alice Thompson", grade: "Year 11", subject: "Mathematics" },
        { id: 2, name: "James Wilson", grade: "Year 10", subject: "Physics" },
        { id: 3, name: "Sophia Chen", grade: "Year 12", subject: "Chemistry" },
        { id: 4, name: "Liam O'Connor", grade: "Year 11", subject: "Biology" },
    ];

    const tutors: Tutor[] = [
        { id: 101, name: "Dr. Sarah Miller", expertise: "Science Specialist", rating: "4.9", studentsCount: 12 },
        { id: 102, name: "Prof. David Clark", expertise: "Pure Mathematics", rating: "5.0", studentsCount: 8 },
        { id: 103, name: "Emma Watson", expertise: "Literature & Arts", rating: "4.8", studentsCount: 15 },
    ];

    const toggleStudent = (id: number) => {
        setSelectedStudents((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans">
            {/* Header Section */}
            <header className="max-w-[1600px] mx-auto mb-10 flex justify-between items-end">
                <div>
                    <span className="text-orange-500 font-black text-[10px] uppercase tracking-[0.3em] mb-2 block">Management System</span>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Allocation</h1>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-slate-400 uppercase 
                        tracking-widest">Active Session</p>
                </div>
            </header>

            <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-8">


                {/* --- COLUMN 1: STUDENT SELECTION (Optimized for Large Data) --- */}
                <div className="col-span-12 lg:col-span-4 flex flex-col h-[750px]">

                    {/* Column Header & Search */}
                    <div className="flex flex-col gap-4 mb-4 px-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-orange-500 font-bold border border-slate-100">01</div>
                                <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">Unassigned Pool</h2>
                            </div>
                            <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                                Total: 128
                            </span>
                        </div>

                        {/* Search Input Box */}
                        <div className="relative group">
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search student name..."
                                className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Fixed-Height Scrollable Container */}
                    <div className="flex-1 bg-white/60 backdrop-blur-sm border border-white rounded-[2.5rem] p-4 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col">
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                            {students.map((student) => (
                                <div
                                    key={student.id}
                                    onClick={() => toggleStudent(student.id)}
                                    className={`group p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${selectedStudents.includes(student.id)
                                        ? "border-orange-500 bg-white shadow-md"
                                        : "border-transparent bg-white hover:border-slate-200"
                                        }`}
                                >
                                    {/* Card content - made more compact for high density */}
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${selectedStudents.includes(student.id) ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-400"
                                            }`}>
                                            {student.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 truncate">
                                            <h4 className="font-bold text-slate-800 text-sm truncate">{student.name}</h4>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{student.subject}</p>
                                        </div>
                                        {selectedStudents.includes(student.id) && (
                                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Bar - Sticks to bottom of card */}
                        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                            <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <div className="flex gap-1">
                                {[1, 2, 3].map((page) => (
                                    <button
                                        key={page}
                                        className={`w-8 h-8 text-[10px] font-black rounded-lg transition-all ${page === 1 ? "bg-orange-500 text-white shadow-lg shadow-orange-200" : "text-slate-400 hover:bg-slate-100"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- COLUMN 2: TUTOR SELECTION --- */}
                <div className="col-span-12 lg:col-span-4 space-y-4">
                    <div className="flex items-center gap-3 mb-2 px-2">
                        <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-orange-500 font-bold border border-slate-100">02</div>
                        <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">Expert Tutors</h2>
                    </div>

                    <div className="space-y-4">
                        {tutors.map((tutor) => (
                            <div
                                key={tutor.id}
                                onClick={() => setSelectedTutor(tutor)}
                                className={`group p-6 rounded-[2.5rem] border-2 transition-all duration-500 cursor-pointer overflow-hidden relative ${selectedTutor?.id === tutor.id
                                    ? "border-orange-500 bg-white shadow-2xl -translate-y-1"
                                    : "border-white bg-white/40 hover:bg-white hover:border-orange-500"
                                    }`}
                            >
                                {selectedTutor?.id === tutor.id && (
                                    <div className="absolute top-0 right-0 h-full w-2 bg-orange-500" />
                                )}
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-black text-slate-800 tracking-tight group-hover:text-orange-500 transition-colors">{tutor.name}</h3>
                                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{tutor.expertise}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- COLUMN 3: SUMMARY --- */}
                <div className="col-span-12 lg:col-span-4 h-full">
                    <div className="sticky top-8 flex flex-col h-[750px]">
                        {/* Step Indicator */}
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-orange-500 font-bold border border-slate-100">03</div>
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">Allocation Summary</h2>
                        </div>

                        {/* Main Summary Card */}
                        <div className="flex-1 bg-white border border-slate-100 rounded-[3rem] p-8 shadow-2xl shadow-slate-200/50 flex flex-col relative overflow-hidden">
                            {/* Soft decorative glow */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-60" />

                            <div className="relative z-10 flex flex-col h-full">

                                {/* 1. Selected Tutor Section */}
                                <div className="mb-8">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4 px-1">Assigned Professional</p>
                                    {selectedTutor ? (
                                        <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-4 rounded-[2rem] transition-all">
                                            <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200">
                                                {selectedTutor.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-800">{selectedTutor.name}</h4>
                                                <span className="italic text-[10px] text-slate-800 uppercase tracking-tight">{selectedTutor.expertise}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/30">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">No Tutor Selected</span>
                                        </div>
                                    )}
                                </div>

                                {/* 2. Selected Students List (Fixed Height Scrollable) */}
                                <div className="flex-1 flex flex-col min-h-0 mb-8">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4 px-1">Allocation List ({selectedStudents.length})</p>

                                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                                        {selectedStudents.length > 0 ? (
                                            selectedStudents.map(id => {
                                                const s = students.find(st => st.id === id);
                                                return (
                                                    <div key={id} className="bg-white border border-slate-50 px-4 py-3 rounded-2xl shadow-sm text-[12px] font-bold text-slate-700 flex items-center justify-between group hover:border-orange-100 transition-all">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                                                            {s?.name}
                                                        </div>
                                                        <button
                                                            onClick={() => toggleStudent(id)}
                                                            className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-10 opacity-20">
                                                <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Select Students</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 3. Action Button */}
                                <button
                                    disabled={!selectedTutor || selectedStudents.length === 0}
                                    className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] transition-all duration-300 shadow-xl ${selectedTutor && selectedStudents.length > 0
                                            ? "cursor-pointer bg-orange-500 text-white shadow-orange-200 hover:-translate-y-1 active:scale-95"
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
    );
};

export default AllocationScreen;