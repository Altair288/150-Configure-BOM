"use client";

import { useQuery } from "@tanstack/react-query";
import { getBom } from "@/features/bom/api/bom-api";

export function useBom(bomId: string) {
  return useQuery({
    queryKey: ["bom", bomId],
    queryFn: () => getBom(bomId),
  });
}