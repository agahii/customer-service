// src/store/reducers/TenantRegistration/TenantRegistrationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addTenantRegistration } from "./TenantRegistrationAction";

const tenantRegistrationSlice = createSlice({
  name: "tenantRegistration",
  initialState: {
    entities: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addTenantRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTenantRegistration.fulfilled, (state, { payload }) => {
        state.entities.push(payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(addTenantRegistration.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default tenantRegistrationSlice.reducer;
