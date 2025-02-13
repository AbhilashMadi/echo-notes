import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

interface IUserState {
  user: object;
}

const initialState = {
  user: {},
} satisfies IUserState as IUserState;

const userSlice = createSlice({
  name: "user-slice",
  initialState: initialState,
  reducers: {
    setUser: (state, action: PayloadAction<object>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
