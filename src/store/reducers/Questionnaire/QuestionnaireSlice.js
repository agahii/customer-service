// src/store/reducers/Questionnaire/QuestionnaireSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { addQuestionnaire } from "./QuestionnaireAction"; // Ensure correct path

const questionnaireSlice = createSlice({
  name: "questionnaire",
  initialState: {
    entities: [], // Stores submitted questionnaires
    loading: false,
    error: null,
    total: 0,
  },
  reducers: {
    // Add any synchronous reducers if needed
  },
  extraReducers: (builder) => {
    builder
      // Handle Add Questionnaire Pending State
      .addCase(addQuestionnaire.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle Add Questionnaire Fulfilled State
      .addCase(addQuestionnaire.fulfilled, (state, { payload }) => {
        state.entities.push(payload);
        state.total += 1;
        state.loading = false;
      })
      // Handle Add Questionnaire Rejected State
      .addCase(addQuestionnaire.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default questionnaireSlice.reducer;
