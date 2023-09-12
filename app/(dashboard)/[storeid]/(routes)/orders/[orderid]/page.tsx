import prismadb from "@/lib/prismadb";
import OrderForm from "../components/OrderForm";
import { formatter } from "@/lib/utils";

const ColorPage = async ({
  params,
}: {
  params: {
    orderid: string;
  };
}) => {
  const order = await prismadb.order.findUnique({
    where: {
      id: params.orderid,
    },
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              size: true,
              color: true,
            },
          },
        },
      },
    },
  });
  const formattedOrder = {
    ...order,
    orderItems: order?.orderItems.map((orderItem) => ({
      ...orderItem,
      product: {
        ...orderItem.product,
        price: formatter.format(Number(orderItem.product.price)),
      },
    })),
  };
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderForm initialData={formattedOrder} />
      </div>
    </div>
  );
};

export default ColorPage;
