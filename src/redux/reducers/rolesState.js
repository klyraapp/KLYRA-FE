import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roles: [],
  rolesModal: false,
  rolesModalD: false,
  selectedRole: {},
};

export const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    setRolesModal: (state, action) => {
      state.rolesModal = action.payload;
    },
    setRolesModalDelete: (state, action) => {
      state.rolesModalD = action.payload;
    },
    setSelectedRole: (state, action) => {
      state.selectedRole = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase("auth/logout", () => initialState);
  },
});

export const { setRolesModal, setRolesModalDelete, setSelectedRole } =
  rolesSlice.actions;

export default rolesSlice.reducer;
