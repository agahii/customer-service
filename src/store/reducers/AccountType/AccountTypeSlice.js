// features/accountTypeSlice.js
import { createSlice } from "@reduxjs/toolkit";

import { AccountTypeModel } from "../../../utills/services";

const accountTypeSlice = createSlice({
  name: "accountType",
  initialState: {
    accountTypes: AccountTypeModel, // Use the static data
  },
  reducers: {
    // Add reducers if needed for other state manipulations
  },
});

export const selectAccountTypes = (state) => state.accountType.accountTypes;

export default accountTypeSlice.reducer;
