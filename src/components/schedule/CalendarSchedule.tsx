import { useState } from "react";

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

// ─── Sample seed data ─────────────────────────────────────────────────────────
const SEED_EVENTS: EventMap = {
  "2026-1-3": [
    { id: "1", title: "Math Tutoring",  time: "10:00", duration: "60 Minutes", notes: "Algebra chapter 3", color: "indigo" },
    { id: "2", title: "Physics Review", time: "14:00", duration: "30 Minutes", notes: "", color: "sky" },
  ],
  "2026-1-7":  [{ id: "3", title: "English Essay",    time: "18:00", duration: "60 Minutes",  notes: "Essay outline review", color: "violet"  }],
  "2026-1-12": [{ id: "4", title: "Chemistry Lab",    time: "14:00", duration: "90 Minutes",  notes: "", color: "emerald" }],
  "2026-1-22": [
    { id: "5", title: "Biology Session",    time: "15:00", duration: "60 Minutes", notes: "Cell division topic", color: "indigo" },
    { id: "6", title: "History Exam Prep", time: "19:00", duration: "45 Minutes", notes: "", color: "rose" },
  ],
  "2026-2-28": [{ id: "7", title: "Final Mock Test", time: "21:00", duration: "120 Minutes", notes: "Full syllabus", color: "violet" }],
};

