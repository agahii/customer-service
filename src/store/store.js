import { configureStore } from '@reduxjs/toolkit';
import tenantRegistrationReducer from './reducers/TenantRegistration/TenantRegistrationSlice';
import industryRegistrationReducer from './reducers/IndustryRegistration/IndustryRegistrationSlice'; // Add this import

const store = configureStore({
  reducer: {
    tenantRegistration: tenantRegistrationReducer,
    industryRegistration: industryRegistrationReducer, // Add this line
  },
});

export default store;
