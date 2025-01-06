// src/store/reducers/Questionnaire/QuestionnaireAction.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../../utills/services"; // Ensure this path is correct

// Add a Single Question (Optional: Keep if needed elsewhere)
export const addQuestion = createAsyncThunk(
  "questionnaire/addQuestion",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await API.post("Question/Add", payload); // Ensure endpoint is correct
      if (response.data.status === 0) {
        // Treat status 0 as success
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

// Add Multiple Questions (New Action)
export const addQuestions = createAsyncThunk(
  "questionnaire/addQuestions",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await API.post("Question/Add", payload); // Ensure endpoint is correct
      if (response.data.status === 0) {
        // Treat status 0 as success
        return response.data.content; // Adjust based on actual successful response content
      } else {
        return rejectWithValue(response.data.reasonPhrase || "Adding questions failed.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.reasonPhrase || "Adding questions failed.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch Questions (Existing)
export const getQuestions = createAsyncThunk(
  "questionnaire/getQuestions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.post("Question/Get", {}); // Ensure endpoint is correct
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

// Update Question (Existing)
export const updateQuestion = createAsyncThunk(
  "questionnaire/updateQuestion",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await API.put("Question/Update", payload); // Ensure endpoint is correct
      if (response.data.status === 0) {
        // Treat status 0 as success
        return response.data.content; // Adjust based on actual successful response content
      } else {
        return rejectWithValue(response.data.reasonPhrase || "Updating question failed.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.reasonPhrase || "Updating question failed.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete Question (Existing)
export const deleteQuestion = createAsyncThunk(
  "questionnaire/deleteQuestion",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await API.delete("Question/Delete", { data: payload }); // Ensure endpoint is correct
      if (response.data.status === 0) {
        // Treat status 0 as success
        return payload.id; // Return the ID of the deleted question
      } else {
        return rejectWithValue(response.data.reasonPhrase || "Deleting question failed.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.reasonPhrase || "Deleting question failed.";
      return rejectWithValue(errorMessage);
    }
  }
);


// **New Action: Fetch a Single Question by ID** (Minimal change: now GET instead of POST)
export const getQuestionById = createAsyncThunk(
  "questionnaire/getQuestionById",
  async (id, { rejectWithValue }) => {
    try {
      // Changed from API.post(...) to API.get(...) to match the GET /api/Question/GetById endpoint
      const response = await API.get(`Question/GetById?id=${id}`); 

      if (response?.data.data.questionDetail !== 0) {
        return response.data.data.questionDetail; // Return the single question object (which includes questionDetail[])
      } else {
        return rejectWithValue("Question not found.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.reasonPhrase || "Fetching question failed.";
      return rejectWithValue(errorMessage);
    }
  }
);
