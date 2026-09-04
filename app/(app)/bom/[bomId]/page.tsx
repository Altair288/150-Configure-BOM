import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BomExplorer } from "@/components/bom/bom-explorer";
import { demoBom } from "@/mocks/bom";

export const metadata: Metadata = {
  title: "BOM Explorer",
};

export default async function BomExplorerRoute({ params }: { params: Promise<{ bomId: string }> }) {
  const { bomId } = await params;

  if (bomId !== demoBom.id) {
    notFound();
  }

  return <BomExplorer bom={demoBom} />;
}