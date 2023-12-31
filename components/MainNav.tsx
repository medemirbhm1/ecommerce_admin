"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const MainNav = ({ className, ...props }: { className: string }) => {
  const pathname = usePathname();
  const params = useParams();
  const routes = [
    {
      href: `/${params.storeid}`,
      label: "Dashboard",
      active: pathname === `/${params.storeid}`,
    },
    {
      href: `/${params.storeid}/settings`,
      label: "Settings",
      active: pathname === `/${params.storeid}/settings`,
    },
    {
      href: `/${params.storeid}/billboards`,
      label: "Billboards",
      active: pathname === `/${params.storeid}/billboards`,
    },
    {
      href: `/${params.storeid}/categories`,
      label: "Categories",
      active: pathname === `/${params.storeid}/categories`,
    },
    {
      href: `/${params.storeid}/sizes`,
      label: "Sizes",
      active: pathname === `/${params.storeid}/sizes`,
    },
    {
      href: `/${params.storeid}/colors`,
      label: "Colors",
      active: pathname === `/${params.storeid}/colors`,
    },
    {
      href: `/${params.storeid}/products`,
      label: "Products",
      active: pathname === `/${params.storeid}/products`,
    },
    {
      href: `/${params.storeid}/orders`,
      label: "Orders",
      active: pathname === `/${params.storeid}/orders`,
    },
  ];
  return (
    <nav className={cn("flext items-center space-x-4 lg:space-x-6", className)}>
      {routes.map((route) => (
        <Link
          href={route.href}
          key={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
