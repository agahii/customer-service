import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../../utills/services";

// Async thunk to fetch ticket statuses
export const fetchticketstatus = createAsyncThunk(
  "status/fetch",
  async (projectId, thunkAPI) => {
    try {
      const response = await API.get("/Answer/Status", {
        params: { projectId },
      });
      
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const statusSlice = createSlice({
  name: "status",
  initialState: {
    statuses: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchticketstatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchticketstatus.fulfilled, (state, action) => {
        state.loading = false;
        state.statuses = action.payload;
      })
      .addCase(fetchticketstatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch statuses";
      });
  },
});

export default statusSlice.reducer;
