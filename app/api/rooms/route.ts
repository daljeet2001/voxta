import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// POST /api/rooms (create a room)
export async function POST(req: Request) {
  const { name, slug } = await req.json();

  if (!name) {
    return NextResponse.json({ error: "name required" }, { status: 400 });
  }

  const slugVal =
    slug ||
    name.toLowerCase().replace(/\s+/g, "-") +
      "-" +
      Math.random().toString(36).slice(2, 6);

  const room = await prisma.room.create({
    data: { name, slug: slugVal,type: "private",},
  });

  return NextResponse.json(room, { status: 201 });
}

// // GET /api/rooms (list rooms)
// export async function GET() {
//   const rooms = await prisma.room.findMany({
//     orderBy: { createdAt: "desc" },
//     take: 50,
//   });

//   return NextResponse.json(rooms);
// }


// GET -> list all public rooms
export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      where: { type: "public" },   // assuming you have an `isPublic` column
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(rooms);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
  }
}
