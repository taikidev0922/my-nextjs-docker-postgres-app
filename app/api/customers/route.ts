import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ICustomerQuery } from "@/domain/customer/ICustomerQuery";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const prefectureCd = searchParams.get("prefectureCd");
    const isShippingStopped = searchParams.get("isShippingStopped");

    const whereClause: ICustomerQuery = {};

    if (prefectureCd) {
      whereClause.prefectureCd = prefectureCd;
    }

    if (isShippingStopped !== null) {
      whereClause.isShippingStopped = isShippingStopped === "true";
    }

    const customers = await prisma.customer.findMany({
      where: {
        isShippingStopped: whereClause.isShippingStopped ?? undefined,
        prefectureCd: whereClause.prefectureCd ?? undefined,
      },
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const customer = await prisma.customer.create({
      data: body,
    });
    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid input: expected an array of customers" },
        { status: 400 }
      );
    }

    const updatePromises = body.map((customer) =>
      prisma.customer.update({
        where: { id: customer.id },
        data: {
          name: customer.name,
          prefectureCd: customer.prefectureCd,
          address: customer.address,
          phoneNumber: customer.phoneNumber,
          faxNumber: customer.faxNumber,
          isShippingStopped: customer.isShippingStopped,
        },
      })
    );

    const updatedCustomers = await prisma.$transaction(updatePromises);

    return NextResponse.json(updatedCustomers);
  } catch (error) {
    console.error("Error updating customers:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
