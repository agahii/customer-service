// EmployeeRegistrationSlice.js
import { createSlice } from "@reduxjs/toolkit";

import {
  addEmployeeRegistration,
  fetchEmployee,
  updateEmployeeRegistration,
  deleteEmployeeRegistration,
} from "./EmployeeRegistrationAction";





const employeeRegistrationSlice = createSlice({
  name: "employeeRegistration",
  initialState: {
    entities: [],
    loading: false,
    error: null,
    total: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Employees
      .addCase(fetchEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployee.fulfilled, (state, { payload }) => {
        console.log("Fetched Employees Payload:", payload); // Debugging
        state.entities = payload.data;
        state.total = payload.totalRecords;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchEmployee.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Add Employee
      .addCase(addEmployeeRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEmployeeRegistration.fulfilled, (state, { payload }) => {
        state.entities.push(payload);
        state.total += 1; // Increment total records
        state.loading = false;
        state.error = null;
      })
      .addCase(addEmployeeRegistration.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Update Employee
      .addCase(updateEmployeeRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployeeRegistration.fulfilled, (state, { payload }) => {
        const index = state.entities.findIndex((item) => item.id === payload.id);
        if (index !== -1) {
          state.entities[index] = payload;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(updateEmployeeRegistration.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Delete Employee
      .addCase(deleteEmployeeRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployeeRegistration.fulfilled, (state, { payload }) => {
        state.entities = state.entities.filter((item) => item.id !== payload);
        state.total -= 1; // Decrement total records
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteEmployeeRegistration.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default employeeRegistrationSlice.reducer;
