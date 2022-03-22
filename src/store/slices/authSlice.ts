import { setUserToken } from "./../../utils/token";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LOGIN } from "../../service/api/auth";

type AuthState = {
  loading: boolean;
  error: string;
  userId: number | undefined;
  token: string | undefined;
  role: string | undefined;
  dormitoryId: number | undefined;
};
const initialState: AuthState = {
  loading: false,
  error: "",
  userId: undefined,
  token: undefined,
  role: undefined,
  dormitoryId: undefined,
};

export const signinAsync = createAsyncThunk(
  "signin",
  async ({ email, password }: { email: string; password: string }) => {
    try {
      const res = await LOGIN({ username: email, password });
      const data = res.results;
      if (data.role === "renter") {
        throw new Error();
      }
      const token = data.access_token;
      const userId = data.id;
      const role: string = data.role;
      const dormitoryId = data.dormitoryId;
      localStorage.setItem("token", data.access_token);
      setUserToken(data.access_token);
      return { token, userId, role, dormitoryId };
    } catch (error) {
      throw new Error("*อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signout: (state) => {
      state.loading = false;
      state.error = "";
      state.role = undefined;
      state.token = undefined;
      state.userId = undefined;
      state.dormitoryId = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signinAsync.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(signinAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.role = action.payload.role;
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.dormitoryId = action.payload.dormitoryId;
    });
    builder.addCase(signinAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "";
    });
  },
});

export const { signout } = authSlice.actions;

export default authSlice.reducer;
