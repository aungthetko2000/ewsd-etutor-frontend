import { useState } from "react";
import { ZoomIcon, TeamsIcon, GoogleMeetIcon } from "./MeetingIcons";

// ─── Types ───────────────────────────────────────────────────────────────────
interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  duration: string;
  notes: string;
  color?: "indigo" | "violet" | "sky" | "emerald" | "rose";
}

interface EventMap {
  [dateKey: string]: CalendarEvent[];
}

// ─── Seed data ────────────────────────────────────────────────────────────────
const SEED_EVENTS: EventMap = {
  "2026-1-3": [
    { id: "1", title: "Math Tutoring",  time: "10:00", duration: "1 hr",    notes: "Algebra chapter 3", color: "indigo" },
    { id: "2", title: "Physics Review", time: "14:00", duration: "30 min",  notes: "",                  color: "sky"    },
    { id: "1", title: "Math Tutoring", time: "10:00", duration: "60 Minutes", notes: "Algebra chapter 3", color: "indigo" },
    { id: "2", title: "Physics Review", time: "14:00", duration: "30 Minutes", notes: "", color: "sky" },
  ],
  "2026-1-7":  [{ id: "3", title: "English Essay",    time: "18:00", duration: "1 hr",    notes: "Essay outline", color: "violet"  }],
  "2026-1-12": [{ id: "4", title: "Chemistry Lab",    time: "14:00", duration: "1 hr 30 min", notes: "",          color: "emerald" }],

  "2026-1-22": [
    { id: "5", title: "Biology Session",    time: "15:00", duration: "1 hr",    notes: "Cell division", color: "indigo" },
    { id: "6", title: "History Exam Prep", time: "19:00", duration: "45 min",  notes: "",               color: "rose"   },
    { id: "5", title: "Biology Session", time: "15:00", duration: "60 Minutes", notes: "Cell division topic", color: "indigo" },
    { id: "6", title: "History Exam Prep", time: "19:00", duration: "45 Minutes", notes: "", color: "rose" },
  ],
  "2026-2-28": [{ id: "7", title: "Final Mock Test", time: "21:00", duration: "2 hr", notes: "Full syllabus", color: "violet" }],
};

