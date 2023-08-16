"use client";

import Heading from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { OrderColumn, columns } from "./Columns";
import { DataTable } from "@/components/ui/DataTable";

interface OrderClientProps {
  data: OrderColumn[];
}

const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Orders (${data.length})`}
          description="Manage store orders"
        />
      </div>
      <Separator />
      <DataTable columns={columns} data={data} filterKey="products" />
    </>
  );
};

export default OrderClient;
