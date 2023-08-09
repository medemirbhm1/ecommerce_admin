import prismadb from "@/lib/prismadb";
import { SizeColumn } from "./components/Columns";
import SizeClient from "./components/SizeClient";
import { format } from "date-fns";

const SizesPage = async ({ params }: { params: { storeid: string } }) => {
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeid,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formattedSizes: SizeColumn[] = sizes.map(
    ({ id, name, value, createdAt }) => ({
      id,
      name,
      value,
      createdAt: format(createdAt, "MMMM do, yyyy"),
    })
  );
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
