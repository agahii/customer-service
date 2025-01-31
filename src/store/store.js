// src/store/store.js

import { configureStore } from "@reduxjs/toolkit";
import customerRegistrationReducer from "./reducers/CustomerRegistration/CustomerRegistrationSlice";
import industryRegistrationReducer from "./reducers/IndustryRegistration/IndustryRegistrationSlice";
import employeeRegistrationReducer from "./reducers/EmployeeRegistration/EmployeeRegistrationSlice";
import accountTypeReducer from "./reducers/AccountType/AccountTypeSlice"
import questionnaireReducer from "./reducers/Questionnaire/QuestionnaireSlice";
import questionTypeReducer from "./reducers/QuestionType/QuestionTypeSlice";
import ticketStatusReducer from "./reducers/TicketStatus/TicketStatusSlice";
import homeReducer from "./reducers/Home/HomeSlice"; // Import the Home reducer
import signInReducer from "./reducers/Signup/SignupSlice";
import loginReducer from "./reducers/Login/LoginSlice";
import industriesReducer from "./reducers/Industries/IndustriesSlice"
const store = configureStore({
  reducer: {
    industryRegistration: industryRegistrationReducer,
    customerRegistration: customerRegistrationReducer,
    employeeRegistration: employeeRegistrationReducer,
    questionnaire: questionnaireReducer,
    questionType: questionTypeReducer,
    ticketStatusType:ticketStatusReducer,
    accountType: accountTypeReducer,
    home: homeReducer, // Add Home to the store
    signIn:signInReducer,
    login:loginReducer,
    industry:industriesReducer
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
