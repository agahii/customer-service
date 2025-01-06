import { createSlice } from "@reduxjs/toolkit";
import {
  addQuestion,
  addQuestions, // Imported the new addQuestions action
  getQuestions,
  updateQuestion,
  deleteQuestion,
  getQuestionById, // Imported the new getQuestionById action
} from "./QuestionnaireAction";

const initialState = {
  questions: [],
  currentQuestion: null, // Added to store a single fetched question
  fetchedQuestions : [], // Added to store the fetched questions
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
      // Add Single Question Cases (Optional: Keep if used elsewhere)
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
      
      // Add Multiple Questions Cases (New)
      .addCase(addQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addQuestions.fulfilled, (state, action) => {
        state.loading = false;
        // Assuming the API returns an array of added questions in content
        // If the API returns differently, adjust accordingly
        if (Array.isArray(action.payload)) {
          state.questions.push(...action.payload);
        } else {
          // If it's a single object or needs transformation
          state.questions.push(action.payload);
        }
      })
      .addCase(addQuestions.rejected, (state, action) => {
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
      })
      
      // Update Question Cases
      .addCase(updateQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.questions.findIndex((q) => q.id === action.payload.id);
        if (index !== -1) {
          state.questions[index] = action.payload;
        }
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Question Cases
      .addCase(deleteQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = state.questions.filter((q) => q.id !== action.payload);
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // **New: Handle getQuestionById Actions**
      .addCase(getQuestionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getQuestionById.fulfilled, (state, action) => {
        state.loading = false;
        state.fetchedQuestions = action.payload; // Store the fetched questions
        // state.currentQuestion = action.payload.data; // Store the fetched question's data
        // state.questions = action.payload.data.questionDetail || []; // Populate questions[] from the response
      })
      .addCase(getQuestionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default QuestionnaireSlice.reducer;
