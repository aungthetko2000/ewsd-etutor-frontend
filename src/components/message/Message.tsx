import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

type ChatMessage = {
  senderEmail: string;
  receiverEmail: string;
  content: string;
  timestamp?: string;
};

const SELECTED_RECEIVER_ID = 3;

const sessionUser = JSON.parse(sessionStorage.getItem("user") || "{}");
const currentUserEmail = sessionUser.email;

export default function Message() {
  const [message, setMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const stompClient = useRef<Client | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    const socket = new SockJS("http://localhost:8080/ws-stomp");
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => {
        console.log("Connected to WebSocket");

        client.subscribe(`/user/queue/messages`, (payload) => {
          const receivedMsg: ChatMessage = JSON.parse(payload.body);
          setMessages((prev) => [...prev, receivedMsg]);
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      if (stompClient.current) stompClient.current.deactivate();
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim() && stompClient.current?.connected) {
      // The keys MUST match your ChatMessageRequest Java class fields
      const payload = {
        senderEmail: "mgmg@example.com",
        receiverEmail: "aungaung@example.com", // This should come from your 'Selected User' state
        content: message,
      };

      stompClient.current.publish({
        destination: "/app/chat.send",
        body: JSON.stringify(payload),
      });

      setMessage("");
    }
  };

  return (
    <div className="flex h-screen w-screen bg-white overflow-hidden font-sans">
      {/* ── LEFT SIDEBAR: Chat List ──────────────────────────────────────── */}
      <aside
        className={`${isSidebarOpen ? "flex" : "hidden"} md:flex flex-col w-full md:w-80 lg:w-96 border-r border-gray-100 bg-white shrink-0`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-rose-600">
            Messages
          </h2>
          <div className="flex gap-2">
            <button className="p-2 bg-gray-50 rounded-xl hover:bg-orange-50 text-gray-500 hover:text-orange-600 transition-all">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-100 outline-none transition-all"
            />
            <svg
              className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all ${i === 1 ? "bg-orange-50/50" : "hover:bg-gray-50"}`}
            >
              <img
                src={`https://i.pravatar.cc/150?u=${i}`}
                className="w-12 h-12 rounded-2xl object-cover shadow-sm"
                alt=""
              />
              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-900">
                    User {i}
                  </span>
                  <span className="text-[10px] text-gray-400">12:45 PM</span>
                </div>
                <p className="text-xs text-gray-500 truncate">
                  Looking forward to the Java update!
                </p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* ── RIGHT SIDE: Active Chat Area ──────────────────────────────────── */}
      <main className="flex-1 flex flex-col bg-gray-50/30 relative">
        <header className="h-20 px-6 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-base font-bold text-gray-900">
              Chatting with User {SELECTED_RECEIVER_ID}
            </h3>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar flex flex-col">
          {messages.map((m, i) => {
            // Check if the message's sender email matches the logged-in user's email
            const isMe = m.senderEmail === currentUserEmail;
            const currentEmail = currentUserEmail?.trim().toLowerCase();
            const senderEmail = m.senderEmail?.trim().toLowerCase();

            const isMatch = currentEmail === senderEmail;

            console.log(`Checking: "${currentEmail}" === "${senderEmail}"`, isMatch);
            return (
              <div
                key={i}
                className={`flex w-full ${isMe ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`flex items-end gap-3 max-w-[75%] ${isMe ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Message Bubble */}
                  <div
                    className={`relative p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                      isMe
                        ? "bg-gradient-to-tr from-orange-500 to-rose-600 text-white rounded-br-none"
                        : "bg-white text-gray-700 rounded-bl-none border border-gray-100"
                    }`}
                  >
                    <p>{m.content}</p>

                    {/* Simple Timestamp */}
                    <span
                      className={`text-[10px] mt-1 block opacity-60 ${isMe ? "text-right" : "text-left"}`}
                    >
                      {new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <footer className="p-6 bg-transparent">
          <div className="max-w-5xl mx-auto relative group">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message here..."
              className="w-full pl-6 pr-16 py-4 bg-white border border-gray-100 rounded-[2rem] shadow-xl outline-none text-sm text-gray-700"
            />

            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className={`absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 ${
                message.trim()
                  ? "bg-orange-500 text-white scale-100"
                  : "bg-gray-50 text-gray-300 scale-90"
              }`}
            >
              <svg
                className="w-5 h-5 rotate-45"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
