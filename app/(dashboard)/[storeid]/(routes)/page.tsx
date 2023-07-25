import prismadb from "@/lib/prismadb";
import React from "react";

interface DashboardPageProps {
  params: {
    storeid: string;
  };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeid,
    },
  });
  return <div>DashboardPage of ({store?.name})</div>;
};

export default DashboardPage;
