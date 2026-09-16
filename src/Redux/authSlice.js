import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  user: (() => {
    try {
      const userFromCookies = Cookies.get("user");
      return userFromCookies ? JSON.parse(userFromCookies) : null;
    } catch (e) {
      console.error("Failed to parse user data from cookies:", e);
      return null;
    }
  })(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
      Cookies.set("user", JSON.stringify(action.payload)); // Save user data in cookies
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      Cookies.remove("user");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
