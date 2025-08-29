"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Room {
  id: string;
  name: string;
  slug: string;
}

export default function Home() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const router = useRouter();

  // fetch rooms on load
  useEffect(() => {
    fetch("/api/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data));
  }, []);

  async function createRoom(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return alert("room name required");

    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    });

    const room = await res.json();
    router.push(`/room/${room.slug}`);
  }

  function joinRoom(e: React.FormEvent) {
    e.preventDefault();
    if (!slug) return alert("enter slug");
    router.push(`/room/${slug}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-xl w-full bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Voxta</h1>

        {/* Create Room */}
        <form onSubmit={createRoom} className="mb-4">
       <h2 className="text-lg font-semibold mb-2">Create or Join Private Rooms</h2>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Room name"
            className="w-full border p-2 mb-2 rounded"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Create Room
          </button>
        </form>

        {/* Join Room */}
        <form onSubmit={joinRoom} className="mb-6">
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Room slug"
            className="w-full border p-2 mb-2 rounded"
          />
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Join Room
          </button>
        </form>

        {/* Public Rooms */}
        <h2 className="text-lg font-semibold mb-2">Public Rooms</h2>
        <ul className="space-y-2">
          {rooms.map((room) => (
            <li
              key={room.id}
              className="p-3 border rounded hover:bg-slate-100 cursor-pointer"
              onClick={() => router.push(`/room/${room.slug}`)}
            >
              {room.name} <span className="text-gray-500">({room.slug})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
