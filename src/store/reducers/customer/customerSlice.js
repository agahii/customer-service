// src/store/reducers/CustomerRegistration/CustomerRegistration.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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
        data: response.data.data || [],
        totalRecords: response.data.totalRecords || 0,
      };
    } catch (error) {
      if (axios.isCancel(error)) {
        return rejectWithValue("Fetch aborted");
      }
      return rejectWithValue(error.response?.data || "Fetching customers failed.");
    }
  }
);

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

// Upload Customer Logo
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
      return { id, logoUrl: response.data.logoUrl };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Logo upload failed.");
    }
  }
);

// Upload Project Logo
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

// Slice Definition
const customerRegistrationSlice = createSlice({
  name: "customerRegistration",
  initialState: {
    entities: [],
    loading: false,
    error: null,
    total: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Customers
      .addCase(fetchCustomerRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerRegistration.fulfilled, (state, { payload }) => {
        state.entities = payload.data;
        state.total = payload.totalRecords;
        state.loading = false;
      })
      .addCase(fetchCustomerRegistration.rejected, (state, { payload }) => {
        state.loading = false;
        if (payload !== "Fetch aborted") {
          state.error = payload;
        }
      })

      // Add Customer
      .addCase(addCustomerRegistration.fulfilled, (state, { payload }) => {
        state.entities.push(payload);
        state.total += 1;
      })

      // Update Customer
      .addCase(updateCustomerRegistration.fulfilled, (state, { payload }) => {
        const index = state.entities.findIndex((item) => item.id === payload.id);
        if (index !== -1) state.entities[index] = payload;
      })

      // Delete Customer
      .addCase(deleteCustomerRegistration.fulfilled, (state, { payload }) => {
        state.entities = state.entities.filter((item) => item.id !== payload);
        state.total -= 1;
      })

      // Upload Customer Logo
      .addCase(uploadCustomerLogo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadCustomerLogo.fulfilled, (state, { payload }) => {
        state.loading = false;
        const customer = state.entities.find((item) => item.id === payload.id);
        if (customer) {
          customer.logoUrl = payload.logoUrl;
        }
      })
      .addCase(uploadCustomerLogo.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Upload Project Logo
      .addCase(uploadProjectLogo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProjectLogo.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.entities.forEach((customer) => {
          customer.customerProject.forEach((project) => {
            if (project.id === payload.id) {
              project.imageUrl = payload.logoUrl;
            }
          });
        });
      })
      .addCase(uploadProjectLogo.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default customerRegistrationSlice.reducer;
