import { createAsyncThunk } from "@reduxjs/toolkit";
import {API} from "../../../utills/services";

export const addTenantRegistration = createAsyncThunk(
    "TenantRegistration/addTenant",
    async (payload, { rejectWithValue }) => {
      try {
        const response = await API.post(`TenantRegistration/Add`, payload);
        return response.data.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
