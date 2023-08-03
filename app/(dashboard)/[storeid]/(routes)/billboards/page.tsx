import prismadb from "@/lib/prismadb";
import BillboardClient from "./components/BillboardClient";
import { format } from "date-fns";
import { BillboardColumn } from "./components/Columns";

const BillboardsPage = async ({ params }: { params: { storeid: string } }) => {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeid,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formattedBillboards: BillboardColumn[] = billboards.map(
    ({ id, label, createdAt }) => ({
      id,
      label,
      createdAt: format(createdAt, "MMMM do, yyyy"),
    })
  );
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
