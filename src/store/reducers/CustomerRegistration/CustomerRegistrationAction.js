import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../../utills/services";

// Add Customer
export const addCustomerRegistration = createAsyncThunk(
  "customer/add",
  async (payload, { rejectWithValue }) => {
    try {
    

      const response = await API.post("Customer/Add", payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.reasonPhrase || "Failed to add customer."
      );
    }
  }
);

// Fetch Customers
export const fetchCustomers = createAsyncThunk(
  "customer/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const payload = { skip: 0, take: 10 }; // Default pagination payload
      const response = await API.post("Customer/Get", payload);
      return response.data.value; // Ensure 'value' matches API response key
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.reasonPhrase || "Failed to fetch customers."
      );
    }
  }
);

// Update Customer
export const updateCustomerRegistration = createAsyncThunk(
  "customer/update",
  async (payload, { rejectWithValue }) => {
    try {
      const finalPayload = {
        id: payload.id,
        customerName: payload.customerName,
        customerProject: payload.customerProject?.map((project) => ({
          projectName: project.projectName,
          fK_Employee_ID: project.agentId,
        })),
      };

      const response = await API.put("Customer/Update", finalPayload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.reasonPhrase || "Failed to update customer."
      );
    }
  }
);

// Delete Customer
export const deleteCustomerRegistration = createAsyncThunk(
  "customer/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete("Customer/Delete", { data: { id } });
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.reasonPhrase || "Failed to delete customer."
      );
    }
  }
);
