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
      colorid: string;
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
    if (!params.colorid) {
      return new NextResponse("Size id is required", { status: 400 });
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
    const size = await prismadb.size.findUnique({
      where: {
        id: params.colorid,
      },
    });
    return NextResponse.json(size);
  } catch (err) {
    console.log("SIZE GET ERROR: ", err);
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
      colorid: string;
    };
  }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, value } = body;
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
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!params.colorid) {
      return new NextResponse("Color id is required", { status: 400 });
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
    const color = await prismadb.color.updateMany({
      where: {
        id: params.colorid,
      },
      data: {
        name,
        value,
      },
    });
    return NextResponse.json(color);
  } catch (err) {
    console.log("COLOR PATCH ERROR: ", err);
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
      colorid: string;
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
    if (!params.colorid) {
      return new NextResponse("Color id is required", { status: 400 });
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
    const color = await prismadb.color.delete({
      where: {
        id: params.colorid,
      },
    });
    return NextResponse.json(color);
  } catch (err) {
    console.log("COLOR DELETE ERROR: ", err);
    return new NextResponse("internal error", { status: 500 });
  }
}
