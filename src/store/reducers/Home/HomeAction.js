// src/store/reducers/Home/HomeAction.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../../utills/services"; // Verify this path points to your services file

// Fetch customers (assumed API endpoint)
export const fetchCustomers = createAsyncThunk(
  "home/fetchCustomers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("Customer/GetAll"); // Adjust endpoint if needed
      if (response.data && Array.isArray(response.data.customers)) {
        return response.data.customers;
      } else {
        return rejectWithValue("No customers found.");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Fetching customers failed."
      );
    }
  }
);

// Fetch customer projects given a customer id
export const fetchCustomerProjects = createAsyncThunk(
  "home/fetchCustomerProjects",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await API.get(`Customer/GetProjects?customerId=${customerId}`); // Adjust endpoint as needed
      if (response.data && Array.isArray(response.data.projects)) {
        return response.data.projects;
      } else {
        return rejectWithValue("No projects found for this customer.");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Fetching customer projects failed."
      );
    }
  }
);