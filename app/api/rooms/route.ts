import prisma from "../../../lib/prisma";

// POST /api/rooms (create a private room)
export async function POST(req: Request) {
  const { name, slug } = await req.json();

  if (!name) {
    return new Response(JSON.stringify({ error: "name required" }), { status: 400 });
  }

  const slugVal =
    slug ||
    name.toLowerCase().replace(/\s+/g, "-") + "-" + Math.random().toString(36).slice(2, 6);

  const room = await prisma.room.create({
    data: { name, slug: slugVal, type: "private" },
  });

  return new Response(JSON.stringify(room), { status: 201 });
}

// GET /api/rooms (list all public rooms)
export async function GET(req: Request) {
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
    });

    return new Response(JSON.stringify(rooms));
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch rooms" }), { status: 500 });
  }
}
