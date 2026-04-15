import { useState, useMemo, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useAssignedStudents, type Student } from "./apiAssignedStudents";
import { useNavigate } from "react-router-dom";

function getInitials(name: string) {
  if (!name?.trim()) return "?";
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0] || "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function SearchIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

export default function AssignedStudents() {
  const { user } = useAuth();
  const { students, loading, error } = useAssignedStudents(user?.id ?? 0);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof Student>("fullName");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const PAGE_SIZE = 8;


  const navigate = useNavigate();

  const handleAssignmentDetails = (studentId: number | undefined) => {
    navigate(`/assignments/${studentId}`);
  };

  const gradeOptions = useMemo(() => {
    const grades = Array.from(
      new Set(students.map((s) => s.grade).filter(Boolean) as string[])
    ).sort((a, b) => {
      // Sort "Grade N" numerically, anything else alphabetically
      const numA = parseInt(a.replace(/\D/g, ""), 10);
      const numB = parseInt(b.replace(/\D/g, ""), 10);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    });
    return grades;
  }, [students]);

  const handleContactClick = (student: any) => {
    navigate(`/message/${student.id}`, {
      state: {
        partnerId: student.id,
        partnerEmail: student.email,
        partnerName: student.fullName
      }
    });
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Element;
      if (!target.closest("[data-filter-dropdown]")) setFilterOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSort(key: keyof Student) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return students
      .filter((s) => {
        const matchSearch =
          !q ||
          s.fullName?.toLowerCase().includes(q) ||
          s.email?.toLowerCase().includes(q) ||
          s.grade?.toLowerCase().includes(q);
        const matchGrade =
          gradeFilter === "all" || s.grade === gradeFilter;
        return matchSearch && matchGrade;
      })
      .sort((a, b) => {
        const aVal = a[sortKey] ?? "";
        const bVal = b[sortKey] ?? "";
        const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
        return sortDir === "asc" ? cmp : -cmp;
      });
  }, [search, gradeFilter, students, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const columns: { key: keyof Student; label: string; sortable: boolean }[] = [
    { key: "fullName", label: "Student", sortable: true },
    { key: "grade", label: "Grade", sortable: true },
    { key: "age", label: "Age", sortable: true },
    { key: "email", label: "Email", sortable: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Header row ── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">My Students</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage and track your assigned students</p>
          </div>
          <div className="bg-white rounded-2xl px-6 py-4 shadow-md text-right">
            <p className="text-xs text-gray-600 tracking-wide">Total Assigned Students</p>
            <p className="text-3xl font-extrabold text-orange-500">{students.length}</p>
          </div>
        </div>

        {/* ── Filters bar ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">

          {/* Search */}
          <div className="flex-1 bg-white rounded-xl shadow-sm flex items-center gap-2 px-3 py-2.5 hover:shadow-md transition-shadow">
            <SearchIcon />
            <input
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
              placeholder="Search by name, email or grade…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
            )}
          </div>

          {/* Grade filter dropdown */}
          <div className="relative" data-filter-dropdown>
            <button
              onClick={() => setFilterOpen((o) => !o)}
              className={`flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow-sm text-sm font-medium transition-all hover:shadow-md ${gradeFilter !== "all" ? "border border-orange-300 text-orange-600" : "text-gray-600"
                }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              {gradeFilter === "all" ? "Grade" : gradeFilter}
              {gradeFilter !== "all" && (
                <span className="w-2 h-2 rounded-full bg-orange-500" />
              )}
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {filterOpen && (
              <div className="absolute right-0 top-[calc(100%+6px)] z-50 bg-white rounded-xl shadow-lg border border-gray-100 min-w-[180px] overflow-hidden">
                <p className="px-3 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                  Grade
                </p>

                {/* All grades option */}
                <button
                  onClick={() => { setGradeFilter("all"); setPage(1); setFilterOpen(false); }}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50/60 transition-colors"
                >
                  <span>All Grades</span>
                  <span className="text-xs text-gray-400 tabular-nums">{students.length}</span>
                </button>

                {/* Dynamic grade options derived from data */}
                {gradeOptions.length > 0 ? (
                  gradeOptions.map((grade) => {
                    const count = students.filter((s) => s.grade === grade).length;
                    return (
                      <button
                        key={grade}
                        onClick={() => { setGradeFilter(grade); setPage(1); setFilterOpen(false); }}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50/60 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-orange-400" />
                          {grade}
                        </span>
                        <span className="text-xs text-gray-400 tabular-nums">{count}</span>
                      </button>
                    );
                  })
                ) : (
                  <p className="px-4 py-3 text-sm text-gray-400 italic">No grades available</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex justify-center items-center py-24">
            <div className="w-8 h-8 rounded-full border-4 border-orange-200 border-t-orange-500 animate-spin" />
          </div>
        )}

        {/* ── Error ── */}
        {error && !loading && (
          <div className="text-center py-10 text-red-500 font-medium">{error}</div>
        )}

        {/* ── Table ── */}
        {!loading && !error && (
          <div className="bg-white rounded-3xl shadow-md">

            <div className="px-6 py-4 border-b border-gray-100 rounded-t-3xl overflow-hidden">
              <p className="text-sm text-gray-400">
                Showing{" "}
                <span className="font-semibold text-gray-700">{paginated.length}</span>
                {" "}of{" "}
                <span className="font-semibold text-gray-700">{filtered.length}</span>
                {" "}students
              </p>
            </div>

            <div
              className="overflow-x-auto w-full touch-pan-x"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <table className="min-w-[900px] w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {/* # — always visible */}
                    <th className="w-10 px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">#</th>
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide"
                      >
                        {col.sortable ? (
                          <button onClick={() => handleSort(col.key)} className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                            {col.label}
                          </button>
                        ) : col.label}
                      </th>
                    ))}
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {paginated.length > 0 ? (
                    paginated.map((student, idx) => {
                      const initials = getInitials(student.fullName || "");
                      const rowNum = (page - 1) * PAGE_SIZE + idx + 1;
                      return (
                        <tr key={student.id ?? idx} className="hover:bg-orange-50/40 transition-colors group">

                          {/* Row number — always visible */}
                          <td className="px-6 py-4 text-gray-400 text-xs">{rowNum}</td>

                          {/* Student name — always visible */}
                          <td className="px-4 sm:px-6 py-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div style={{ padding: 2, borderRadius: "9999px", background: "#fff", flexShrink: 0 }}>
                                <div style={{
                                  width: 36, height: 36, borderRadius: "9999px",
                                  background: "linear-gradient(135deg,#f97316,#e11d48)",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                  <span style={{ fontSize: 12, fontWeight: 800, color: "#fff" }}>{initials}</span>
                                </div>
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-900 leading-tight truncate">{student.fullName || "—"}</p>
                              </div>
                            </div>
                          </td>

                          {/* Grade — always visible */}
                          <td className="px-4 sm:px-6 py-4 text-gray-700">{student.grade || "—"}</td>

                          {/* Age — always visible */}
                          <td className="px-6 py-4 text-gray-700">{student.age != null ? `${student.age} yrs` : "—"}</td>

                          {/* Email — always visible */}
                          <td className="px-6 py-4 text-gray-500">{student.email || "—"}</td>

                          {/* Actions */}
                          <td className="px-4 sm:px-6 py-4">
                            <div className="flex items-center gap-1.5 sm:gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleContactClick(student)}
                                title="Message"
                                className="cursor-pointer w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110"
                                style={{ background: "linear-gradient(135deg,#f97316,#e11d48)", boxShadow: "0 2px 6px rgba(249,115,22,0.35)" }}
                              >
                                <MessageIcon />
                              </button>
                              <button
                                onClick={() => handleAssignmentDetails(student.id)}
                                title="Schedule"
                                className="cursor-pointer w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110"
                                style={{ background: "linear-gradient(135deg,#f97316,#e11d48)", boxShadow: "0 2px 6px rgba(249,115,22,0.35)" }}
                              >
                                <DocumentIcon />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-16 text-gray-400">
                        <p className="text-3xl mb-2">🔍</p>
                        <p className="font-medium">No students found</p>
                        <p className="text-sm mt-1">Try adjusting your search or filter</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  Page <span className="font-semibold text-gray-600">{page}</span> of{" "}
                  <span className="font-semibold text-gray-600">{totalPages}</span>
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-sm disabled:opacity-40 hover:bg-gray-200 transition-colors"
                  >&lt;</button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${page === p ? "text-white shadow" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      style={page === p ? { background: "linear-gradient(135deg,#f97316,#e11d48)" } : {}}
                    >{p}</button>
                  ))}

                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-sm disabled:opacity-40 hover:bg-gray-200 transition-colors"
                  >&gt;</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}