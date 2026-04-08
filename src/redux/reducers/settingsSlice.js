/**
 * Settings Slice
 * Redux state management for application-wide settings
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  priceSettings: {
    SQM_TO_SQFT: 10.764,
    petSurcharge: 5,
    parkingSurcharge: 10,
    taxRatePercentage: 25,
    drivingFeeForOneTimeServices: 10
  },
  bookingCalenderSlotSettings: null,
  cronSettings: null,
  isLoading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setSettings: (state, action) => {
      const settings = action.payload;
      if (Array.isArray(settings)) {
        settings.forEach((s) => {
          if (s.name === "priceSettings") state.priceSettings = s.value;
          if (s.name === "bookingCalenderSlotSettings") state.bookingCalenderSlotSettings = s.value;
          if (s.name === "cronSettings") state.cronSettings = s.value;
        });
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setSettings, setLoading, setError } = settingsSlice.actions;

export default settingsSlice.reducer;