const COLOR_CLASSES: Record<string, { pill: string; dot: string; ring: string; badge: string; light: string }> = {
  indigo:  { pill: "bg-indigo-100 text-indigo-700",  dot: "bg-indigo-500",  ring: "ring-indigo-400",  badge: "bg-indigo-500",  light: "bg-indigo-50"  },
  violet:  { pill: "bg-violet-100 text-violet-700",  dot: "bg-violet-500",  ring: "ring-violet-400",  badge: "bg-violet-500",  light: "bg-violet-50"  },
  sky:     { pill: "bg-sky-100 text-sky-700",         dot: "bg-sky-500",     ring: "ring-sky-400",     badge: "bg-sky-500",     light: "bg-sky-50"     },
  emerald: { pill: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500", ring: "ring-emerald-400", badge: "bg-emerald-500", light: "bg-emerald-50" },
  rose:    { pill: "bg-rose-100 text-rose-700",       dot: "bg-rose-500",    ring: "ring-rose-400",    badge: "bg-rose-500",    light: "bg-rose-50"    },
};

const DURATIONS = ["15 Minutes","30 Minutes","45 Minutes","60 Minutes","90 Minutes","120 Minutes"];
const WEEKDAYS  = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const MONTHS    = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// ─── Helpers ─────────────────────────────────────────────────────────────────
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
  const suffix = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${suffix}`;
}

// ─── Event Pill ───────────────────────────────────────────────────────────────
function EventPill({
  event,
  onClick,
}: {
  event: CalendarEvent;
  onClick: (e: React.MouseEvent) => void;
}) {
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

// ─── Session Detail Modal (View + Cancel) ─────────────────────────────────────
interface DetailModalProps {
  event: CalendarEvent | null;
  dateLabel: string;
  isPast: boolean;
  onClose: () => void;
  onCancel: (id: string) => void;
}

function SessionDetailModal({ event, dateLabel, isPast, onClose, onCancel }: DetailModalProps) {
  const [confirming, setConfirming] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState(false);

  if (!event) return null;
  const c = COLOR_CLASSES[event.color ?? "indigo"];

  const handleConfirmCancel = () => {
    if (!reason.trim()) { setReasonError(true); return; }
    onCancel(event.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white shadow-2xl overflow-hidden">

        {/* Coloured top strip */}
        <div className={`${c.light} px-7 pt-6 pb-5 border-b border-gray-100`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className={`h-3 w-3 rounded-full ${c.dot} mt-0.5`} />
              <div>
                <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{dateLabel}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-white/70 hover:text-gray-600 transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="px-7 py-5 space-y-4">
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

          {/* Past session notice */}
          {isPast && (
            <div className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-500">
              <span>🔒</span>
              <span>This session has already passed and cannot be cancelled.</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-7 pb-6">
          {!isPast && !confirming && (
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
              >
                Close
              </button>
              <button
                onClick={() => setConfirming(true)}
                className="flex-1 rounded-xl border-2 border-rose-400 py-2.5 text-sm font-bold text-rose-500 hover:bg-rose-50 transition"
              >
                Cancel Session
              </button>
            </div>
          )}

          {/* Confirmation step */}
          {!isPast && confirming && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
              <p className="text-sm font-semibold text-rose-700 mb-1">Cancel this session?</p>
              <p className="text-xs text-rose-500 mb-3">This action cannot be undone. The session will be permanently removed.</p>

              {/* Reason textbox */}
              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-semibold text-rose-600">
                  Reason for cancellation <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => { setReason(e.target.value); setReasonError(false); }}
                  placeholder="e.g. Schedule conflict, illness, emergency..."
                  className={[
                    "w-full resize-none rounded-xl border px-3 py-2.5 text-sm text-gray-700 bg-white outline-none placeholder:text-gray-400 transition",
                    reasonError
                      ? "border-rose-400 ring-2 ring-rose-200"
                      : "border-rose-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100",
                  ].join(" ")}
                />
                {reasonError && (
                  <p className="mt-1 text-xs text-rose-500">Please provide a reason before cancelling.</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => { setConfirming(false); setReason(""); setReasonError(false); }}
                  className="flex-1 rounded-xl border border-rose-200 py-2 text-sm font-semibold text-rose-400 hover:bg-white transition"
                >
                  Keep It
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="flex-1 rounded-xl bg-rose-500 py-2 text-sm font-bold text-white hover:bg-rose-600 transition"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          )}

          {isPast && (
            <button
              onClick={onClose}
              className="w-full rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
            >
              Close
            </button>
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
  const [title,    setTitle]    = useState("");
  const [dateVal,  setDateVal]  = useState("");
  const [time,     setTime]     = useState("");
  const [duration, setDuration] = useState("60 Minutes");
  const [notes,    setNotes]    = useState("");
  const [color,    setColor]    = useState<CalendarEvent["color"]>("indigo");

  if (!date) return null;

  const handleSave = () => {
    if (!title.trim()) return;
    const key = dateVal
      ? (() => { const d = new Date(dateVal); return makeDateKey(d.getFullYear(), d.getMonth(), d.getDate()); })()
      : makeDateKey(date.year, date.month, date.day);

    onSave(key, {
      id: Math.random().toString(36).slice(2),
      title: title.trim(),
      time,
      duration,
      notes,
      color,
    });
    onClose();
  };

  const defaultDate = `${date.year}-${String(date.month + 1).padStart(2,"0")}-${String(date.day).padStart(2,"0")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-7 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">Schedule Session</h3>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition">✕</button>
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-600">Session Title</label>
          <input
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition"
            placeholder="e.g., Mathematics Weekly Sync"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-600">Date</label>
            <input type="date" defaultValue={defaultDate}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition"
              onChange={(e) => setDateVal(e.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-600">Time</label>
            <input type="time"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition"
              onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-gray-600">Duration (minutes)</label>
          <select
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition"
            value={duration} onChange={(e) => setDuration(e.target.value)}>
            {DURATIONS.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-600">Session Color</label>
          <div className="flex gap-2.5">
            {(["indigo","violet","sky","emerald","rose"] as const).map(c => (
              <button key={c} onClick={() => setColor(c)}
                className={`h-7 w-7 rounded-full ${COLOR_CLASSES[c].dot} transition-transform
                  ${color === c ? `ring-2 ring-offset-2 ${COLOR_CLASSES[c].ring} scale-110` : "hover:scale-105"}`} />
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-1.5 block text-sm font-medium text-gray-600">Notes</label>
          <textarea rows={3}
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition"
            placeholder="What topics will be covered?"
            value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <div className="flex gap-3">
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

  const [currentYear,  setCurrentYear]  = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [events,       setEvents]       = useState<EventMap>(SEED_EVENTS);

  // Add session modal
  const [addModalDate, setAddModalDate] = useState<{ year: number; month: number; day: number } | null>(null);

  // Detail / cancel modal
  const [detailState, setDetailState] = useState<{
    event: CalendarEvent;
    dateLabel: string;
    isPast: boolean;
  } | null>(null);

  const daysInMonth   = getDaysInMonth(currentYear, currentMonth);
  const offset        = firstDayOffset(currentYear, currentMonth);
  const prevMonthDays = getDaysInMonth(currentYear, currentMonth === 0 ? 11 : currentMonth - 1);
  const totalCells    = Math.ceil((offset + daysInMonth) / 7) * 7;

  const goPrev = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const goNext = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };
  const goToday = () => { setCurrentYear(today.getFullYear()); setCurrentMonth(today.getMonth()); };

  const handleSaveEvent = (key: string, event: CalendarEvent) => {
    setEvents(prev => ({ ...prev, [key]: [...(prev[key] ?? []), event] }));
  };

  const handleCancelEvent = (id: string) => {
    setEvents(prev => {
      const updated: EventMap = {};
      for (const key in prev) {
        const filtered = prev[key].filter(e => e.id !== id);
        if (filtered.length > 0) updated[key] = filtered;
      }
      return updated;
    });
  };

  const isToday = (day: number) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <>
      {/* ── Toolbar ── */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={goPrev} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 transition">‹</button>
          <span className="min-w-[160px] text-center text-base font-bold text-gray-800">
            {MONTHS[currentMonth]} {currentYear}
          </span>
          <button onClick={goNext} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 transition">›</button>
          <button onClick={goToday} className="ml-1 rounded-lg border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition">Today</button>
        </div>
        <button
          onClick={() => setAddModalDate({ year: currentYear, month: currentMonth, day: today.getDate() })}
          className="rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 px-5 py-2 text-sm font-semibold text-white shadow hover:opacity-90 active:scale-95 transition-all"
        >
          + Add Session
        </button>
      </div>

      {/* ── Calendar card ── */}
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

            const key        = makeDateKey(currentYear, currentMonth, dayNum);
            const cellEvents = isCurrentMonth ? (events[key] ?? []) : [];
            const todayCell  = isCurrentMonth && isToday(dayNum);
            const isPast     = isCurrentMonth && new Date(currentYear, currentMonth, dayNum) < todayStart;

            return (
              <div
                key={i}
                onClick={() => {
                  if (!isCurrentMonth || isPast) return;
                  setAddModalDate({ year: currentYear, month: currentMonth, day: dayNum });
                }}
                className={[
                  "min-h-[100px] border-b border-r border-gray-100 p-2 transition-colors",
                  i % 7 === 6 ? "border-r-0" : "",
                  !isCurrentMonth ? "bg-gray-50/70" :
                  isPast          ? "cursor-not-allowed bg-gray-50/50" :
                                    "cursor-pointer hover:bg-orange-50/40",
                ].join(" ")}
              >
                <div className="mb-1.5 flex">
                  <span className={[
                    "flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold",
                    todayCell        ? "bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow" :
                    isPast           ? "text-gray-300" :
                    isCurrentMonth   ? "text-gray-700" : "text-gray-300",
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
                        e.stopPropagation(); // don't open add modal
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

      {/* ── Add Session Modal ── */}
      <AddEventModal
        date={addModalDate}
        onClose={() => setAddModalDate(null)}
        onSave={handleSaveEvent}
      />

      {/* ── Session Detail / Cancel Modal ── */}
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