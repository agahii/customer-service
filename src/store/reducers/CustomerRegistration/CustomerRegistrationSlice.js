// src/store/reducers/CustomerRegistration/CustomerRegistrationSlice.js

import { createSlice } from "@reduxjs/toolkit";
import {
  addCustomerRegistration,
  fetchCustomerRegistration,
  updateCustomerRegistration,
  deleteCustomerRegistration,
} from "./CustomerRegistrationAction";

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
        if (payload !== 'Fetch aborted') {
          state.error = payload;
        }
        // If payload is 'Fetch aborted', do not set the error
      })

      // Add Customer
      .addCase(addCustomerRegistration.fulfilled, (state, { payload }) => {
        state.entities.push(payload);
        state.total += 1; // Increment total records
      })

      // Update Customer
      .addCase(updateCustomerRegistration.fulfilled, (state, { payload }) => {
        const index = state.entities.findIndex((item) => item.id === payload.id);
        if (index !== -1) state.entities[index] = payload;
      })

      // Delete Customer
      .addCase(deleteCustomerRegistration.fulfilled, (state, { payload }) => {
        state.entities = state.entities.filter((item) => item.id !== payload);
        state.total -= 1; // Decrement total records
      });
  },
});

export default customerRegistrationSlice.reducer;
