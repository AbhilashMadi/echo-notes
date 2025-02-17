import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UserSchema } from "@/types/object-types";
import { ServerKeys } from "@/resources/serverkeys";

interface AuthState {
  user: UserSchema | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserSchema | null>) => {
      state.user = action.payload;
    },
    updateUserTags: (state, action: PayloadAction<string[]>) => {
      if (!state.user) return;
      state.user[ServerKeys.TAGS] = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, clearUser, updateUserTags } = authSlice.actions;
export default authSlice;
