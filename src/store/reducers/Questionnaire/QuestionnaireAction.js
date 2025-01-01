// src/store/reducers/Questionnaire/QuestionnaireAction.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../../utills/services"; // Ensure this path is correct

// Add a new Question
export const addQuestion = createAsyncThunk(
  "questionnaire/addQuestion",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await API.post("/api/Question/Add", payload);
      if (response.data.status === 0) { // Treat status 0 as success
        return response.data.content; // Adjust based on actual successful response content
      } else {
        return rejectWithValue(response.data.reasonPhrase || "Adding question failed.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.reasonPhrase || "Adding question failed.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch Questions
export const getQuestions = createAsyncThunk(
  "questionnaire/getQuestions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.post("/api/Question/Get", {}); // Assuming no payload required
      if (response.data.hasValue) {
        return response.data.value; // Array of questions
      } else {
        return rejectWithValue("No questions found.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.reasonPhrase || "Fetching questions failed.";
      return rejectWithValue(errorMessage);
    }
  }
);
