import { configureStore } from '@reduxjs/toolkit';
import tenantRegistrationReducer from './reducers/TenantRegistration/TenantRegistrationSlice'; // Adjust this path

const store = configureStore({
  reducer: {
    tenantRegistration: tenantRegistrationReducer,
  },
});

export default store;