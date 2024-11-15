import { createSlice } from "@reduxjs/toolkit";
import { addEmployeeRegistration } from "./EmployeeRegistrationAction";

const employeeRegistrationSlice = createSlice({
  name: "employeeRegistration",
  initialState: {
    entities: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addEmployeeRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEmployeeRegistration.fulfilled, (state, { payload }) => {
        state.entities.push(payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(addEmployeeRegistration.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default employeeRegistrationSlice.reducer;
