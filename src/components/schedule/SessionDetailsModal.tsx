import { useState } from "react";
import { COLOR_CLASSES, formatTime } from "../store/meeting/function";

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  duration: string;
  notes: string;
  color?: "indigo" | "violet" | "sky" | "emerald" | "rose";
}

interface DetailModalProps {
  event: CalendarEvent | null;
  dateLabel: string;
  isPast: boolean;
  onClose: () => void;
}

const SessionDetailModal = ({ event, dateLabel, isPast, onClose }: DetailModalProps) => {
  const [confirming, setConfirming] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState(false);

  if (!event) return null;
  const c = COLOR_CLASSES[event.color ?? "indigo"];

  const handleConfirmCancel = () => {
    if (!reason.trim()) { setReasonError(true); return; }
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
                  className={`w-full resize-none rounded-xl border px-3 py-2.5 text-sm text-gray-700 bg-white outline-none placeholder:text-gray-400 transition ${reasonError ? "border-rose-400 ring-2 ring-rose-200" : "border-rose-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
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

export default SessionDetailModal;