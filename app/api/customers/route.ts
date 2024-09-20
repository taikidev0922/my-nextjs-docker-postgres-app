import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { ICustomerQuery } from "@/domain/customer/ICustomerQuery";
import { BulkCustomerCommand } from "@/application/useCases/customer/BulkCustomerCommand";

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

export async function PUT(request: Request) {
  try {
    const body: BulkCustomerCommand[] = await request.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid input: expected an array of customer operations" },
        { status: 400 }
      );
    }

    const results = await prisma.$transaction(async (prisma) => {
      const operations = body.map(async (item) => {
        if (item.operation === "save") {
          if (item.id) {
            // 更新
            return prisma.customer.update({
              where: { id: item.id },
              data: {
                name: item.name,
                prefectureCd: item.prefectureCd,
                address: item.address,
                phoneNumber: item.phoneNumber,
                faxNumber: item.faxNumber,
                isShippingStopped: item.isShippingStopped,
              },
            });
          } else {
            // 新規登録
            return prisma.customer.create({
              data: {
                name: item.name!,
                prefectureCd: item.prefectureCd!,
                address: item.address,
                phoneNumber: item.phoneNumber,
                faxNumber: item.faxNumber,
                isShippingStopped: item.isShippingStopped,
              },
            });
          }
        } else if (item.operation === "delete" && item.id) {
          // 削除
          return prisma.customer.delete({
            where: { id: item.id },
          });
        }
      });

      return Promise.all(operations);
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error processing customer operations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
