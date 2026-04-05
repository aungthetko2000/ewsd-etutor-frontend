import { useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";
import { getAnalyticsReport } from "./apiAnalysis";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const colors = [
  "#0ea5e9",
  "#818cf8",
  "#38f8bf",
  "#828f38",
  "#f87171",
  "#fbbf24",
  "#2a5143",
  "#402e78",
];

const Analysis = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReport = async () => {
    if (!startDate || !endDate) {
      alert("Please select both dates");
      return;
    }

    if (endDate < startDate) {
      alert("End date cannot be before start date");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await getAnalyticsReport(startDate, endDate);
      setReport(data);
    } catch (err: any) {
      setError(err.response?.status || "Error");
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  // NAME HANDLER
  const formatName = (u: any) => {
    if (u.firstName || u.lastName) {
      const name = `${u.firstName || ""} ${u.lastName || ""}`.trim();
      if (name) return name;
    }
    if (u.fullName) return u.fullName;
    if (u.name) return u.name;
    if (u.username) return u.username.split("@")[0];
    return "Unknown";
  };

  // PIE
  const pieData = {
    labels: report?.topBrowsers?.map((b: any) => b.browser) || [],
    datasets: [
      {
        data: report?.topBrowsers?.map((b: any) => b.count) || [],
        backgroundColor: colors,
      },
    ],
  };

  // TOP USERS
  const topUsers =
    report?.activeUsers
      ?.sort((a: any, b: any) => b.count - a.count)
      ?.slice(0, 7) || [];

  const barData = {
    labels: topUsers.map((u: any) => formatName(u)),
    datasets: [
      {
        data: topUsers.map((u: any) => u.count),
        backgroundColor: colors,
        borderRadius: 8,
      },
    ],
  };

  const pageNames: Record<string, string> = {
  "/api/v1/login": "Login Page",
  "/api/v1/admin/analytics/report": "Analytics Dashboard",
  "/api/v1/admin": "Admin Management",
  "/api/v1/students": "Student Management",
  "/api/v1/tutors": "Tutor Directory",
  "/api/v1/staffs": "Staff Management",
};

const getPageName = (uri: string) => {
  if (!uri) return "Unknown";

  const clean = uri.split("?")[0];

  const parts = clean.split("/").filter(Boolean);

  const resource = parts[2]; // main resource

  switch (resource) {
    case "login":
      return "Login Page";

    case "admin":
      return "Analytics Dashboard";

    case "students":
      return parts.length > 3 ? "Student Detail" : "Student Management";

    case "tutors":
      return parts.length > 3 ? "Tutor Detail" : "Tutor Directory";

    case "staffs":
      return parts.length > 3 ? "Staff Detail" : "Staff Management";

    default:
      // fallback: make readable automatically
      return resource
        ? resource.charAt(0).toUpperCase() + resource.slice(1)
        : clean;
  }
};

// TOP PAGES
const topPages =
  report?.topPages
    ?.sort((a: any, b: any) => b.count - a.count)
    ?.slice(0, 5) || [];

const lineData = {
  labels: topPages.map((p: any) => getPageName(p.page)), 
  datasets: [
    {
      label: "Views",
      data: topPages.map((p: any) => p.count),
      borderColor: colors[0],
      backgroundColor: colors[0],
      tension: 0.3,
    },
  ],
};

  const hasData =
    report?.topBrowsers?.length ||
    report?.activeUsers?.length ||
    report?.topPages?.length;

  return (
    <div className="space-y-6 p-2 md:p-4">

      {/* FILTER */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-end bg-white p-4 rounded-xl shadow">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded-lg w-full"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded-lg w-full"
        />
        <button
        onClick={fetchReport}
        className="w-full md:w-auto bg-gradient-to-tr from-orange-500 to-rose-500 text-white px-5 py-2.5 rounded-lg whitespace-nowrap"
        >
        {loading ? "Loading..." : "Generate Report"}
      </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading...</p>}

      {!loading && report && !hasData && (
        <p className="text-center text-gray-500">No data</p>
      )}

      {report && hasData && (
        <>
          {/* TOP ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* PIE */}
            <div className="bg-white p-4 md:p-6 rounded-xl shadow">
              <h2 className="mb-4 font-semibold text-sm md:text-base">
                Most Used Browsers
              </h2>
              <div className="w-full h-[250px] sm:h-[280px] md:h-[300px]">
                <Pie
                  data={pieData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>

            {/* BAR */}
            <div className="bg-white p-4 md:p-6 rounded-xl shadow">
              <h2 className="mb-4 font-semibold text-sm md:text-base">
                Most Active Users
              </h2>
              <div className="w-full h-[250px] sm:h-[280px] md:h-[300px]">
                <Bar
                data={barData}
                options={{
                  indexAxis: "y",
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { 
                      beginAtZero: true,
                      ticks: {
                        precision: 0, 
                        stepSize: 1, 
                      },
                    },
                  },
                }}
              />
              </div>
            </div>

          </div>

          {/* LINE FULL WIDTH */}
          {topPages.length > 0 && (
            <div className="bg-white p-4 md:p-6 rounded-xl shadow">
              <h2 className="mb-4 font-semibold text-sm md:text-base">
                Top 5 Most Pages Viewed
              </h2>

              <div className="w-full h-[250px] sm:h-[280px] md:h-[320px]">
                <Line
                  data={lineData}
                  options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0, //  removes decimals
                        
                      },
                    },
                  },
                }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Analysis;