import { observer } from "mobx-react-lite";
import { useStore } from "../store/useStore";
import { DataTable } from "../dataTable/DataTable";
import { columns } from "../column/columns";
import { useEffect } from "react";
import LoaderIcon from "../common/LoaderIcon";

const ExceptionReport = observer(() => {

    const { reportStore } = useStore();

    const handleGenerate = async () => {
        reportStore.state.unAssignedStudent = []
        const reportType = reportStore.state.reportType;
        if (reportType === "NON_ALLOCATED") {
            await reportStore.getUnassignedStudent();
            return;
        }
        if (reportType === "INACTIVE") {
            const range = reportStore.state.inactiveRange;
            let days = 7;
            if (range === "7_DAYS") days = 7;
            if (range === "28_DAYS") days = 28;
            await reportStore.getInActiveReport(days);
            return;
        }
    };


    useEffect(() => {
        reportStore.state.unAssignedStudent = []
        reportStore.state.reportType = ''
        reportStore.state.inactiveRange = ''
    }, [])

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-[#f8fafc]">
            {/* Header Section */}
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                        Exception Report
                    </h3>
                    <p className="text-slate-500 font-medium">System-wide student status monitoring</p>
                </div>
                <div className="hidden md:block text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Last Updated</span>
                    <p className="text-sm font-semibold text-slate-600">Just now</p>
                </div>
            </div>

            {/* Filter Bar - Modern "Floating" Style */}
            <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-2">
                <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex-1 min-w-[200px] p-2">
                        <select
                            value={reportStore.state.reportType}
                            onChange={(e) => {
                                reportStore.state.setReportType(e.target.value);
                                reportStore.state.setInActiveRange("");
                            }}
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer"
                        >
                            <option value="">--- Select ---</option>
                            <option value="NON_ALLOCATED">Non-Allocated Students</option>
                            <option value="INACTIVE">Inactive Students</option>
                        </select>
                    </div>

                    {reportStore.state.reportType === "INACTIVE" && (
                        <div className="flex-1 min-w-[180px] p-2 animate-in fade-in zoom-in-95 duration-300">
                            <select
                                value={reportStore.state.inactiveRange}
                                onChange={(e) => reportStore.state.setInActiveRange(e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-orange-500/20 transition-all cursor-pointer"
                            >
                                <option value="">--- Select ---</option>
                                <option value="7">Last 7 Days</option>
                                <option value="28">Last 28 Days</option>
                            </select>
                        </div>
                    )}

                    <div className="p-2">
                        <button
                            onClick={handleGenerate}
                            disabled={
                                !reportStore.state.reportType ||
                                (reportStore.state.reportType === "INACTIVE" && !reportStore.state.inactiveRange)
                            }
                            className="h-[50px] px-8 rounded-xl font-bold text-sm transition-all duration-300 
            /* Enabled State */
            enabled:bg-gradient-to-br from-orange-500 to-rose-500 enabled:text-white enabled:shadow-lg enabled:shadow-orange-500/30 enabled:hover:bg-orange-600 enabled:active:scale-95
            /* Disabled State */
            disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed disabled:border disabled:border-slate-200"
                        >
                            <div className="flex items-center gap-2">
                                <span>Generate Report</span>
                                {!reportStore.state.reportType && (
                                    <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                )}
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* The Table Section */}
            <div className="relative pt-4">
                {reportStore.state.loading ? (
                    <LoaderIcon />
                ) : reportStore.state.unAssignedStudent.length > 0 ? (
                    <div className="bg-white rounded-[2rem] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.05)] border border-slate-200/80 overflow-hidden">

                        {/* Dark/Gradient Table Header Decoration */}
                        <div className="bg-slate-900 px-8 py-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/40">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg leading-tight">Student Data Log</h4>
                                    <p className="text-slate-400 text-xs font-medium uppercase tracking-tighter">Verified Directory</p>
                                </div>
                            </div>

                            <button className="bg-white/20 hover:bg-amber-500 cursor-pointer text-white text-[10px] font-black px-4 py-2 rounded-lg transition-colors border border-white/10 tracking-widest">
                                EXPORT AS CSV
                            </button>
                        </div>

                        <div className="p-4 overflow-x-auto">
                            <style>{`
                            /* Targeting the inner DataTable if it allows CSS overrides */
                            .rdt_TableHeadRow {
                                background-color: #f1f5f9 !important; /* Soft Slate Header */
                                color: #475569 !important;
                                font-weight: 800 !important;
                                text-transform: uppercase !important;
                                letter-spacing: 0.05em !important;
                                border-bottom: 2px solid #e2e8f0 !important;
                                font-size: 11px !important;
                            }
                            .rdt_TableRow {
                                border-bottom: 1px solid #f1f5f9 !important;
                                color: #1e293b !important;
                                transition: all 0.2s ease !important;
                            }
                            .rdt_TableRow:hover {
                                background-color: #fff7ed !important; /* Soft Orange Hover */
                                transform: scale(1.002);
                            }
                        `}</style>
                            <DataTable
                                data={reportStore.state.unAssignedStudent}
                                columns={columns}
                            />
                        </div>

                        {/* Table Footer / Summary */}
                        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 flex items-center justify-between">
                            <p className="text-xs font-bold text-slate-500 italic">Showing all {reportStore.state.unAssignedStudent.length} records</p>
                            <div className="flex gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <div className="h-2 w-2 rounded-full bg-slate-200"></div>
                                <div className="h-2 w-2 rounded-full bg-slate-200"></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="relative overflow-hidden bg-white border border-slate-200 rounded-[2rem] p-12">
                        {/* Decorative Grid Background */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                            style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '24px 24px' }}>
                        </div>

                        <div className="relative flex flex-col md:flex-row items-center justify-center gap-10">

                            {/* Left Side: Visual Metric */}
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full border-4 border-slate-50 flex items-center justify-center shadow-inner">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-lg shadow-emerald-200/50">
                                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                                {/* Pulsing indicator */}
                                <div className="absolute top-0 right-0 w-4 h-4 bg-orange-500 rounded-full border-2 border-white animate-pulse"></div>
                            </div>

                            {/* Right Side: Text & Data */}
                            <div className="text-center md:text-left space-y-2">
                                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
                                    No Exceptions Found
                                </h3>
                                <p className="text-slate-500 font-medium max-w-xs leading-relaxed">
                                    Students records are fully compliant with the current <span className="text-slate-900 font-semibold">{reportStore.state.reportType?.replace('_', ' ')}</span> criteria.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

export default ExceptionReport;