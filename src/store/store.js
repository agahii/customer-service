// src/store/store.js

import { configureStore } from "@reduxjs/toolkit";
import customerRegistrationReducer from "./reducers/CustomerRegistration/CustomerRegistrationSlice";
import tenantRegistrationReducer from "./reducers/TenantRegistration/TenantRegistrationSlice";
import industryRegistrationReducer from "./reducers/IndustryRegistration/IndustryRegistrationSlice";
import employeeRegistrationReducer from "./reducers/EmployeeRegistration/EmployeeRegistrationSlice";
import questionnaireReducer from "./reducers/Questionnaire/QuestionnaireSlice"; // Import Questionnaire reducer

const store = configureStore({
  reducer: {
    tenantRegistration: tenantRegistrationReducer,
    industryRegistration: industryRegistrationReducer,
    customerRegistration: customerRegistrationReducer,
    employeeRegistration: employeeRegistrationReducer,
    questionnaire: questionnaireReducer, // Add to store
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
