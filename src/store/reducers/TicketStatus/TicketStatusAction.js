// src/store/reducers/QuestionType/QuestionTypeAction.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../../utills/services"; // Adjust if needed

// Fetch Question Types
export const fetchTicketStatus = createAsyncThunk(
  "ticketStatus/fetch",
  async (_, { rejectWithValue }) => {
    try {
      // Your endpoint is POST /api/QuestionType/Get
      // Response looks like { data: [...], responseCode: 1000, message: "", ... }
      const response = await API.post("Answer/Get");

      // We check if responseCode is 1000 and if data is an array
      if (
        response.data.responseCode === 1000 &&
        Array.isArray(response.data.data)
      ) {
        return response.data.data; // <-- Return the array of question types
      } else {
        // If not, return a meaningful error
        return rejectWithValue(
          response.data.message || "No ticket status found."
        );
      }
    } catch (error) {
      // Provide a fallback error message
      return rejectWithValue(
        error.response?.data?.message || "Fetching question types failed."
      );
    }
  }
);
