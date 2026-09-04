import type { Metadata } from "next";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { listProducts } from "@/features/product/api/product-api";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardRoute() {
  const initialProducts = await listProducts();

  return <DashboardPage initialProducts={initialProducts} />;
}