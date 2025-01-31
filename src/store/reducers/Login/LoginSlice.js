// src/redux/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: localStorage.getItem("email")||null,
  token: localStorage.getItem("authToken") || null,
  accountType: localStorage.getItem("accountType")||null,
  imageURL: localStorage.getItem("imageURL")||null,
  fullName: localStorage.getItem("fullName")||null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    login(state, action) {
      //console.log(action.payload.token +"from slice")
      //console.log(action.payload.email +"from slice11")

      state.token = action.payload.token;
      localStorage.setItem("email",action.payload.email);
      localStorage.setItem("accountType",action.payload.accountType);
      localStorage.setItem("imageURL",action.payload.imageURL);
      localStorage.setItem("fullName",action.payload.fullName);
     
      //console.log(state.email +"from Newslice11")
      localStorage.setItem("authToken", action.payload.token);
    },
    logout(state) {
      state.token = null;
      localStorage.removeItem("email");
      localStorage.removeItem("accountType");
      //localStorage.removeItem("imageURL");
      localStorage.removeItem("fullName");
     
      localStorage.removeItem("authToken");
      //localStorage.removeItem('token');
    },
  },
});

export const { login, logout } = loginSlice.actions;
export default loginSlice.reducer;
