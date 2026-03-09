import { useAuth } from "../auth/AuthContext";
import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES — replace with API types when backend is ready
// ─────────────────────────────────────────────────────────────────────────────
export interface Contact {
  id: number;
  name: string;
  role: "student" | "staff";
  avatar: string;
  status: "online" | "away" | "offline";
  unread: number;
  lastMessage: string;
  lastTime: string;
  isTyping?: boolean;
}

export interface Message {
  id: number;
  from: "me" | "them";
  text: string;
  time: string;
  read?: boolean;
}

export type MessageMap = Record<number, Message[]>;

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — swap for API calls when backend is ready
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_CONTACTS: Contact[] = [
  { id: 1, name: "Sarah Chen",     role: "student", avatar: "https://i.pravatar.cc/150?img=1",  status: "online",  unread: 2, lastMessage: "Can we reschedule tomorrow?",  lastTime: "2m", isTyping: true },
  { id: 2, name: "Ms. Rivera",     role: "staff",   avatar: "https://i.pravatar.cc/150?img=47", status: "away",    unread: 0, lastMessage: "i see, okay noted! i'll follow up.", lastTime: "10m" },
  { id: 3, name: "James Okafor",   role: "student", avatar: "https://i.pravatar.cc/150?img=12", status: "online",  unread: 0, lastMessage: "ok, thanks!",                  lastTime: "1h"},
];

const MOCK_MESSAGES: MessageMap = {
  1: [
    { id: 1, from: "them", text: "Hi! I just wanted to check in about tomorrow's session.", time: "10:00 AM" },
    { id: 2, from: "me",   text: "Hey Sarah! Sure, what's up?",                             time: "10:02 AM" },
    { id: 3, from: "them", text: "Can we reschedule tomorrow?",                             time: "10:04 AM" },
  ],
  2: [
    { id: 1, from: "them", text: "Please review the report when you get a chance.",         time: "8:30 AM" },
    { id: 2, from: "me",   text: "Sure, I'll take a look today.",                           time: "8:45 AM" },
    { id: 3, from: "them", text: "i see, okay noted! i'll follow up later.",                time: "9:00 AM" },
  ],
  3: [
    { id: 1, from: "me",   text: "Hey James, how's the assignment going?",                  time: "Yesterday" },
    { id: 2, from: "them", text: "Thanks for the notes! Almost done.",                      time: "Yesterday" },
    { id: 3, from: "them", text: "ok, thanks!",                                             time: "1h ago" },
  ],
};

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const STATUS_DOT: Record<Contact["status"], string> = {
  online: "bg-emerald-400", away: "bg-amber-400", offline: "bg-gray-300",
};
const STATUS_TEXT: Record<Contact["status"], string> = {
  online: "Active now", away: "Away", offline: "Offline",
};

