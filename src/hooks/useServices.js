/**
 * useServices Hook
 * Custom hook for fetching and managing services data
 */

import { getServices } from "@/api/servicesApi";
import { useQuery } from "@tanstack/react-query";

export const useServices = (params = {}) => {
  return useQuery({
    queryKey: ["services", params],
    queryFn: async () => {
      const response = await getServices(params);
      return response?.data || [];
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  });
};

export const useActiveServices = () => {
  return useServices({ isActive: true });
};
