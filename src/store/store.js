// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import customerRegistrationReducer from "./reducers/CustomerRegistration/CustomerRegistrationSlice";
import tenantRegistrationReducer from "./reducers/TenantRegistration/TenantRegistrationSlice";
import industryRegistrationReducer from "./reducers/IndustryRegistration/IndustryRegistrationSlice";
import employeeRegistrationReducer from "./reducers/EmployeeRegistration/EmployeeRegistrationSlice"; // Ensure this import

const store = configureStore({
  reducer: {
    tenantRegistration: tenantRegistrationReducer,
    industryRegistration: industryRegistrationReducer,
    customerRegistration: customerRegistrationReducer,
    employeeRegistration: employeeRegistrationReducer, // Ensure this is included
  },
  devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools in development
});

export default store;
