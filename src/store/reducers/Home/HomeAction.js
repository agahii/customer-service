// src/store/reducers/Home/HomeAction.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../../utills/services"; // Adjust the path if necessary

// Fetch Industries
export const fetchIndustries = createAsyncThunk(
  "home/fetchIndustries",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.post("Industry/Get"); // Adjust the endpoint as per your API

      if (response.data.responseCode === 1000 && Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to fetch industries.");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "An error occurred while fetching industries."
      );
    }
  }
);

// Fetch Customer Projects
export const fetchCustomerProjects = createAsyncThunk(
  "home/fetchCustomerProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.post("CustomerProject/Get"); // Adjust the endpoint as per your API

      if (response.data.responseCode === 1000 && Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to fetch customer projects.");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "An error occurred while fetching customer projects."
      );
    }
  }
);

// Fetch Questionnaire by Project ID
export const fetchQuestionnaireByProjectId = createAsyncThunk(
  "home/fetchQuestionnaireByProjectId",
  async (projectId, { rejectWithValue }) => {
    try {
      const response = await API.get(`Questionnaire/GetByProjectId?id=${projectId}`); // Adjust the endpoint as per your API

      if (response.data.responseCode === 1000 && Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to fetch questionnaire.");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "An error occurred while fetching the questionnaire."
      );
    }
  }
);
