import prismadb from "@/lib/prismadb";
import BillboardForm from "../components/CategoryForm";

const CategoryPage = async ({
  params,
}: {
  params: {
    categoryid: string;
    storeid: string;
  };
}) => {
  const category = await prismadb.category.findUnique({
    where: {
      id: params.categoryid,
    },
  });
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeid,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={category} billboards={billboards} />
      </div>
    </div>
  );
};

export default CategoryPage;
