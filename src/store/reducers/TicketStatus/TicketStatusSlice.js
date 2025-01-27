// src/store/reducers/QuestionType/QuestionTypeSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchTicketStatus } from "./TicketStatusAction";

const ticketStatusSlice = createSlice({
  name: "ticketStatus",
  initialState: {
    entities: [], // will store the array of question types
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTicketStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTicketStatus.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.entities = payload; // set the array of question types
      })
      .addCase(fetchTicketStatus.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default ticketStatusSlice.reducer;
