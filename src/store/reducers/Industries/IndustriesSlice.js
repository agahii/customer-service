import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { saveAs } from "file-saver";

const API_URL = "http://localhost:5045/api/Industry";

export const fetchIndustries = createAsyncThunk(
  "industry/fetchIndustries",
  async (params, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        formData.append('skip', '0');
        formData.append('take', '10');
        formData.append('page', '1');
        formData.append('pageSize', '10');
        
        // Convert FormData to a plain object
        const payload = Object.fromEntries(formData.entries());
        
    console.log(payload +"from slice");
      const response = await axios.post(`${API_URL}/Get`, payload, {
        headers: { 'Content-Type': 'application/json', },
      });
      //return Array.isArray(response.data.data) ? response.data.data : [];
      return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addIndustry = createAsyncThunk(
  "industry/addIndustry",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/Add`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateIndustry = createAsyncThunk(
  "industry/updateIndustry",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/Update/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteIndustry = createAsyncThunk(
  "industry/deleteIndustry",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/Delete/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const downloadIndustries = createAsyncThunk(
  "industry/downloadIndustries",
  async (_, { getState }) => {
    const { industries } = getState().industry;
    const csvData = [
      ["ID", "Industry Type", "Image URL", "Is Active"],
      ...industries.map((ind) => [ind.id, ind.industryType, ind.imageUrl, ind.isActive]),
    ];
    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "industries.csv");
  }
);

const industrySlice = createSlice({
  name: "industry",
  initialState: { industries: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIndustries.fulfilled, (state, action) => {
        state.industries = action.payload;
        console.log(action.payload);
        state.status = "succeeded";
      })
      .addCase(fetchIndustries.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(addIndustry.fulfilled, (state, action) => {
        state.industries.push(action.payload);
      })
      .addCase(updateIndustry.fulfilled, (state, action) => {
        const index = state.industries.findIndex((ind) => ind.id === action.payload.id);
        if (index !== -1) state.industries[index] = action.payload;
      })
      .addCase(deleteIndustry.fulfilled, (state, action) => {
        state.industries = state.industries.filter((ind) => ind.id !== action.payload);
      });
  },
});

export default industrySlice.reducer;