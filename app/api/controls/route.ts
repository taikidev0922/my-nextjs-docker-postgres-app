import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const controls = await prisma.control.findMany({
      include: {
        controlDetails: true,
      },
    });

    return NextResponse.json(controls);
  } catch (error) {
    console.error("Error fetching controls:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
