import { createSlice } from "@reduxjs/toolkit";
import { addIndustryRegistration } from "./IndustryRegistrationAction";

const industryRegistrationSlice = createSlice({
  name: "industryRegistration",
  initialState: {
    entities: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addIndustryRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addIndustryRegistration.fulfilled, (state, { payload }) => {
        state.entities.push(payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(addIndustryRegistration.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default industryRegistrationSlice.reducer;
