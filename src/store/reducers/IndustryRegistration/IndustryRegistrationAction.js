import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../../utills/services"; // Ensure the API path is correct

export const addIndustryRegistration = createAsyncThunk(
  "IndustryRegistration/addIndustry",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await API.post("Industry/Add", payload); // Update the URL if needed
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
