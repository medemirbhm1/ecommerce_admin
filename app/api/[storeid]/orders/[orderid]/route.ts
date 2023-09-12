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
      orderid: string;
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
    if (!params.orderid) {
      return new NextResponse("Order id is required", { status: 400 });
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
    const order = await prismadb.order.findUnique({
      where: {
        id: params.orderid,
      },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                category: true,
              }
            },
          },
        },
      },
    });
    return NextResponse.json(order);
  } catch (err) {
    console.log("ORDER GET ERROR: ", err);
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
      orderid: string;
    };
  }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { status } = body;
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!status) {
      return new NextResponse("Status  is required", { status: 400 });
    }
    if (!params.storeid) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!params.orderid) {
      return new NextResponse("Order id is required", { status: 400 });
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
    const order = await prismadb.order.updateMany({
      where: {
        id: params.orderid,
      },
      data: {
        status,
      },
    });
    return NextResponse.json(order);
  } catch (err) {
    console.log("ORDER PATCH ERROR: ", err);
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
      orderid: string;
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
    if (!params.orderid) {
      return new NextResponse("Order id is required", { status: 400 });
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
    const order = await prismadb.order.delete({
      where: {
        id: params.orderid,
      },
    });
    return NextResponse.json(order);
  } catch (err) {
    console.log("ORDER DELETE ERROR: ", err);
    return new NextResponse("internal error", { status: 500 });
  }
}
