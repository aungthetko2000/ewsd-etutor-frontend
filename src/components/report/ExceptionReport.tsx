import { observer } from "mobx-react-lite";
import { useStore } from "../store/useStore";
import { DataTable } from "../dataTable/DataTable";
import { columns } from "../column/columns";
import LoaderIcon from "../common/LoaderIcon";
import { useEffect } from "react";

const ExceptionReport = observer(() => {

    const { reportStore } = useStore();

    const handleGenerate = () => {
        reportStore.getUnassignedStudent();
    };

    useEffect(() => {
        reportStore.state.unAssignedStudent = []
    }, [])

    return (
        <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Exception Report</h3>

            {/* Row Layout */}
            <div className="flex items-end gap-4 flex-wrap">

                {/* First Dropdown */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Report Type
                    </label>
                    <select
                        value={reportStore.state.reportType}
                        onChange={(e) => {
                            reportStore.state.setReportType(e.target.value)
                            reportStore.state.setInActiveRange("")
                        }}
                        className="border rounded px-3 py-2 w-56"
                    >
                        <option value="">-- Select --</option>
                        <option value="NON_ALLOCATED">Non-Allocated Students</option>
                        <option value="INACTIVE">Inactive Students</option>
                    </select>
                </div>

                {/* Second Dropdown (only when INACTIVE) */}
                {reportStore.state.reportType === "INACTIVE" && (
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Duration
                        </label>
                        <select
                            value={reportStore.state.inactiveRange}
                            onChange={(e) => reportStore.state.setInActiveRange(e.target.value)}
                            className="border rounded px-3 py-2 w-40"
                        >
                            <option value="">-- Select --</option>
                            <option value="7_DAYS">7 Days</option>
                            <option value="8_DAYS">8 Days</option>
                        </select>
                    </div>
                )}

                {/* Button */}
                <button
                    onClick={handleGenerate}
                    disabled={
                        !reportStore.state.reportType || (reportStore.state.reportType === "INACTIVE" && !reportStore.state.inactiveRange)
                    }
                    className="w-full md:w-auto bg-gradient-to-tr from-orange-500 to-rose-500 text-white px-5 py-2.5 rounded-lg whitespace-nowrap"
                >
                    Generate Report
                </button>
            </div>

            <div className="pt-8 animate-in fade-in duration-700">
                {reportStore.state.loading ? (
                    <LoaderIcon />
                ) : reportStore.state.unAssignedStudent.length > 0 ? (
                    <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">

                        {/* Table Header Section */}
                        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-b from-slate-50/50 to-transparent">
                            <div>
                                <h4 className="text-lg font-bold text-slate-800 tracking-tight">
                                    Unassigned Students
                                </h4>
                                <p className="text-sm text-slate-500">Manage and review student allocation status</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex justify-end">
                                    <button className="text-xs font-semibold text-slate-400 hover:text-orange-500 transition-colors uppercase tracking-widest">
                                        Export to CSV
                                    </button>
                                </div>
                                {/* Count Badge */}
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-lg">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                    </span>
                                    <span className="text-orange-700 text-xs font-bold whitespace-nowrap">
                                        {reportStore.state.unAssignedStudent.length} Total Records
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Table Body */}
                        <div className="p-1">
                            <div className="overflow-x-auto custom-scrollbar">
                                <DataTable
                                    data={reportStore.state.unAssignedStudent}
                                    columns={columns}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-16 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <h3 className="text-slate-600 font-semibold text-lg">All caught up!</h3>
                        <p className="text-slate-400 text-sm max-w-xs text-center mt-1">
                            No unassigned students were found for the selected criteria.
                        </p>
                    </div>
                )}
            </div>

        </div>
    );
});

export default ExceptionReport;