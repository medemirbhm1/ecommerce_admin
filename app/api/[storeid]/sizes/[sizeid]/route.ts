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
      sizeid: string;
    };
  }
) {
  try {
    if (!params.storeid) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!params.sizeid) {
      return new NextResponse("Size id is required", { status: 400 });
    }
    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeid,
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
      sizeid: string;
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
    if (!params.sizeid) {
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
    const size = await prismadb.size.updateMany({
      where: {
        id: params.sizeid,
      },
      data: {
        name,
        value,
      },
    });
    return NextResponse.json(size);
  } catch (err) {
    console.log("SIZE PATCH ERROR: ", err);
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
      sizeid: string;
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
    if (!params.sizeid) {
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
    const size = await prismadb.size.delete({
      where: {
        id: params.sizeid,
      },
    });
    return NextResponse.json(size);
  } catch (err) {
    console.log("SIZE DELETE ERROR: ", err);
    return new NextResponse("internal error", { status: 500 });
  }
}
