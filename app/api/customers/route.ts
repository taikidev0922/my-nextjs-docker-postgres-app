import { NextResponse } from "next/server";
import { PrismaClient, Prisma, Customer } from "@prisma/client";
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

    const results = await Promise.all(
      body.map(async (item) => {
        try {
          let result: Customer | null = null;

          if (item.operation === "save") {
            const data = {
              name: item.name,
              prefectureCd: item.prefectureCd,
              address: item.address,
              phoneNumber: item.phoneNumber,
              faxNumber: item.faxNumber,
              isShippingStopped: item.isShippingStopped,
            };

            if (item.id) {
              // Update
              result = await prisma.customer.update({
                where: { id: item.id },
                data: data,
              });
            } else {
              // Create new
              result = await prisma.customer.create({
                data: data as Prisma.CustomerCreateInput,
              });
            }
          } else if (item.operation === "delete" && item.id) {
            // Delete
            result = await prisma.customer.delete({
              where: { id: item.id },
            });
          }

          if (!result) {
            throw new Error(
              `Invalid operation or missing data for item: ${JSON.stringify(
                item
              )}`
            );
          }

          // Add cookie to the result
          return { ...result, cookie: item.cookie, results: [] };
        } catch (error) {
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
              // Unique constraint violation
              return {
                ...item,
                results: [
                  { message: "得意先名が重複しています", status: "error" },
                ],
              };
            }
          }
          // For other errors, return a generic error message
          return {
            ...item,
            results: [
              {
                message: "An error occurred while processing this item",
                status: "error",
              },
            ],
          };
        }
      })
    );

    // Check if any operation resulted in an error
    const hasErrors = results.some(
      (result) => result.results && result.results.length > 0
    );

    if (hasErrors) {
      return NextResponse.json(results, { status: 422 });
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error processing customer operations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
