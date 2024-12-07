// IndustryRegistrationSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
    addIndustryRegistration,
    fetchIndustry,
    updateIndustryRegistration,
    deleteIndustryRegistration,
} from "./IndustryRegistrationAction";

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
            // Fetch Industries
            .addCase(fetchIndustry.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchIndustry.fulfilled, (state, { payload }) => {
                state.entities = payload.data;
                state.total = payload.totalRecords;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchIndustry.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add Industry
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
            })

            // Update Industry
            .addCase(updateIndustryRegistration.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateIndustryRegistration.fulfilled, (state, { payload }) => {
                const index = state.entities.findIndex((item) => item.id === payload.id);
                if (index !== -1) {
                    state.entities[index] = payload;
                }
                state.loading = false;
                state.error = null;
            })
            .addCase(updateIndustryRegistration.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })

            // Delete Industry
            .addCase(deleteIndustryRegistration.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteIndustryRegistration.fulfilled, (state, { payload }) => {
                state.entities = state.entities.filter((item) => item.id !== payload);
                state.loading = false;
                state.error = null;
            })
            .addCase(deleteIndustryRegistration.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });
    },
});

export default industryRegistrationSlice.reducer;
