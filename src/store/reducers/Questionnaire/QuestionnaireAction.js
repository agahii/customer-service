// src/store/reducers/Questionnaire/QuestionnaireAction.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../../utills/services"; // Ensure this path is correct

// Add a new Question
export const addQuestion = createAsyncThunk(
  "questionnaire/addQuestion",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await API.post("Question/Add", payload); // Removed '/api' prefix
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
      const response = await API.post("Question/Get", {}); // Removed '/api' prefix
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

// Update Question
export const updateQuestion = createAsyncThunk(
  "questionnaire/updateQuestion",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await API.put("Question/Update", payload); // Removed '/api' prefix
      if (response.data.status === 0) { // Treat status 0 as success
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

// Delete Question
export const deleteQuestion = createAsyncThunk(
  "questionnaire/deleteQuestion",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await API.delete("Question/Delete", { data: payload }); // Removed '/api' prefix and adjusted for DELETE
      if (response.data.status === 0) { // Treat status 0 as success
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
