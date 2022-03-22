import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface alertState {
  srcLogo: string;
  dormitoryName: string;
}

const initialState: alertState = {
  srcLogo: "",
  dormitoryName: "",
};

const dormitorySlice = createSlice({
  name: "dormitory",
  initialState,
  reducers: {
    editInfo: (state, action: PayloadAction<alertState>) => {
      state.srcLogo = action.payload.srcLogo;
      state.dormitoryName = action.payload.dormitoryName;
    },
  },
});

export const { editInfo } = dormitorySlice.actions;
export default dormitorySlice.reducer;
