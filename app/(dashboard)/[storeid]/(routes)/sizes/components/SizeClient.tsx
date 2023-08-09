"use client";

import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { SizeColumn, columns } from "./Columns";
import { DataTable } from "@/components/ui/DataTable";
import ApiList from "@/components/ui/apiList";

interface SizeClientProps {
  data: SizeColumn[];
}

const SizeClient: React.FC<SizeClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes (${data.length})`}
          description="Manage store sizes"
        />
        <Button
          onClick={() => {
            router.push(`/${params.storeid}/sizes/new`);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} filterKey="name" />
      <Heading title="API" description="Api calls for sizes" />
      <Separator />
      <ApiList entityName="sizes" entityIdName="sizeId" />
    </>
  );
};

export default SizeClient;
