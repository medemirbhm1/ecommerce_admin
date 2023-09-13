import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export const POST = async (
  req: Request,
  { params }: { params: { storeid: string } }
) => {
  try {
    const {
      items,
      firstname,
      lastname,
      email,
      phone,
      address,
      wilaya,
      commune,
      deliveryType,
      note,
    } = await req.json();
    if (!params.storeid) {
      return new NextResponse("Storeid is required", { status: 400 });
    }
    if (!firstname) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!lastname) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!phone) {
      return new NextResponse("Phone is required", { status: 400 });
    }
    if (!address) {
      return new NextResponse("Address is required", { status: 400 });
    }
    if (!wilaya) {
      return new NextResponse("Wilaya is required", { status: 400 });
    }
    if (!commune) {
      return new NextResponse("Commune is required", { status: 400 });
    }
    if (!deliveryType) {
      return new NextResponse("Delivery type is required", { status: 400 });
    }
    if (!items?.length) {
      return new NextResponse("You need to include one item at least", {
        status: 400,
      });
    }

    const order = await prismadb.order.create({
      data: {
        storeId: params.storeid,
        status: "New",
        firstname,
        lastname,
        email,
        phone,
        address,
        wilaya,
        commune,
        deliveryType,
        note,
        orderItems: {
          create: items.map((item: { id: string; quantity: number }) => ({
            quantity: item.quantity,
            product: {
              connect: {
                id: item.id,
              },
            },
          })),
        },
      },
    });
    return NextResponse.json(
      { message: "OK" },
      {
        headers: corsHeaders,
      }
    );
  } catch (err) {
    console.log("ORDER POST ERROR: ", err);
    return new NextResponse("internal error", { status: 500 });
  }
};
