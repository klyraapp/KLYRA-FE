/**
 * Booking Slice
 * Redux state management for the booking flow
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Service selection
  selectedService: null,
  availableExtraServices: [],

  // Step 2: Details
  accommodationType: null,
  numberOfBathrooms: 1,
  areaSqm: 25,
  isRecurring: false,
  recurringInterval: null,

  // Step 2 Extra: Additional info
  hasFreeParking: false,
  hasPets: false,
  accessMethod: "MEET_AT_DOOR",
  specialInstructions: "",

  // Step 2 Extra Services
  selectedExtraServiceIds: [],

  // Step 3: Date & Time
  bookingDate: null,
  preferredTime: null,

  // Step 4: Discount (if implemented)
  promoCode: "",
  offerId: 0,

  // Step 5: Customer info (if implemented)
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  serviceStreetAddress: "",
  servicePostalCode: "",
  serviceCity: "",
  serviceCountry: "Norway",

  // Step 6: Payment
  paymentMethod: "CARD",
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setSelectedService: (state, action) => {
      const service = action.payload;
      state.selectedService = service;

      // Reset recurring state whenever a new service is selected
      state.isRecurring = false;
      state.recurringInterval = null;

      // Reset extra services selection when a main service is selected/changed
      state.selectedExtraServiceIds = [];

      // Extract extra services from the service response
      const extras = service?.extraServices || service?.extraervices || [];
      state.availableExtraServices = Array.isArray(extras)
        ? extras
        : Object.values(extras).filter((i) => typeof i === "object" && i !== null);
    },
    setAccommodationType: (state, action) => {
      state.accommodationType = action.payload;
    },
    setNumberOfBathrooms: (state, action) => {
      state.numberOfBathrooms = action.payload;
    },
    setAreaSqm: (state, action) => {
      state.areaSqm = action.payload;
    },
    setIsRecurring: (state, action) => {
      state.isRecurring = action.payload;
      if (!action.payload) {
        state.recurringInterval = null;
      }
    },
    setRecurringInterval: (state, action) => {
      state.recurringInterval = action.payload;
      state.isRecurring = action.payload !== null;
    },
    setHasFreeParking: (state, action) => {
      state.hasFreeParking = action.payload;
    },
    setHasPets: (state, action) => {
      state.hasPets = action.payload;
    },
    setAccessMethod: (state, action) => {
      state.accessMethod = action.payload;
    },
    setSpecialInstructions: (state, action) => {
      state.specialInstructions = action.payload;
    },
    setSelectedExtraServiceIds: (state, action) => {
      state.selectedExtraServiceIds = action.payload;
    },
    toggleExtraService: (state, action) => {
      const serviceId = action.payload;
      const index = state.selectedExtraServiceIds.indexOf(serviceId);
      if (index > -1) {
        state.selectedExtraServiceIds.splice(index, 1);
      } else {
        state.selectedExtraServiceIds.push(serviceId);
      }
    },
    setBookingDate: (state, action) => {
      state.bookingDate = action.payload;
    },
    setPreferredTime: (state, action) => {
      state.preferredTime = action.payload;
    },
    setPromoCode: (state, action) => {
      state.promoCode = action.payload;
    },
    setOfferId: (state, action) => {
      state.offerId = action.payload;
    },
    setCustomerInfo: (state, action) => {
      const {
        firstName,
        lastName,
        email,
        phone,
        serviceStreetAddress,
        servicePostalCode,
        serviceCity,
        serviceCountry,
      } = action.payload;
      state.firstName = firstName;
      state.lastName = lastName;
      state.email = email;
      state.phone = phone;
      state.serviceStreetAddress = serviceStreetAddress;
      state.servicePostalCode = servicePostalCode;
      state.serviceCity = serviceCity;
      state.serviceCountry = serviceCountry;
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    resetBooking: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase("auth/logout", () => initialState);
  },
});

export const {
  setSelectedService,
  setAccommodationType,
  setNumberOfBathrooms,
  setAreaSqm,
  setIsRecurring,
  setRecurringInterval,
  setHasFreeParking,
  setHasPets,
  setAccessMethod,
  setSpecialInstructions,
  setSelectedExtraServiceIds,
  toggleExtraService,
  setBookingDate,
  setPreferredTime,
  setPromoCode,
  setOfferId,
  setCustomerInfo,
  setPaymentMethod,
  resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
