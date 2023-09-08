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
    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeid,
      },
    });
    return NextResponse.json(categories);
  } catch (err) {
    console.log("CATEGORIES GET ERROR: ", err);
    return new NextResponse("internal error", { status: 500 });
  }
}
export async function POST(
  req: Request,
  { params }: { params: { storeid: string } }
) {
  try {
    const { userId } = auth();
    const { name, billboardId } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!billboardId) {
      return new NextResponse("Billboard is required", { status: 400 });
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
    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeid,
      },
    });
    return NextResponse.json( category );
  } catch (err) {
    console.log("CATEGORY POST ERROR: ", err);
    return new NextResponse("internal error", { status: 500 });
  }
}
