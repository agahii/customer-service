import { createSlice } from "@reduxjs/toolkit";
import { addIndustryRegistration,fetchIndustry } from "./IndustryRegistrationAction";

const industryRegistrationSlice = createSlice({
  name: "industryRegistration",
  initialState: {
    entities: [],
    loading: false,
    error: null,
    total: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchIndustry.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchIndustry.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    .addCase(fetchIndustry.fulfilled, (state, { payload }) => {
      state.entities = payload.data;
      state.total = payload.totalRecords;
      state.loading = false;
      state.error = null;
    })



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
