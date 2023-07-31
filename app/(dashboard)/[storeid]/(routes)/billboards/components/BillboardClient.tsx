"use client";

import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const BillboardClient = () => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Billboards (0)" description="Manage store billboards" />
        <Button
          onClick={() => {
            router.push(`/${params.storeid}/billboards/new`);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>
      <Separator />
    </>
  );
};

export default BillboardClient;
