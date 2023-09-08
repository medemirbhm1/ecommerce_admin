import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      storeid: string;
      productid: string;
    };
  }
) {
  try {
    if (!params.storeid) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!params.productid) {
      return new NextResponse("Product id is required", { status: 400 });
    }
    const product = await prismadb.product.findUnique({
      where: {
        id: params.productid,
      },
      include: {
        images: true,
        size: true,
        color: true,
        category: true,
      },
    });
    return NextResponse.json(product);
  } catch (err) {
    console.log("PRODUCT GET ERROR: ", err);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: {
      storeid: string;
      productid: string;
    };
  }
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
    await prismadb.product.update({
      where: {
        id: params.productid,
      },
      data: {
        name,
        images: {
          deleteMany: {},
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
    const product = await prismadb.product.update({
      where: {
        id: params.productid,
      },
      data: {
        images: {
          createMany: {
            data: images.map((image: { url: string }) => image),
          },
        },
      },
    });
    return NextResponse.json(product);
  } catch (err) {
    console.log("PRODUCT PATCH ERROR: ", err);
    return new NextResponse("internal error", { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: {
      storeid: string;
      productid: string;
    };
  }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!params.storeid) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!params.productid) {
      return new NextResponse("Product id is required", { status: 400 });
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
    const product = await prismadb.product.delete({
      where: {
        id: params.productid,
      },
    });
    return NextResponse.json(product);
  } catch (err) {
    console.log("PRODUCT DELETE ERROR: ", err);
    return new NextResponse("internal error", { status: 500 });
  }
}
