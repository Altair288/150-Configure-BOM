import { demoBom } from "@/mocks/bom";
import type { Bom } from "@/types/bom";

export async function getBom(bomId: string): Promise<Bom> {
  if (bomId !== demoBom.id) {
    throw new Error(`BOM ${bomId} was not found.`);
  }

  return demoBom;
}