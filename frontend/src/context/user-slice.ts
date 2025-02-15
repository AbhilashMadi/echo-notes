import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

import { type UserSchema } from "@/types/object-types";

interface IUserState {
  user: UserSchema | null;
}

const initialState = {
  user: null,
} satisfies IUserState as IUserState;

const userSlice = createSlice({
  name: "user-slice",
  initialState: initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserSchema>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
