import { prisma } from "../../../../../lib/prisma"; 

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> } // 👈 params is now a Promise
) {
  const { slug } = await context.params; // 👈 must await

  const room = await prisma.room.findUnique({
    where: { slug },
  });

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const messages = await prisma.message.findMany({
    where: { roomId: room.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(messages);
}
