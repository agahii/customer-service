// src/store/reducers/QuestionType/QuestionTypeSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchQuestionTypes } from "./QuestionTypeAction";

const questionTypeSlice = createSlice({
  name: "questionType",
  initialState: {
    entities: [], // will store the array of question types
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchQuestionTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionTypes.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.entities = payload; // set the array of question types
      })
      .addCase(fetchQuestionTypes.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default questionTypeSlice.reducer;
