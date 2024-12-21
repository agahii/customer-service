// src/store/reducers/Questionnaire/QuestionnaireAction.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../../utills/services"; // Ensure this path is correct

// Add a new Questionnaire
export const addQuestionnaire = createAsyncThunk(
  "questionnaire/add",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await API.post("Questionnaire/Add", payload);
      // Adjust based on your API's response structure
      return response.data.data; // Assuming the API returns the created questionnaire under 'data'
    } catch (error) {
      // Extract error message from response or use a default message
      const errorMessage = error.response?.data?.message || "Adding questionnaire failed.";
      return rejectWithValue(errorMessage);
    }
  }
);
