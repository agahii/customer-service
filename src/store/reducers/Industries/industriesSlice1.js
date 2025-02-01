// industrySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API } from "../../../utills/services";

//const API_URL = 'https://your-api-endpoint.com';

// Fetch industries with search and pagination (POST request with parameters)
export const fetchIndustries = createAsyncThunk('industry/fetchIndustries', async (params) => {
  const response = await axios.post(`${API_URL}/industries`, params);
  return response.data;
});

// Create industry
export const createIndustry = createAsyncThunk('industry/createIndustry', async (data) => {
  const response = await axios.post(`${API_URL}/industries/create`, data);
  return response.data;
});

// Update industry (excluding image update)
export const updateIndustry = createAsyncThunk('industry/updateIndustry', async ({ id, data }) => {
  const response = await axios.put(`${API_URL}/industries/update/${id}`, data);
  return response.data;
});

// Delete industry (full object reference)
export const deleteIndustry = createAsyncThunk('industry/deleteIndustry', async (industry) => {
  await axios.delete(`${API_URL}/industries/delete/${industry.id}`);
  return industry;
});

// Upload industry image (only from view page)
export const uploadIndustryImage = createAsyncThunk('industry/uploadIndustryImage', async ({ id, file }) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${API_URL}/industries/${id}/upload`, formData);
  return { id, imageUrl: response.data.url };
});

const industrySlice = createSlice({
  name: 'industry',
  initialState: {
    industries: [],
    totalRecords: 0,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIndustries.pending, (state) => { state.loading = true; })
      .addCase(fetchIndustries.fulfilled, (state, action) => {
        state.industries = action.payload.data;
        state.totalRecords = action.payload.totalRecords;
        state.loading = false;
      })
      .addCase(createIndustry.fulfilled, (state, action) => {
        state.industries.push(action.payload);
      })
      .addCase(updateIndustry.fulfilled, (state, action) => {
        const index = state.industries.findIndex((ind) => ind.id === action.payload.id);
        if (index !== -1) state.industries[index] = action.payload;
      })
      .addCase(deleteIndustry.fulfilled, (state, action) => {
        state.industries = state.industries.filter((ind) => ind.id !== action.payload.id);
      })
      .addCase(uploadIndustryImage.fulfilled, (state, action) => {
        const index = state.industries.findIndex((ind) => ind.id === action.payload.id);
        if (index !== -1) state.industries[index].image = action.payload.imageUrl;
      });
  }
});

export default industrySlice.reducer;
