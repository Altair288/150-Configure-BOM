"use client";

import { useQuery } from "@tanstack/react-query";
import { getConfiguratorData } from "@/features/configurator/api/configurator-api";

export function useConfiguratorData(productId: string) {
  return useQuery({
    queryKey: ["configurator", productId],
    queryFn: () => getConfiguratorData(productId),
  });
}