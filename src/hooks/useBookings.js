/**
 * useBookings Hook
 * Handles bookings data fetching and mutations
 */

import {
  createBooking,
  deleteBooking,
  getBookingById,
  getBookings,
  updateBooking,
  updateBookingStatus,
} from "@/api/bookingsApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useToast from "./useToast";

const BOOKINGS_QUERY_KEY = "bookings";

export const useBookings = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [BOOKINGS_QUERY_KEY, params],
    queryFn: async () => {
      const response = await getBookings(params);
      const data = response?.data;

      if (Array.isArray(data)) {
        const bookings = data[0];
        const totalCount = data[1] || 0;
        return {
          bookings: Array.isArray(bookings) ? bookings : [],
          totalCount,
        };
      }

      return { bookings: [], totalCount: 0 };
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useBookingById = (id, options = {}) => {
  return useQuery({
    queryKey: [BOOKINGS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await getBookingById(id);
      return response?.data;
    },
    enabled: Boolean(id),
    ...options,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_QUERY_KEY] });
      toast.success("messages.bookingCreated");
    },
    onError: () => {
      toast.error("messages.bookingCreateFailed");
    },
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, data }) => updateBooking(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_QUERY_KEY] });
      toast.success("messages.bookingUpdated");
    },
    onError: () => {
      toast.error("messages.bookingUpdateFailed");
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, status }) => updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_QUERY_KEY] });
      toast.success("messages.bookingStatusUpdated");
    },
    onError: () => {
      toast.error("messages.bookingStatusUpdateFailed");
    },
  });
};

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BOOKINGS_QUERY_KEY] });
      toast.success("messages.bookingDeleted");
    },
    onError: () => {
      toast.error("messages.bookingDeleteFailed");
    },
  });
};
