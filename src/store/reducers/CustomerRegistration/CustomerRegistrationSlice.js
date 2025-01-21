// src/store/reducers/CustomerRegistration/CustomerRegistrationSlice.js

import { createSlice } from "@reduxjs/toolkit";
import {
  addCustomerRegistration,
  fetchCustomerRegistration,
  updateCustomerRegistration,
  deleteCustomerRegistration,
  uploadCustomerLogo,
  uploadProjectLogo,
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
      })


      .addCase(uploadCustomerLogo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadCustomerLogo.fulfilled, (state, { payload }) => {
        state.loading = false;
        const customer = state.entities.find((item) => item.id === payload.id);
        if (customer) {
          customer.logoUrl = payload.logoUrl; // Update logo URL
        }
      })
      .addCase(uploadCustomerLogo.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      
      .addCase(uploadProjectLogo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProjectLogo.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.entities.forEach((customer) => {
          customer.customerProject.forEach((project) => {
            if (project.id === payload.id) {
              project.imageUrl = payload.logoUrl; // Update the project logo URL
            }
          });
        });
      })
      .addCase(uploadProjectLogo.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      
      ;
      
  },
});

export default customerRegistrationSlice.reducer;
