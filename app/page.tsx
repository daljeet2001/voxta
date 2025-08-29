"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const router = useRouter();

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

        <form onSubmit={createRoom} className="mb-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Room name"
            className="w-full border p-2 mb-2 rounded"
          />
          {/* <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Room slug"
            className="w-full border p-2 mb-2 rounded"
          /> */}
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Create Room
          </button>
        </form>

        <form onSubmit={joinRoom}>
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
      </div>
    </div>
  );
}
