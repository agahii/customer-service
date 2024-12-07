// IndustryRegistrationAction.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../../utills/services";

// Add new Industry
export const addIndustryRegistration = createAsyncThunk(
    "IndustryRegistration/addIndustry",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await API.post("Industry/Add", payload);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Addition failed.");
        }
    }
);

// Fetch Industries
export const fetchIndustry = createAsyncThunk(
    "industry/fetchIndustry",
    async ({ pagingInfo, controller }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("skip", pagingInfo.skip);
            formData.append("take", pagingInfo.take);
            formData.append("page", Math.ceil((pagingInfo.skip + 1) / pagingInfo.take));
            formData.append("pageSize", pagingInfo.take);

            if (pagingInfo.filter && pagingInfo.filter.filters.length > 0) {
                formData.append("filter[logic]", pagingInfo.filter.logic);
                pagingInfo.filter.filters.forEach((filter, index) => {
                    formData.append(`filter[filters][${index}][field]`, filter.field);
                    formData.append(`filter[filters][${index}][operator]`, filter.operator);
                    formData.append(`filter[filters][${index}][value]`, filter.value);
                });
            }

            if (pagingInfo.sort && pagingInfo.sort.length > 0) {
                pagingInfo.sort.forEach((sort, index) => {
                    if (sort.field && sort.dir) {
                        formData.append(`sort[${index}][field]`, sort.field);
                        formData.append(`sort[${index}][dir]`, sort.dir);
                        formData.append(`sort[${index}][index]`, index);
                    }
                });
            }

            const response = await API.post("Industry/Get", formData, {
                signal: controller.signal,
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Fetching industries failed.");
        }
    }
);

// Update Industry (Use PUT method)
export const updateIndustryRegistration = createAsyncThunk(
    "IndustryRegistration/updateIndustry",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await API.put("Industry/Update", payload);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Update failed.");
        }
    }
);

// Delete Industry (Use DELETE with JSON payload)
export const deleteIndustryRegistration = createAsyncThunk(
    "IndustryRegistration/deleteIndustry",
    async (id, { rejectWithValue }) => {
        try {
            const response = await API.delete("Industry/Delete", {
                headers: {
                    "Content-Type": "application/json",
                },
                data: { id },
            });

            if (response.status >= 200 && response.status < 300) {
                return id;
            } else {
                return rejectWithValue(response.data || "Deletion failed.");
            }
        } catch (error) {
            console.error("Delete Industry Error:", error.response || error.message || error);
            return rejectWithValue(error.response?.data || "An error occurred during deletion.");
        }
    }
);
