import { configureStore } from "@reduxjs/toolkit";
import customerRegistrationReducer from "./reducers/CustomerRegistration/CustomerRegistrationSlice";
import tenantRegistrationReducer from "./reducers/TenantRegistration/TenantRegistrationSlice";
import industryRegistrationReducer from "./reducers/IndustryRegistration/IndustryRegistrationSlice";

const store = configureStore({
  reducer: {
    tenantRegistration: tenantRegistrationReducer,
    industryRegistration: industryRegistrationReducer,
    customerRegistration: customerRegistrationReducer, // Add CustomerRegistration reducer
  },
});

export default store;