// ─────────────────────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────────────────────
const Icon = {
  Message: ({ cls = "w-6 h-6" }) => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Send: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Close: ({ cls = "w-5 h-5" }) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  Back: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 19l-7-7 7-7" />
    </svg>
  ),
  Edit: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Dots: () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
  ),

  Emoji: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  ),
  Attach: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
    </svg>
  ),

  Search: () => (
    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT ROW (reusable in both panel & sidebar)
// ─────────────────────────────────────────────────────────────────────────────
function ContactRow({
  contact, selected = false, onClick,
}: { contact: Contact; selected?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 transition text-left border-l-[3px] ${
        selected
          ? "bg-gray-100 border-orange-500"
          : "border-transparent hover:bg-gray-50"
      }`}
    >
      <div className="relative shrink-0">
        <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full object-cover" />
        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${STATUS_DOT[contact.status]}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <p className={`text-sm truncate ${contact.unread ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>
            {contact.name}
          </p>
          <span className="text-[10px] text-gray-400 shrink-0">{contact.lastTime}</span>
        </div>
        <p className={`text-xs truncate mt-0.5 ${
          contact.isTyping ? "text-emerald-500 italic font-medium" :
          contact.unread   ? "font-semibold text-gray-600" : "text-gray-400"
        }`}>
          {contact.isTyping ? "typing..." : contact.lastMessage}
        </p>
      </div>
      {contact.unread > 0 && (
        <span
          className="shrink-0 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold text-white ml-1"
          style={{ background: "linear-gradient(135deg,#f97316,#e11d48)" }}
        >
          {contact.unread}
        </span>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE-UP CONTACT LIST PANEL (appears above FAB)
// ─────────────────────────────────────────────────────────────────────────────
function ContactListPanel({
  contacts, onSelectContact, onClose, search, onSearch,
}: {
  contacts: Contact[];
  onSelectContact: (c: Contact) => void;
  onClose: () => void;
  search: string;
  onSearch: (v: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 10); return () => clearTimeout(t); }, []);

  const filtered = contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));


  return (
    <>
      <div className="fixed inset-0 z-[9997]" onClick={onClose} />
      <div
        className="fixed right-6 z-[9998] w-72 sm:w-80 rounded-2xl bg-white shadow-2xl border border-gray-200/80 flex flex-col overflow-hidden"
        style={{
          bottom: "80px",
          maxHeight: "460px",
          transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.96)",
          opacity: visible ? 1 : 0,
          transformOrigin: "bottom right",
          transition: "transform 0.25s cubic-bezier(0.16,1,0.3,1), opacity 0.2s ease",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#f97316,#e11d48)" }}>
              <Icon.Message cls="w-3.5 h-3.5 text-white" />
            </div>
            <h3 className="font-bold text-gray-800 text-sm">Messages</h3>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition">
            <Icon.Close cls="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-2.5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
            <Icon.Search />
            <input
              className="bg-transparent text-sm text-gray-700 outline-none flex-1 placeholder:text-gray-400"
              placeholder="Search people..."
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-1">
          {filtered.map(c => (
            <ContactRow key={c.id} contact={c} onClick={() => onSelectContact(c)} />
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-8">No contacts found</p>
          )}
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FULL-PAGE TWO-PANEL MESSENGER
// ─────────────────────────────────────────────────────────────────────────────
function FullPageMessenger({
  contacts, messages, onSend, onClose, onClearUnread, selectedId, setSelectedId,
}: {
  contacts: Contact[];
  messages: MessageMap;
  onSend: (contactId: number, text: string) => void;
  onClose: () => void;
  onClearUnread: (id: number) => void;
  selectedId: number | null;
  setSelectedId: (id: number | null) => void;
}) {
  const [search, setSearch]         = useState("");
  const [input, setInput]           = useState("");
  const [showDetail, setShowDetail] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const filtered        = contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const selectedContact = contacts.find(c => c.id === selectedId) ?? null;
  const currentMessages = selectedId ? (messages[selectedId] ?? []) : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, selectedId]);

  const handleSelect = (c: Contact) => {
    setSelectedId(c.id);
    onClearUnread(c.id);
    setShowDetail(true);
    setInput("");
  };

  const handleSend = () => {
    if (!input.trim() || !selectedId) return;
    onSend(selectedId, input.trim());
    setInput("");
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex overflow-hidden bg-white"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      {/* ── LEFT SIDEBAR ──────────────────────────────────────────────────────── */}
      <aside className={`flex flex-col bg-white border-r border-gray-200 shrink-0 w-full md:w-64 lg:w-72 ${showDetail ? "hidden md:flex" : "flex"}`}>

        {/* Sidebar header */}
        <div className="flex items-center justify-between px-5 py-4 shrink-0">
          <h2 className="text-xl font-bold text-gray-900">Messages</h2>
          <div className="flex items-center gap-0.5">
            <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition">
              <Icon.Edit />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition">
              <Icon.Dots />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pb-3 shrink-0">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2.5">
            <Icon.Search />
            <input
              className="bg-transparent text-sm text-gray-700 outline-none flex-1 placeholder:text-gray-400"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Contact list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map(c => (
            <ContactRow key={c.id} contact={c} selected={selectedId === c.id} onClick={() => handleSelect(c)} />
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-10">No results</p>
          )}
        </div>
      </aside>

      {/* ── RIGHT CHAT AREA ───────────────────────────────────────────────────── */}
      <main className={`flex-1 flex flex-col overflow-hidden bg-gray-50 ${showDetail ? "flex" : "hidden md:flex"}`}>
        {selectedContact ? (
          <>
            {/* Chat header */}
            <header className="flex items-center gap-3 px-5 py-3.5 bg-white border-b border-gray-200 shrink-0">
              {/* Mobile back */}
              <button
                onClick={() => setShowDetail(false)}
                className="md:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-500 shrink-0"
              >
                <Icon.Back />
              </button>

              {/* Avatar */}
              <div className="relative shrink-0">
                <img src={selectedContact.avatar} alt={selectedContact.name} className="w-10 h-10 rounded-full object-cover" />
                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${STATUS_DOT[selectedContact.status]}`} />
              </div>

              {/* Name & status */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm leading-tight">{selectedContact.name}</p>
                <p className={`text-xs mt-0.5 font-medium ${selectedContact.isTyping ? "text-emerald-500 italic" : "text-gray-400"}`}>
                  {selectedContact.isTyping ? "typing..." : STATUS_TEXT[selectedContact.status]}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-0.5 shrink-0">
                <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-500">
                  <Icon.Dots />
                </button>
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">

              {/* Date divider */}
              <div className="flex justify-center mb-2">
                <span className="text-xs text-gray-400 bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm">
                  Today, {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                </span>
              </div>

              {currentMessages.map((msg) => {
                const isMe = msg.from === "me";
                return (
                  <div key={msg.id} className={`flex items-end gap-2.5 ${isMe ? "justify-end" : "justify-start"}`}>
                    {/* Their avatar */}
                    {!isMe && (
                      <img src={selectedContact.avatar} alt={selectedContact.name} className="w-7 h-7 rounded-full object-cover shrink-0 mb-1" />
                    )}

                    <div className={`max-w-[60%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                      <div
                        className={`px-4 py-2.5 text-sm leading-relaxed ${
                          isMe
                            ? "text-white rounded-2xl rounded-br-sm shadow-sm"
                            : "bg-white text-gray-800 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100"
                        }`}
                        style={isMe ? { background: "linear-gradient(135deg,#6366f1,#4f46e5)" } : {}}
                      >
                        {msg.text}
                      </div>
                      <p className={`text-[10px] text-gray-400 mt-1 ${isMe ? "mr-1" : "ml-1"}`}>{msg.time}</p>
                    </div>

                    {/* My avatar */}
                    {isMe && (
                      <img src="https://i.pravatar.cc/150?img=33" alt="You" className="w-7 h-7 rounded-full object-cover shrink-0 mb-1" />
                    )}
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div className="shrink-0 px-5 py-3.5 bg-white border-t border-gray-200 flex items-center gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-400 shrink-0">
                <Icon.Attach />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-400 shrink-0">
                <Icon.Emoji />
              </button>
              <div className="flex-1 flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 focus-within:border-orange-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100 transition">
                <input
                  className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white disabled:opacity-40 transition hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg,#f97316,#e11d48)" }}
              >
                <Icon.Send />
              </button>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-sm"
              style={{ background: "linear-gradient(135deg,#f97316,#e11d48)" }}>
              <Icon.Message cls="w-8 h-8 text-white" />
            </div>
            <p className="text-base font-semibold text-gray-700">Select a conversation</p>
            <p className="text-sm text-gray-400 mt-1.5 max-w-xs">Choose a contact from the left to start chatting.</p>
          </div>
        )}
      </main>

      {/* Close full-page */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition"
      >
        <Icon.Close />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT WIDGET — drop this once in your app layout
// ─────────────────────────────────────────────────────────────────────────────
export default function MessengerWidget() {
  const { roles, isAuthenticated } = useAuth();
  const { pathname } = useLocation();


  const [panelOpen,      setPanelOpen]      = useState(false);
  const [messengerOpen,  setMessengerOpen]  = useState(false);
  const [selectedId,     setSelectedId]     = useState<number | null>(null);
  const [contacts,       setContacts]       = useState<Contact[]>(MOCK_CONTACTS);
  const [messages,       setMessages]       = useState<MessageMap>(MOCK_MESSAGES);
  const [search,         setSearch]         = useState("");

  const totalUnread = contacts.reduce((sum, c) => sum + c.unread, 0);
  // Only tutor and student can use messaging
  const canMessage = isAuthenticated && pathname !== "/" && roles.some(r => ["tutor", "student"].includes(r.toLowerCase()));
  if (!canMessage) return null;


  // TODO: replace with API call — POST /messages
  const handleSend = (contactId: number, text: string) => {
    const msg: Message = { id: Date.now(), from: "me", text, time: nowTime(), read: false };
    setMessages(prev => ({ ...prev, [contactId]: [...(prev[contactId] ?? []), msg] }));
    setContacts(prev => prev.map(c =>
      c.id === contactId ? { ...c, lastMessage: text, lastTime: "now" } : c
    ));
  };

  // TODO: replace with API call — PATCH /messages/:contactId/read
  const handleClearUnread = (id: number) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  const handleSelectContact = (c: Contact) => {
    handleClearUnread(c.id);
    setSelectedId(c.id);
    setPanelOpen(false);
    setMessengerOpen(true);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .msg-root * { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="msg-root">
        {/* ── FAB ─────────────────────────────────────────────────────────────── */}
        {!messengerOpen && (
          <button
            onClick={() => setPanelOpen(v => !v)}
            aria-label="Toggle messages"
            className="fixed bottom-6 right-6 z-[9998] w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg,#f97316,#e11d48)" }}
          >
            {panelOpen
              ? <Icon.Close cls="w-6 h-6 text-white" />
              : <Icon.Message cls="w-6 h-6 text-white" />
            }
            {!panelOpen && totalUnread > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[20px] h-5 rounded-full bg-white text-[11px] font-bold flex items-center justify-center px-1"
                style={{ color: "#e11d48" }}
              >
                {totalUnread}
              </span>
            )}
          </button>
        )}

        {/* ── Slide-up contact panel ───────────────────────────────────────────── */}
        {panelOpen && !messengerOpen && (
          <ContactListPanel
            contacts={contacts}
            onSelectContact={handleSelectContact}
            onClose={() => setPanelOpen(false)}
            search={search}
            onSearch={setSearch}
          />
        )}

        {/* ── Full-page two-panel messenger ────────────────────────────────────── */}
        {messengerOpen && (
          <FullPageMessenger
            contacts={contacts}
            messages={messages}
            onSend={handleSend}
            onClose={() => { setMessengerOpen(false); }}
            onClearUnread={handleClearUnread}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        )}
      </div>
    </>
  );
}