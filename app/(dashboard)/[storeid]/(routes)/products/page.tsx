import { format } from "date-fns";
import { ProductColumn } from "./components/Columns";
import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import ProductClient from "./components/ProductClient";

const ProductsPage = async ({ params }: { params: { storeid: string } }) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeid,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formattedProducts: ProductColumn[] = products.map(
    ({
      id,
      name,
      createdAt,
      isFeatured,
      isArchived,
      price,
      category,
      size,
      color,
    }) => ({
      id,
      name,
      isArchived,
      isFeatured,
      price: formatter.format(price.toNumber()),
      category: category.name,
      size: size.value,
      color: color.value,
      createdAt: format(createdAt, "MMMM do, yyyy"),
    })
  );
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
