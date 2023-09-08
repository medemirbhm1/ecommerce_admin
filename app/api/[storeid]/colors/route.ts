import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { storeid: string } }
) {
  try {
    if (!params.storeid) {
      return new NextResponse("Storeid is required", { status: 400 });
    }
    const colors = await prismadb.color.findMany({
      where: {
        storeId: params.storeid,
      },
    });
    return NextResponse.json(colors);
  } catch (err) {
    console.log("COLORS GET ERROR: ", err);
    return new NextResponse("internal error", { status: 500 });
  }
}
export async function POST(
  req: Request,
  { params }: { params: { storeid: string } }
) {
  try {
    const { userId } = auth();
    const { name, value } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }
    if (!params.storeid) {
      return new NextResponse("Storeid is required", { status: 400 });
    }
    const store = await prismadb.store.findFirst({
      where: {
        id: params.storeid,
        userId,
      },
    });
    if (!store) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId: params.storeid,
      },
    });
    return NextResponse.json(color);
  } catch (err) {
    console.log("COLOR POST ERROR: ", err);
    return new NextResponse("internal error", { status: 500 });
  }
}
