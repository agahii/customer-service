// src/store/store.js

import { configureStore } from "@reduxjs/toolkit";
import customerRegistrationReducer from "./reducers/CustomerRegistration/CustomerRegistrationSlice";
import industryRegistrationReducer from "./reducers/IndustryRegistration/IndustryRegistrationSlice";
import employeeRegistrationReducer from "./reducers/EmployeeRegistration/EmployeeRegistrationSlice";
import questionnaireReducer from "./reducers/Questionnaire/QuestionnaireSlice";
import questionTypeReducer from "./reducers/QuestionType/QuestionTypeSlice";
import homeReducer from "./reducers/Home/HomeSlice"; // Import the Home reducer

const store = configureStore({
  reducer: {
    industryRegistration: industryRegistrationReducer,
    customerRegistration: customerRegistrationReducer,
    employeeRegistration: employeeRegistrationReducer,
    questionnaire: questionnaireReducer,
    questionType: questionTypeReducer,
    home: homeReducer, // Add Home to the store
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
