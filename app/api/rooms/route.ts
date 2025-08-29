import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// POST /api/rooms -> create a private room
export async function POST(req: Request) {
  try {
    const { name, slug } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "name required" }, { status: 400 });
    }

    const slugVal =
      slug ||
      `${name.toLowerCase().replace(/\s+/g, "-")}-${Math.random()
        .toString(36)
        .slice(2, 6)}`;

    const room = await prisma.room.create({
      data: { name, slug: slugVal, type: "private" },
    });

    return NextResponse.json(room, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
}

// GET /api/rooms -> list all public rooms
export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      where: { type: "public" },
      select: {
        id: true,
        name: true,
        slug: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(rooms);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
  }
}
