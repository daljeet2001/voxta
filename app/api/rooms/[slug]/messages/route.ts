import prisma from "../../../../../lib/prisma";

// GET /api/rooms/[slug]/messages
export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  const room = await prisma.room.findUnique({ where: { slug } });
  if (!room) {
    return new Response(JSON.stringify({ error: "room not found" }), { status: 404 });
  }

  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get("limit") || "50");
  const cursor = url.searchParams.get("cursor") || undefined;

  const messages = await prisma.message.findMany({
    where: { roomId: room.id },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
  });

  return new Response(JSON.stringify(messages.reverse()));
}
