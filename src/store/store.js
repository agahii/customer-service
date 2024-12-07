// store.js
import { configureStore } from '@reduxjs/toolkit';
import tenantRegistrationReducer from './reducers/TenantRegistration/TenantRegistrationSlice';
import industryRegistrationReducer from './reducers/IndustryRegistration/IndustryRegistrationSlice'; // Import Industry Registration Reducer

const store = configureStore({
    reducer: {
        tenantRegistration: tenantRegistrationReducer,
        industryRegistration: industryRegistrationReducer, // Add Industry Registration Reducer
    },
    // Optional: Add middleware or enhancers if needed
});

export default store;
