import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { ICustomerQuery } from "@/domain/customer/ICustomerQuery";

const prisma = new PrismaClient();

function parseBoolean(value: string | null): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function buildWhereClause(query: ICustomerQuery): Prisma.CustomerWhereInput {
  const whereClause: Prisma.CustomerWhereInput = {};

  if (query.name) whereClause.name = { contains: query.name };
  if (query.prefectureCd) whereClause.prefectureCd = query.prefectureCd;
  if (query.address) whereClause.address = { contains: query.address };
  if (query.phoneNumber)
    whereClause.phoneNumber = { contains: query.phoneNumber };
  if (query.faxNumber) whereClause.faxNumber = { contains: query.faxNumber };
  if (query.isShippingStopped !== undefined)
    whereClause.isShippingStopped = query.isShippingStopped ?? undefined;

  return whereClause;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query: ICustomerQuery = {
      name: searchParams.get("name"),
      prefectureCd: searchParams.get("prefectureCd"),
      address: searchParams.get("address"),
      phoneNumber: searchParams.get("phoneNumber"),
      faxNumber: searchParams.get("faxNumber"),
      isShippingStopped: parseBoolean(searchParams.get("isShippingStopped")),
    };

    const whereClause = buildWhereClause(query);

    const customers = await prisma.customer.findMany({
      where: whereClause,
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
    const body: Prisma.CustomerCreateInput = await request.json();
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
    const body: Prisma.CustomerUncheckedUpdateInput[] = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid input: expected an array of customers" },
        { status: 400 }
      );
    }

    const updatePromises = body.map((customer) =>
      prisma.customer.update({
        where: { id: customer.id as number },
        data: customer,
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
