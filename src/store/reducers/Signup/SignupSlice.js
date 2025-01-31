import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fake API request simulation
export const registerUser = createAsyncThunk("auth/registerUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await new Promise((resolve) =>
      setTimeout(() => resolve({ data: { success: true, user: userData } }), 1000)
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Signup failed");
  }
});

const signInSlice = createSlice({
  name: "signIn",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default signInSlice.reducer;
