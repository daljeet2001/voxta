import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

export async function GET(
  req: Request,
  context: { params: { slug: string } }
) {
  const { slug } = context.params; 

  const room = await prisma.room.findUnique({ where: { slug } });
  if (!room) {
    return NextResponse.json({ error: "room not found" }, { status: 404 });
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

  return NextResponse.json(messages.reverse());
}
