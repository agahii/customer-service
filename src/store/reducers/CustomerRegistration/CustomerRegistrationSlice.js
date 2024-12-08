import { createSlice } from "@reduxjs/toolkit";
import {
  addCustomerRegistration,
  fetchCustomers,
  updateCustomerRegistration,
  deleteCustomerRegistration,
} from "./CustomerRegistrationAction";

const customerRegistrationSlice = createSlice({
  name: "customerRegistration",
  initialState: {
    customers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, { payload }) => {
        state.customers = payload;
        state.loading = false;
      })
      .addCase(fetchCustomers.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(addCustomerRegistration.fulfilled, (state, { payload }) => {
        state.customers.push(payload);
      })
      .addCase(updateCustomerRegistration.fulfilled, (state, { payload }) => {
        const index = state.customers.findIndex((item) => item.id === payload.id);
        if (index !== -1) state.customers[index] = payload;
      })
      .addCase(deleteCustomerRegistration.fulfilled, (state, { payload }) => {
        state.customers = state.customers.filter((item) => item.id !== payload);
      });
  },
});

export default customerRegistrationSlice.reducer;
