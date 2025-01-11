// src/store/reducers/Home/HomeSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../../utills/services";

// A new thunk for home-specific getQuestionById
export const getQuestionByIdForHome = createAsyncThunk(
  "home/getQuestionByIdForHome",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await API.get(`Question/GetById?id=${projectId}`);
      return response.data?.data?.questionDetail || [];
    } catch (error) {
      return rejectWithValue("Failed to fetch project questions for home");
    }
  }
);

const homeSlice = createSlice({
  name: "home",
  initialState: {
    // ...
    homeQuestions: [],
    loadingQuestions: false,
    errorQuestions: null,
  },
  reducers: {
    // ...
  },
  extraReducers: (builder) => {
    builder
      .addCase(getQuestionByIdForHome.pending, (state) => {
        state.loadingQuestions = true;
        state.errorQuestions = null;
      })
      .addCase(getQuestionByIdForHome.fulfilled, (state, action) => {
        state.loadingQuestions = false;
        state.homeQuestions = action.payload;
      })
      .addCase(getQuestionByIdForHome.rejected, (state, action) => {
        state.loadingQuestions = false;
        state.errorQuestions = action.payload;
      });
  },
});

export default homeSlice.reducer;