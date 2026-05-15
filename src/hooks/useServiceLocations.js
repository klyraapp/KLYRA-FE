/**
 * useServiceLocations Hook
 * Handles fetching of active service locations
 */

import { getActiveServiceLocations } from "@/api/serviceLocationApi";
import { useQuery } from "@tanstack/react-query";

const SERVICE_LOCATIONS_QUERY_KEY = "serviceLocations";

export const useServiceLocations = (options = {}) => {
  return useQuery({
    queryKey: [SERVICE_LOCATIONS_QUERY_KEY],
    queryFn: async () => {
      const response = await getActiveServiceLocations();
      // Handle various response structures
      return response.data?.data || response.data || [];
    },
    staleTime: 60 * 60 * 1000, // 1 hour as locations don't change often
    retry: 1,
    ...options,
  });
};