// ─── Constants ────────────────────────────────────────────────────────────────
const COLOR_CLASSES: Record<string, { pill: string; dot: string; ring: string; light: string }> = {
  indigo:  { pill: "bg-indigo-100 text-indigo-700",  dot: "bg-indigo-500",  ring: "ring-indigo-400",  light: "bg-indigo-50"  },
  violet:  { pill: "bg-violet-100 text-violet-700",  dot: "bg-violet-500",  ring: "ring-violet-400",  light: "bg-violet-50"  },
  sky:     { pill: "bg-sky-100 text-sky-700",         dot: "bg-sky-500",     ring: "ring-sky-400",     light: "bg-sky-50"     },
  emerald: { pill: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500", ring: "ring-emerald-400", light: "bg-emerald-50" },
  rose:    { pill: "bg-rose-100 text-rose-700",       dot: "bg-rose-500",    ring: "ring-rose-400",    light: "bg-rose-50"    },
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS   = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MOCK_LINKS: Record<string, string> = {
  zoom:  "https://zoom.us/j/meet-etutoring-session",
  teams: "https://teams.microsoft.com/l/meetup-join/etutoring",
  gmeet: "https://meet.google.com/etutoring-session",
};


// ─── Helpers ──────────────────────────────────────────────────────────────────
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function firstDayOffset(year: number, month: number) {
  return (new Date(year, month, 1).getDay() + 6) % 7;
}
function makeDateKey(year: number, month: number, day: number) {
  return `${year}-${month}-${day}`;
}
function formatTime(t: string) {
  if (!t) return "—";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}
function formatDisplay(t: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")}${h >= 12 ? "pm" : "am"}`;
}
function minutesBetween(start: string, end: string) {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
}
function formatDuration(mins: number) {
  if (mins <= 0) return "Invalid";
  const h = Math.floor(mins / 60), m = mins % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}
function addMinutes(time: string, mins: number) {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total / 60) % 24).padStart(2,"0")}:${String(total % 60).padStart(2,"0")}`;
}
function getStartTimeOptions(minTime?: string) {
  const opts: { value: string; label: string }[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const val = `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
      if (minTime && val < minTime) continue;
      opts.push({ value: val, label: formatDisplay(val) });
    }
  }
  return opts;
}
function getEndTimeOptions(startTime: string) {
  const steps = [15,30,45,60,75,90,105,120,135,150,165,180,195,210,225,240,270,300,330,360,390,420,450,480];
  return steps.map(mins => ({
    value: addMinutes(startTime, mins),
    label: `${formatDisplay(addMinutes(startTime, mins))} (${formatDuration(mins)})`,
  }));
}
function getTodayStr() {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`;
}

// ─── Event Pill ───────────────────────────────────────────────────────────────
function EventPill({ event, onClick }: { event: CalendarEvent; onClick: (e: React.MouseEvent) => void }) {
  const c = COLOR_CLASSES[event.color ?? "indigo"];
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium ${c.pill} truncate cursor-pointer hover:brightness-95 transition`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${c.dot}`} />
      <span className="truncate flex-1">{event.title}</span>
      <span className="shrink-0 text-[10px] opacity-60">{formatTime(event.time)}</span>
    </div>
  );
}

// ─── Session Detail Modal ─────────────────────────────────────────────────────
interface DetailModalProps {
  event: CalendarEvent | null;
  dateLabel: string;
  isPast: boolean;
  onClose: () => void;
  onCancel: (id: string) => void;
}

function SessionDetailModal({ event, dateLabel, isPast, onClose, onCancel }: DetailModalProps) {
  const [confirming, setConfirming] = useState(false);
  const [reason, setReason]         = useState("");
  const [reasonError, setReasonError] = useState(false);

  if (!event) return null;
  const c = COLOR_CLASSES[event.color ?? "indigo"];

  const handleConfirmCancel = () => {
    if (!reason.trim()) { setReasonError(true); return; }
    onCancel(event.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-gray-100 bg-white shadow-2xl overflow-hidden">

        {/* Coloured top strip */}
        <div className={`${c.light} px-6 pt-5 pb-4 border-b border-gray-100`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className={`h-3 w-3 rounded-full ${c.dot} mt-0.5 shrink-0`} />
              <div>
                <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{dateLabel}</p>
              </div>
            </div>
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-white/70 hover:text-gray-600 transition">✕</button>
          </div>
        </div>

        {/* Details */}
        <div className="px-6 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Time</p>
              <p className="text-sm font-semibold text-gray-700">{formatTime(event.time)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Duration</p>
              <p className="text-sm font-semibold text-gray-700">{event.duration || "—"}</p>
            </div>
          </div>

          {event.notes && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Notes</p>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-2.5">{event.notes}</p>
            </div>
          )}

          {isPast && (
            <div className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-500">
              <span>🔒</span>
              <span>This session has already passed and cannot be cancelled.</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6">
          {!isPast && !confirming && (
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition">Close</button>
              <button onClick={() => setConfirming(true)} className="flex-1 rounded-xl border-2 border-rose-400 py-2.5 text-sm font-bold text-rose-500 hover:bg-rose-50 transition">Cancel Session</button>
            </div>
          )}

          {!isPast && confirming && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
              <p className="text-sm font-semibold text-rose-700 mb-1">Cancel this session?</p>
              <p className="text-xs text-rose-500 mb-3">This action cannot be undone.</p>
              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-semibold text-rose-600">
                  Reason for cancellation <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => { setReason(e.target.value); setReasonError(false); }}
                  placeholder="e.g. Schedule conflict, illness, emergency..."
                  className={`w-full resize-none rounded-xl border px-3 py-2.5 text-sm text-gray-700 bg-white outline-none placeholder:text-gray-400 transition ${
                    reasonError ? "border-rose-400 ring-2 ring-rose-200" : "border-rose-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                  }`}
                />
                {reasonError && <p className="mt-1 text-xs text-rose-500">Please provide a reason before cancelling.</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setConfirming(false); setReason(""); setReasonError(false); }} className="flex-1 rounded-xl border border-rose-200 py-2 text-sm font-semibold text-rose-400 hover:bg-white transition">Keep It</button>
                <button onClick={handleConfirmCancel} className="flex-1 rounded-xl bg-rose-500 py-2 text-sm font-bold text-white hover:bg-rose-600 transition">Yes, Cancel</button>
              </div>
            </div>
          )}

          {isPast && (
            <button onClick={onClose} className="w-full rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition">Close</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Add Session Modal ────────────────────────────────────────────────────────
interface AddModalProps {
  date: { year: number; month: number; day: number } | null;
  onClose: () => void;
  onSave: (key: string, event: CalendarEvent) => void;
}

function AddEventModal({ date, onClose, onSave }: AddModalProps) {
  const [title,           setTitle]           = useState("");
  const [dateVal,         setDateVal]         = useState("");
  const [startTime,       setStartTime]       = useState("");
  const [endTime,         setEndTime]         = useState("");
  const [students,        setStudents]        = useState<string[]>([""]);
  const [meetingType,     setMeetingType]     = useState<"in-person" | "virtual" | "">("");
  const [location,        setLocation]        = useState("");
  const [virtualPlatform, setVirtualPlatform] = useState<"zoom" | "teams" | "gmeet" | "">("");
  const [notes,           setNotes]           = useState("");
  const [color,           setColor]           = useState<CalendarEvent["color"]>("indigo");
  const [errors,          setErrors]          = useState<Record<string, string>>({});




  if (!date) return null;

  const todayStr      = getTodayStr();
  const defaultDate   = `${date.year}-${String(date.month + 1).padStart(2,"0")}-${String(date.day).padStart(2,"0")}`;
  const activeDateVal = dateVal || defaultDate;

  const now     = new Date();
  const minTime = activeDateVal === todayStr
    ? `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`
    : undefined;

  const diffMins       = minutesBetween(startTime, endTime);
  const duration       = startTime && endTime ? formatDuration(diffMins) : "—";
  const durationInvalid = startTime && endTime && diffMins <= 0;
  const startOptions   = getStartTimeOptions(minTime);
  const endOptions     = getEndTimeOptions(startTime);

  const updateStudent = (i: number, val: string) => setStudents(s => s.map((v, idx) => idx === i ? val : v));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title     = "Session title is required.";
    if (!startTime)    e.startTime = "Start time is required.";
    if (!endTime)      e.endTime   = "End time is required.";
    if (durationInvalid) e.endTime = "End time must be after start time.";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    const d   = new Date(activeDateVal);
    const key = makeDateKey(d.getFullYear(), d.getMonth(), d.getDate());
    onSave(key, {
      id: Math.random().toString(36).slice(2),
      title: title.trim(),
      time: startTime,
      duration,
      notes,
      color,
    });
    onClose();
  };

  const inputCls = (field: string) =>
    `w-full rounded-xl border bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none transition ${
      errors[field]
        ? "border-rose-400 focus:ring-2 focus:ring-rose-100"
        : "border-gray-200 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-gray-100 bg-white px-5 py-4 sm:px-6 sm:py-5 shadow-2xl">

        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">Schedule Session</h3>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">✕</button>
        </div>

        {/* Session Title */}
        <div className="mb-3">
          <label className="mb-1.5 block text-sm font-medium text-gray-600">Session Title</label>
          <input
            className={inputCls("title")}
            placeholder="e.g., Mathematics Weekly Sync"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setErrors(p => ({ ...p, title: "" })); }}
          />
          {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title}</p>}
        </div>

        {/* Date & Time */}
        <div className="mb-3">
          <label className="mb-2 block text-sm font-medium text-gray-600">Date & Time</label>
          <div className={`rounded-2xl border overflow-hidden ${
            errors.startTime || errors.endTime ? "border-rose-300 bg-rose-50" : "border-gray-200 bg-gray-50"
          }`}>
            {/* Date row */}
            <div className="flex items-center border-b border-gray-100 px-3">
              <svg className="w-4 h-4 shrink-0 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input
                type="date"
                defaultValue={defaultDate}
                min={todayStr}
                className="flex-1 min-w-0 bg-transparent py-2.5 text-sm font-medium text-gray-700 outline-none cursor-pointer"
                onChange={(e) => { setDateVal(e.target.value); setStartTime(""); setEndTime(""); }}
              />
            </div>
            {/* Time row */}
            <div className="flex items-center px-3">
              <svg className="w-4 h-4 shrink-0 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <select
                value={startTime}
                className="min-w-0 flex-1 bg-transparent py-2.5 text-sm font-medium text-gray-700 outline-none cursor-pointer appearance-none"
                onChange={(e) => { setStartTime(e.target.value); setEndTime(""); setErrors(p => ({ ...p, startTime: "", endTime: "" })); }}
              >
                <option value="">Start time</option>
                {startOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <span className="shrink-0 text-gray-400 font-medium px-1">–</span>
              <select
                value={endTime}
                disabled={!startTime}
                className="min-w-0 flex-1 bg-transparent py-2.5 text-sm font-medium outline-none cursor-pointer appearance-none disabled:text-gray-300 disabled:cursor-not-allowed text-gray-700"
                onChange={(e) => { setEndTime(e.target.value); setErrors(p => ({ ...p, endTime: "" })); }}
              >
                <option value="">End time</option>
                {endOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            {/* Invalid duration error row */}
            {startTime && endTime && durationInvalid && (
              <div className="flex items-center gap-2 border-t border-rose-200 bg-rose-50 px-3 py-2">
                <svg className="w-3.5 h-3.5 shrink-0 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-semibold text-rose-500">End time must be after start time</span>
              </div>
            )}
          </div>
          {errors.startTime && <p className="mt-1 text-xs text-rose-500">{errors.startTime}</p>}
          {errors.endTime   && <p className="mt-1 text-xs text-rose-500">{errors.endTime}</p>}
        </div>

        {/* Students */}
        <div className="mb-3">
          <div className="space-y-2">
            {students.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 focus-within:border-orange-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100 transition">
                  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <input
                    className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                    placeholder="Student name or email"
                    value={s}
                    onChange={(e) => updateStudent(i, e.target.value)}
                  />
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Meeting Type */}
        <div className="mb-3">
          <label className="mb-2 block text-sm font-medium text-gray-600">Meeting Type</label>
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => { setMeetingType("in-person"); setVirtualPlatform(""); }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2 text-sm font-semibold transition ${
                meetingType === "in-person"
                  ? "border-orange-400 bg-orange-50 text-orange-600"
                  : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              In-Person
            </button>
            <button
              onClick={() => { setMeetingType("virtual"); setLocation(""); }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2 text-sm font-semibold transition ${
                meetingType === "virtual"
                  ? "border-indigo-400 bg-indigo-50 text-indigo-600"
                  : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.382v7.236a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Virtual
            </button>
          </div>

          {/* In-Person → location */}
          {meetingType === "in-person" && (
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 focus-within:border-orange-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100 transition">
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                placeholder="Enter location (room, address...)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          )}

          {/* Virtual → platform picker */}
          {meetingType === "virtual" && (
            <div className="space-y-3">
              <div className="flex gap-2">
                {/* Zoom */}
                <button
                  onClick={() => setVirtualPlatform("zoom")}
                  className={`flex flex-1 flex-col items-center gap-1.5 rounded-xl border-2 py-2 text-xs font-semibold transition ${
                    virtualPlatform === "zoom"
                      ? "border-[#2D8CFF] bg-blue-50 text-[#2D8CFF] shadow-[0_0_0_4px_rgba(45,140,255,0.12)]"
                      : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-blue-50 hover:border-blue-200"
                  }`}
                >
                  <ZoomIcon className="w-6 h-6 object-contain" />
                  <span>Zoom</span>
                </button>

                {/* Teams */}
                <button
                  onClick={() => setVirtualPlatform("teams")}
                  className={`flex flex-1 flex-col items-center gap-1.5 rounded-xl border-2 py-2 text-xs font-semibold transition min-w-0 ${
                    virtualPlatform === "teams"
                      ? "border-[#6264A7] bg-indigo-50 text-[#6264A7] shadow-[0_0_0_4px_rgba(98,100,167,0.12)]"
                      : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-indigo-50 hover:border-indigo-200"
                  }`}
                >
                  <TeamsIcon className="w-6 h-6 object-contain" />
                  <span className="truncate w-full text-center px-1">Teams</span>
                </button>

                {/* Google Meet */}
                <button
                  onClick={() => setVirtualPlatform("gmeet")}
                  className={`flex flex-1 flex-col items-center gap-1.5 rounded-xl border-2 py-2 text-xs font-semibold transition ${
                    virtualPlatform === "gmeet"
                      ? "border-[#00897B] bg-green-50 text-[#00897B] shadow-[0_0_0_4px_rgba(0,137,123,0.12)]"
                      : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-green-50 hover:border-green-200"
                  }`}
                >
                  <GoogleMeetIcon className="w-6 h-6 object-contain" />
                  <span className="truncate w-full text-center px-1">Meet</span>
                </button>
              </div>

        <div className="mb-4">
        
          <div className="relative group">
          

            {/* Custom Modern Arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 group-focus-within:text-orange-500 transition-colors">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
        </div>

              {/* Auto link */}
              {virtualPlatform && (
                <div className="flex items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-3 py-2.5">
                  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="flex-1 truncate text-xs text-gray-500 font-mono">{MOCK_LINKS[virtualPlatform]}</span>
                  <span className="shrink-0 rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-semibold text-gray-500">Auto</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Session Color */}
        <div className="mb-3">
          <label className="mb-2 block text-sm font-medium text-gray-600">Session Color</label>
          <div className="flex gap-2.5">
            {(["indigo", "violet", "sky", "emerald", "rose"] as const).map(c => (
              <button key={c} onClick={() => setColor(c)}
                className={`h-7 w-7 rounded-full ${COLOR_CLASSES[c].dot} transition-transform
                  ${color === c ? `ring-2 ring-offset-2 ${COLOR_CLASSES[c].ring} scale-110` : "hover:scale-105"}`} />
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-3">
          <div className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-orange-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100 transition">
            <svg className="mt-0.5 w-4 h-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h10" />
            </svg>
            <textarea
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
              placeholder="Add description"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-1">
          <button onClick={onClose} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition">Cancel</button>
          <button onClick={handleSave} className="flex-1 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 py-2.5 text-sm font-bold text-white shadow-md hover:opacity-90 active:scale-95 transition-all">Create Request</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Calendar ────────────────────────────────────────────────────────────
export default function CalendarSchedule() {
  const today = new Date();

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [events,       setEvents]       = useState<EventMap>(SEED_EVENTS);

  // Add session modal
  const [addModalDate, setAddModalDate] = useState<{ year: number; month: number; day: number } | null>(null);
  const [detailState,  setDetailState]  = useState<{ event: CalendarEvent; dateLabel: string; isPast: boolean } | null>(null);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const offset = firstDayOffset(currentYear, currentMonth);
  const prevMonthDays = getDaysInMonth(currentYear, currentMonth === 0 ? 11 : currentMonth - 1);
  const totalCells    = Math.ceil((offset + daysInMonth) / 7) * 7;
  const todayStart    = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const goPrev = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const goNext = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };
  const goToday = () => { setCurrentYear(today.getFullYear()); setCurrentMonth(today.getMonth()); };

  const handleSaveEvent   = (key: string, event: CalendarEvent) => setEvents(prev => ({ ...prev, [key]: [...(prev[key] ?? []), event] }));
  const handleCancelEvent = (id: string) => setEvents(prev => {
    const updated: EventMap = {};
    for (const key in prev) {
      const filtered = prev[key].filter(e => e.id !== id);
      if (filtered.length > 0) updated[key] = filtered;
    }
    return updated;
  });

  const isToday = (day: number) =>
    day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

  return (
    <>
      {/* Toolbar */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={goPrev} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 transition">‹</button>
          <span className="min-w-[160px] text-center text-base font-bold text-gray-800">{MONTHS[currentMonth]} {currentYear}</span>
          <button onClick={goNext} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 transition">›</button>
          <button onClick={goToday} className="ml-1 rounded-lg border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition">Today</button>
        </div>
        <button
          onClick={() => setAddModalDate({ year: currentYear, month: currentMonth, day: today.getDate() })}
          className="cursor-pointer rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 px-5 py-2 text-sm font-semibold text-white shadow hover:opacity-90 active:scale-95 transition-all"
        >
          + Add Session
        </button>
      </div>

      {/* Calendar */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
          {WEEKDAYS.map(d => (
            <div key={d} className="py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {Array.from({ length: totalCells }).map((_, i) => {
            const dayNum = i - offset + 1;
            const isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
            const displayDay = isCurrentMonth
              ? dayNum
              : dayNum < 1 ? prevMonthDays + dayNum : dayNum - daysInMonth;

            const key = makeDateKey(currentYear, currentMonth, dayNum);
            const cellEvents = isCurrentMonth ? (events[key] ?? []) : [];
            const todayCell = isCurrentMonth && isToday(dayNum);
            const isPast = isCurrentMonth && new Date(currentYear, currentMonth, dayNum) < todayStart;

            return (
              <div
                key={i}
                onClick={() => { if (!isCurrentMonth || isPast) return; setAddModalDate({ year: currentYear, month: currentMonth, day: dayNum }); }}
                className={[
                  "min-h-[100px] border-b border-r border-gray-100 p-2 transition-colors",
                  i % 7 === 6 ? "border-r-0" : "",
                  !isCurrentMonth ? "bg-gray-50/70" :
                  isPast         ? "cursor-not-allowed bg-gray-50/50" :
                                   "cursor-pointer hover:bg-orange-50/40",
                    isPast ? "cursor-not-allowed bg-gray-50/50" :
                      "cursor-pointer hover:bg-orange-50/40",
                ].join(" ")}
              >
                <div className="mb-1.5 flex">
                  <span className={[
                    "flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold",
                    todayCell ? "bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow" :
                      isPast ? "text-gray-300" :
                        isCurrentMonth ? "text-gray-700" : "text-gray-300",
                  ].join(" ")}>
                    {displayDay}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  {cellEvents.slice(0, 2).map(ev => (
                    <EventPill
                      key={ev.id}
                      event={ev}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailState({
                          event: ev,
                          dateLabel: `${MONTHS[currentMonth]} ${dayNum}, ${currentYear}`,
                          isPast,
                        });
                      }}
                    />
                  ))}
                  {cellEvents.length > 2 && (
                    <span className="pl-1 text-[10px] font-medium text-gray-400">+{cellEvents.length - 2} more</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <AddEventModal
        date={addModalDate}
        onClose={() => setAddModalDate(null)}
        onSave={handleSaveEvent}
      />
      <SessionDetailModal
        event={detailState?.event ?? null}
        dateLabel={detailState?.dateLabel ?? ""}
        isPast={detailState?.isPast ?? false}
        onClose={() => setDetailState(null)}
        onCancel={handleCancelEvent}
      />
    </>
  );
}