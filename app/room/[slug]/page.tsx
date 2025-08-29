"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

interface ChatMessage {
  id: string;
  username?: string | null;
  content: string;
  createdAt?: string;
}

export default function RoomPage() {
  const { slug } = useParams() as { slug: string };
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [finalUsername, setFinalUsername] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const [count, setCount] = useState(0);
  const [systemMessages, setSystemMessages] = useState<{ id: string; text: string }[]>([]);







useEffect(() => {
  if (!slug) return;

  // Fetch initial messages
  (async () => {
    try {
      const res = await fetch(`/api/rooms/${slug}/messages`);
      if (res.ok) setMessages(await res.json());
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  })();

  // Determine WS protocol
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  const ws = new WebSocket(
    `${protocol}://${window.location.hostname}:${process.env.NEXT_PUBLIC_WS_PORT}`
  );
  wsRef.current = ws;

  // Queue messages until WS is open
  const messageQueue: string[] = [];

  ws.onopen = () => {
    // Send join room event
    ws.send(
      JSON.stringify({
        type: "join_room",
        room: slug,
        username: finalUsername || `anon_${Math.random().toString(36).slice(2, 6)}`,
      })
    );

    // Flush any queued messages
    messageQueue.forEach((msg) => ws.send(msg));
    messageQueue.length = 0;
  };

  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.type === "message") {
      setMessages((prev) => [
        ...prev,
        {
          id: msg.id,
          username: msg.user?.username,
          content: msg.content,
          createdAt: msg.createdAt,
        },
      ]);
    }
    if (msg.type === "system") {
       const id = `sys-${Date.now()}`;
       setSystemMessages((prev) => [...prev, { id, text: msg.text }]);

      // Auto remove after 3s
      setTimeout(() => {
      setSystemMessages((prev) => prev.filter((m) => m.id !== id));
    }, 3000);
    }

    if (msg.type === "room_count") {
      console.log("Room count:", msg.count);
      setCount(msg.count);
    }
  };

ws.onerror = () => {
  console.warn("⚠️ WebSocket encountered a transient error (usually safe to ignore).");
};


  return () => {
    try {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "leave_room", room: slug }));
      }
    } catch (err) {
      console.warn("WS send failed:", err);
    }
    ws.close();
  };
}, [slug, finalUsername]);

function sendMessage(e: React.FormEvent) {
  e.preventDefault();
  if (!input.trim()) return;

  const msg = JSON.stringify({ type: "message", room: slug, content: input.trim() });

  // Send immediately if WS is open, else queue it
  if (wsRef.current?.readyState === WebSocket.OPEN) {
    wsRef.current.send(msg);
  } else {
    console.warn("WS not open, message queued");
    // Optional: implement queue logic if needed
  }

  setInput("");
}


  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-4 rounded shadow">
        <div className="flex justify-between  mb-3">
          <h2 className="text-xl font-semibold">Room: {slug}</h2>
          <div>
          <input
            className="border p-1 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
          />
          <button
      className="ml-2 bg-blue-600 text-white px-3 py-1 rounded"
      onClick={() => setFinalUsername(username)}
    >
      Join
    </button>
    </div>
    </div>
        <div>Number of people in room:{count}</div>

        <div className="chat-window border rounded p-3 mb-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={
                m.username === "system" ? "text-gray-500 text-sm" : ""
              }
            >
              {m.username && m.username !== "system" && (
                <strong>{m.username}: </strong>
              )}
              {m.content}
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border p-2 rounded"
            placeholder="Type message..."
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Send
          </button>
        </form>

      <div className="chat-window  p-3 mt-10 mb-3">
         {systemMessages.map((m) => (
      <div
      key={m.id}
      className="bg-gray-800 text-white px-4 py-2 rounded shadow-md animate-fade"
      >
      {m.text}
      </div>
  ))}
</div>




      </div>
    </div>
  );
}
