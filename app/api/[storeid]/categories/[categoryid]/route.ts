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
      categoryid: string;
    };
  }
) {
  try {
    if (!params.storeid) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!params.categoryid) {
      return new NextResponse("Category id is required", { status: 400 });
    }
    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryid,
      },
      include: {
        billboard: true,
      },
    });
    return NextResponse.json(category);
  } catch (err) {
    console.log("CATEGORY GET ERROR: ", err);
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
      categoryid: string;
    };
  }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, billboardId } = body;
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
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!params.categoryid) {
      return new NextResponse("Category id is required", { status: 400 });
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
    const billboard = await prismadb.category.updateMany({
      where: {
        id: params.categoryid,
      },
      data: {
        name,
        billboardId,
      },
    });
    return NextResponse.json(billboard);
  } catch (err) {
    console.log("CATEGORY PATCH ERROR: ", err);
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
      categoryid: string;
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
    if (!params.categoryid) {
      return new NextResponse("Category id is required", { status: 400 });
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
    const category = await prismadb.category.delete({
      where: {
        id: params.categoryid,
      },
    });
    return NextResponse.json(category);
  } catch (err) {
    console.log("CATEGORY DELETE ERROR: ", err);
    return new NextResponse("internal error", { status: 500 });
  }
}
