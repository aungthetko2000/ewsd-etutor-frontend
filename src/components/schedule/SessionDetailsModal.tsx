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

  if (!event) return null;

  const c = COLOR_CLASSES[event.color ?? "indigo"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

      {/* Modal */}
      <div className="
        w-full 
        max-w-md 
        max-h-[85vh]
        bg-white 
        rounded-2xl 
        shadow-2xl 
        flex flex-col 
        overflow-hidden
      ">

        {/* Header */}
        <div className={`${c.light} px-5 py-4 border-b border-gray-100`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${c.dot}`} />
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-800">
                  {event.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  {dateLabel}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

          <div className="flex justify-between">
            <div>
              <p className="text-xs text-gray-400">Time</p>
              <p className="text-sm font-semibold text-gray-700">
                {formatTime(event.time)}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-400">Duration</p>
              <p className="text-sm font-semibold text-gray-700">
                {event.duration || "—"}
              </p>
            </div>
          </div>

          {event.notes && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Notes</p>
              <div className="text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3 leading-relaxed">
                {event.notes}
              </div>
            </div>
          )}

          {isPast && (
            <div className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-500">
              🔒 This session has already passed
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 pt-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 text-white py-3 text-sm font-semibold hover:bg-gray-800 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default SessionDetailModal;