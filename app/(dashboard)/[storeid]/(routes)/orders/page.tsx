import prismadb from "@/lib/prismadb";
import OrderClient from "./components/OrderClient";
import { format } from "date-fns";
import { OrderColumn } from "./components/Columns";
import { formatter } from "@/lib/utils";

const OrdersPage = async ({ params }: { params: { storeid: string } }) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeid,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formattedOrders: OrderColumn[] = orders.map(
    ({ id, createdAt, address, orderItems, status, name }) => ({
      id,
      status,
      name,
      address,
      products: orderItems
        .map((orderItem) => orderItem.product.name)
        .join(", "),
      totalPrice: formatter.format(
        orderItems.reduce((total, orderItem) => {
          return total + Number(orderItem.product.price) * orderItem.quantity;
        }, 0)
      ),
      createdAt: format(createdAt, "MMMM do, yyyy"),
    })
  );
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
