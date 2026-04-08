import { NAME_USER } from "@/utils/userConstants";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  userModal: false,
  userModalD: false,
  profileData: {
    profileName: "",
    email: "",
    role: "",
    permissions: [],
    id: null,
    userLanguage: "en",
  },
  selectedUser: {},
};

export const userSlice = createSlice({
  name: NAME_USER,
  initialState,
  reducers: {
    setUserModal: (state, action) => {
      state.userModal = action.payload;
    },
    setUserModalDelete: (state, action) => {
      state.userModalD = action.payload;
    },
    setProfileData: (state, action) => {
      state.profileData = action.payload;
    },
    setSelectedRole: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase("auth/logout", () => initialState);
  },
});

export const {
  setProfileData,
  setUserModal,
  setUserModalDelete,
  setSelectedRole,
} = userSlice.actions;

export default userSlice.reducer;
