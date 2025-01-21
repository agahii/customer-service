// src/store/reducers/CustomerRegistration/CustomerRegistrationAction.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../../utills/services";
import axios from "axios"; // Ensure axios is imported

// Add new Customer
export const addCustomerRegistration = createAsyncThunk(
  "customerRegistration/addCustomer",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await API.post("Customer/Add", payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Addition failed.");
    }
  }
);

// Fetch Customers
export const fetchCustomerRegistration = createAsyncThunk(
  "customerRegistration/fetchCustomers",
  async ({ pagingInfo, controller }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("skip", pagingInfo.skip);
      formData.append("take", pagingInfo.take);

      const response = await API.post("Customer/Get", formData, {
        signal: controller.signal,
      });
      return {
        data: response.data.data || [], // Changed from response.data.value to response.data.data
        totalRecords: response.data.totalRecords || 0,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        // Fetch was aborted; do not treat as an error
        return rejectWithValue('Fetch aborted');
      }
      return rejectWithValue(error.response?.data || "Fetching customers failed.");
    }
  }
); // <-- Correct closing

// Update Customer
export const updateCustomerRegistration = createAsyncThunk(
  "customerRegistration/updateCustomer",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await API.put("Customer/Update", payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Update failed.");
    }
  }
);

// Delete Customer
export const deleteCustomerRegistration = createAsyncThunk(
  "customerRegistration/deleteCustomer",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete("Customer/Delete", { data: { id } });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Deletion failed.");
    }
  }
);
// src/store/reducers/CustomerRegistration/CustomerRegistrationAction.js
export const uploadCustomerLogo = createAsyncThunk(
  "customerRegistration/uploadLogo",
  async ({ id, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("ID", id);
      formData.append("files", file);

      const response = await API.post("Customer/AddCustomerImageAsync", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return { id, logoUrl: response.data.logoUrl }; // Adjust response field based on API
    } catch (error) {
      return rejectWithValue(error.response?.data || "Logo upload failed.");
    }
  }
);
export const uploadProjectLogo = createAsyncThunk(
  "customerRegistration/uploadProjectLogo",
  async ({ id, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("ID", id);
      formData.append("files", file);

      const response = await API.post("Customer/AddCustomerProjectImageAsync", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return { id, logoUrl: response.data.logoUrl };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Project logo upload failed.");
    }
  }
);