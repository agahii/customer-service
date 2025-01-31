import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchIndustries = createAsyncThunk('industries/fetchIndustries', async () => {
  const response = await axios.get('/api/industries');
  return response.data;
});

export const addIndustry = createAsyncThunk('industries/addIndustry', async (industry) => {
  const response = await axios.post('/api/industries', industry);
  return response.data;
});

export const updateIndustry = createAsyncThunk('industries/updateIndustry', async ({ id, ...industry }) => {
  const response = await axios.put(`/api/industries/${id}`, industry);
  return response.data;
});

export const deleteIndustry = createAsyncThunk('industries/deleteIndustry', async (id) => {
  await axios.delete(`/api/industries/${id}`);
  return id;
});

const industrySlice = createSlice({
  name: 'industry',
  initialState: { industries: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIndustries.fulfilled, (state, action) => {
        state.industries = action.payload;
      })
      .addCase(addIndustry.fulfilled, (state, action) => {
        state.industries.push(action.payload);
      })
      .addCase(updateIndustry.fulfilled, (state, action) => {
        const index = state.industries.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.industries[index] = action.payload;
        }
      })
      .addCase(deleteIndustry.fulfilled, (state, action) => {
        state.industries = state.industries.filter((item) => item.id !== action.payload);
      });
  }
});

export default industrySlice.reducer;
