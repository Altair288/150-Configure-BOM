import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConfiguratorWorkspace } from "@/components/configurator/configurator-workspace";
import { getConfiguratorData } from "@/features/configurator/api/configurator-api";

export const metadata: Metadata = {
  title: "Configurator",
};

export default async function ConfiguratorRoute({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  let data;

  try {
    data = await getConfiguratorData(productId);
  } catch {
    notFound();
  }

  return <ConfiguratorWorkspace data={data} />;
}