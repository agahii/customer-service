// src/store/store.js

import { configureStore } from "@reduxjs/toolkit";
import customerRegistrationReducer from "./reducers/CustomerRegistration/CustomerRegistrationSlice";
import industryRegistrationReducer from "./reducers/IndustryRegistration/IndustryRegistrationSlice";
import employeeRegistrationReducer from "./reducers/EmployeeRegistration/EmployeeRegistrationSlice";
import accountTypeReducer from "./reducers/AccountType/AccountTypeSlice";
import questionnaireReducer from "./reducers/Questionnaire/QuestionnaireSlice";
import questionTypeReducer from "./reducers/QuestionType/QuestionTypeSlice";
import statusReducer from "./reducers/TicketStatus/statusSlice";
import homeReducer from "./reducers/Home/HomeSlice"; // Import the Home reducer
import signInReducer from "./reducers/Signup/SignupSlice";
import loginReducer from "./reducers/Login/LoginSlice";
import industriesReducer from "./reducers/Industries/IndustriesSlice";
// import customersReducer from "./reducers/customer/customerSlice"

const store = configureStore({
  reducer: {
    industryRegistration: industryRegistrationReducer,
    customerRegistration: customerRegistrationReducer,
    employeeRegistration: employeeRegistrationReducer,
    questionnaire: questionnaireReducer,
    questionType: questionTypeReducer,
    status: statusReducer,
    accountType: accountTypeReducer,
    home: homeReducer, // Add Home to the store
    signIn: signInReducer,
    login: loginReducer,
    industry: industriesReducer,
    //customer:customersReducer
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
