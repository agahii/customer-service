import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../../utills/services";

// Fetch industries with FormData parameters
export const fetchIndustry = createAsyncThunk(
  "industry/fetchIndustry",
  async ({ pagingInfo, controller }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      const { skip, take, filter, sort } = pagingInfo;

      formData.append("skip", skip);
      formData.append("take", take);
      formData.append("page", Math.ceil((skip + 1) / take));
      formData.append("pageSize", take);

      // Append filters
      if (filter?.filters?.length) {
        formData.append("filter[logic]", filter.logic);
        filter.filters.forEach((f, idx) => {
          Object.entries(f).forEach(([key, value]) => {
            formData.append(`filter[filters][${idx}][${key}]`, value);
          });
        });
      }

      // Append sorting
      if (sort?.length) {
        sort.forEach(({ field, dir }, idx) => {
          if (field && dir) {
            formData.append(`sort[${idx}][field]`, field);
            formData.append(`sort[${idx}][dir]`, dir);
            formData.append(`sort[${idx}][index]`, idx);
          }
        });
      }

      const response = await API.post("Industry/Get", formData, {
        signal: controller.signal,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Fetching industries failed.");
    }
  }
);

// Create Industry
export const createIndustry = createAsyncThunk(
  "industry/createIndustry",
  async (industryData, { rejectWithValue }) => {
    try {
      const response = await API.post("Industry/Create", industryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create industry.");
    }
  }
);

// Update Industry
export const updateIndustry = createAsyncThunk(
  "industry/updateIndustry",
  async (industryData, { rejectWithValue }) => {
    try {
      const response = await API.put(`Industry/Update/${industryData.id}`, industryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update industry.");
    }
  }
);

// Delete Industry
export const deleteIndustry = createAsyncThunk(
  "industry/deleteIndustry",
  async (industry, { rejectWithValue }) => {
    try {
      await API.delete(`Industry/Delete/${industry.id}`);
      return industry.id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete industry.");
    }
  }
);

// Upload Industry Image
export const uploadIndustryImage = createAsyncThunk(
  "industry/uploadIndustryImage",
  async ({ id, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await API.post(`Industry/UploadImage/${id}`, formData);
      return { id, imageUrl: response.data.imageUrl };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to upload image.");
    }
  }
);

// Industry Slice
const industrySlice = createSlice({
  name: "industry",
  initialState: {
    industries: [],
    totalRecords: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIndustry.pending, (state) => { state.loading = true; })
      .addCase(fetchIndustry.fulfilled, (state, action) => {
        state.loading = false;
        state.industries = action.payload.data;
        state.totalRecords = action.payload.totalRecords;
      })
      .addCase(fetchIndustry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createIndustry.fulfilled, (state, action) => {
        state.industries.push(action.payload);
      })
      .addCase(updateIndustry.fulfilled, (state, action) => {
        state.industries = state.industries.map((industry) =>
          industry.id === action.payload.id ? action.payload : industry
        );
      })
      .addCase(deleteIndustry.fulfilled, (state, action) => {
        state.industries = state.industries.filter((industry) => industry.id !== action.payload);
      })
      .addCase(uploadIndustryImage.fulfilled, (state, action) => {
        const { id, imageUrl } = action.payload;
        const industry = state.industries.find((i) => i.id === id);
        if (industry) industry.image = imageUrl;
      });
  },
});

export default industrySlice.reducer;
