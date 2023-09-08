import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { storeid: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");
    if (!params.storeid) {
      return new NextResponse("Storeid is required", { status: 400 });
    }
    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeid,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(products);
  } catch (err) {
    console.log("PRODUCTS GET ERROR: ", err);
    return new NextResponse("internal error", { status: 500 });
  }
}
export async function POST(
  req: Request,
  { params }: { params: { storeid: string } }
) {
  try {
    const { userId } = auth();
    const {
      name,
      images,
      price,
      colorId,
      categoryId,
      sizeId,
      isFeatured,
      isArchived,
    } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!images?.length) {
      return new NextResponse("Images are required", { status: 400 });
    }
    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }
    if (!colorId) {
      return new NextResponse("Color is required", { status: 400 });
    }
    if (!categoryId) {
      return new NextResponse("Category is required", { status: 400 });
    }
    if (!sizeId) {
      return new NextResponse("Size is required", { status: 400 });
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
    const product = await prismadb.product.create({
      data: {
        name,
        images: {
          createMany: {
            data: images.map((image: { url: string }) => image),
          },
        },
        price,
        colorId,
        categoryId,
        sizeId,
        isFeatured: isFeatured || false,
        isArchived: isArchived || false,
        storeId: params.storeid,
      },
    });
    return NextResponse.json({ product });
  } catch (err) {
    console.log("PRODUCT POST ERROR: ", err);
    return new NextResponse("internal error", { status: 500 });
  }
}
