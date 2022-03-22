import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface userState {
  firstName: string;
  lastName: string;
}

const initialState: userState = {
  firstName: "",
  lastName: "",
};

const userSlice = createSlice({
  name: "dormitory",
  initialState,
  reducers: {
    editUserInfo: (state, action: PayloadAction<userState>) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
    },
  },
});

export const { editUserInfo } = userSlice.actions;
export default userSlice.reducer;
