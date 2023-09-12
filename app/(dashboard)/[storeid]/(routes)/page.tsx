import { getGraphRevenue } from "@/actions/getGraphRevenue";
import { getProductsCount } from "@/actions/getProductsCount";
import { getSalesCount } from "@/actions/getSalesCount";
import { getTotalRevenue } from "@/actions/getTotalRevenue";
import Overview from "@/components/Overview";
import Heading from "@/components/ui/Heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatter } from "@/lib/utils";
import { CreditCard, DollarSign, Package } from "lucide-react";
import React from "react";

interface DashboardPageProps {
  params: {
    storeid: string;
  };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const totalRevenue = await getTotalRevenue(params.storeid);
  const salesCount = await getSalesCount(params.storeid);
  const productsCount = await getProductsCount(params.storeid);
  const graphRevenue = await getGraphRevenue(params.storeid);
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Overview of the store" />
        <Separator />
        <div className="grid gap-4 grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total revenue
              </CardTitle>
              <DollarSign className="text-muted-foreground w-4 h-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatter.format(totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total sales</CardTitle>
              <CreditCard className="text-muted-foreground w-4 h-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{salesCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Available products
              </CardTitle>
              <Package className="text-muted-foreground w-4 h-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{productsCount}</div>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={graphRevenue} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
