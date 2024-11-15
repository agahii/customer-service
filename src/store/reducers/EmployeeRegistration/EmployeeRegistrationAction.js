import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../../utills/services"; // Make sure the API path is correct

export const addEmployeeRegistration = createAsyncThunk(
  "EmployeeRegistration/addEmployee",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await API.post("EmployeeRegistration/Add", payload); // Update the URL if needed
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
