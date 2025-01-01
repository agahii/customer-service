// src/store/reducers/Questionnaire/QuestionnaireSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { addQuestion, getQuestions } from "./QuestionnaireAction";

const initialState = {
  questions: [],
  loading: false,
  error: null,
};

const QuestionnaireSlice = createSlice({
  name: "questionnaire",
  initialState,
  reducers: {
    // Define your synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      // Add Question Cases
      .addCase(addQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.questions.push(action.payload);
      })
      .addCase(addQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Questions Cases
      .addCase(getQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(getQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default QuestionnaireSlice.reducer;
