import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { CategoryColumn } from "./components/Columns";
import CategoryClient from "./components/CategoryClient";

const CategoriesPage = async ({ params }: { params: { storeid: string } }) => {
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeid,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      billboard: true,
    },
  });
  const formattedCategories: CategoryColumn[] = categories.map(
    ({ id, name, createdAt, billboard }) => ({
      id,
      name,
      billboardLabel: billboard?.label,
      createdAt: format(createdAt, "MMMM do, yyyy"),
    })
  );
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
