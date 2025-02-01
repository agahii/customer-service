







import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API } from "../../../utills/services";
const API_URL = 'https://your-api-endpoint.com';

// Fetch industries with search and pagination (POST request with parameters)
export const fetchIndustries = createAsyncThunk(
  'industry/fetchIndustries',
  async ({ skip, take, page,pageSize,caseSensitive, filters = {} }, { rejectWithValue }) => {
    try {
      const requestBody = {
        skip,
        take,
        page,
        pageSize,
        caseSensitive,
        ...filters,
      };
      const response = await API.post("Industry/Get", {requestBody});
      //console.log(response.data+"requestBody")
      return response.data;
      
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Create industry
export const createIndustry = createAsyncThunk(
  'industry/createIndustry',
  async (data, { rejectWithValue }) => {
    try {
      const response = await API.post("Industry/Add", data);
      return response.data;
    } catch (error) {
      
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Update industry (excluding image update)
export const updateIndustry = createAsyncThunk(
  'industry/updateIndustry',
  async (data, { rejectWithValue }) => {
    try {
      const response = await API.put("Industry/Update", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Delete industry (full object reference)
export const deleteIndustry = createAsyncThunk(
  'industry/deleteIndustry',
  async (id, { rejectWithValue }) => {
    try {
      console.log(id +"delete slice")
      await API.delete("Industry/Delete",{
        data:{id}
      });
      return industry;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Upload industry image (only from view page)
export const uploadIndustryImage = createAsyncThunk(
  'industry/uploadIndustryImage',
  async ({ id, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('ID', id);
      formData.append('files', file);
      const response = await axios.post(`${API_URL}/industries/upload`, formData);
      return { id, imageUrl: response.data.url };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

const industrySlice = createSlice({
  name: 'industry',
  initialState: {
    industries: [],
    totalRecords: 0,
    pageSize: 0,
    pageIndex: 0,
    totalRecordsInResponse: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIndustries.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchIndustries.fulfilled, (state, action) => {
        state.industries = action.payload.data;
        state.totalRecords = action.payload.totalRecords;
        state.pageSize = action.payload.pageSize;
        state.pageIndex = action.payload.pageIndex;
        state.totalRecordsInResponse = action.payload.totalRecordsInResponse;
        state.loading = false;
      })
      .addCase(fetchIndustries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createIndustry.fulfilled, (state, action) => {
        state.industries.push(action.payload);
      })
      .addCase(createIndustry.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateIndustry.fulfilled, (state, action) => {
        const index = state.industries.findIndex((ind) => ind.id === action.payload.id);
        if (index !== -1) state.industries[index] = action.payload;
      })
      .addCase(updateIndustry.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteIndustry.fulfilled, (state, action) => {
        state.industries = state.industries.filter((ind) => ind.id !== action.payload.id);
      })
      .addCase(deleteIndustry.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(uploadIndustryImage.fulfilled, (state, action) => {
        const index = state.industries.findIndex((ind) => ind.id === action.payload.id);
        if (index !== -1) state.industries[index].image = action.payload.imageUrl;
      })
      .addCase(uploadIndustryImage.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export default industrySlice.reducer;
