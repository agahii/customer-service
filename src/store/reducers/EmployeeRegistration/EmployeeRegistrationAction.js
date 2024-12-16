// reducers/EmployeeRegistration/EmployeeRegistrationAction.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../../utills/services"; // Using 'utills' with two "l"s

// Add new Employee
export const addEmployeeRegistration = createAsyncThunk(
  "employeeRegistration/addEmployee",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await API.post("Employee/Add", payload);
      console.log("Add Employee API Response:", response.data); // Debugging
      return response.data.data; // Ensure the API returns the new employee under 'data'
    } catch (error) {
      console.error("Add Employee Error:", error.response || error.message || error);
      return rejectWithValue(error.response?.data?.reasonPhrase || "Addition failed.");
    }
  }
);

// Fetch Employees
export const fetchEmployee = createAsyncThunk(
  "employeeRegistration/fetchEmployee",
  async ({ pagingInfo, controller }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("skip", pagingInfo.skip);
      formData.append("take", pagingInfo.take);
      formData.append("page", Math.ceil((pagingInfo.skip + 1) / pagingInfo.take));
      formData.append("pageSize", pagingInfo.take);

      // Append filters if any
      if (pagingInfo.filter && pagingInfo.filter.filters.length > 0) {
        formData.append("filter[logic]", pagingInfo.filter.logic);
        pagingInfo.filter.filters.forEach((filter, index) => {
          formData.append(`filter[filters][${index}][field]`, filter.field);
          formData.append(`filter[filters][${index}][operator]`, filter.operator);
          formData.append(`filter[filters][${index}][value]`, filter.value);
        });
      }

      // Append sorting if any
      if (pagingInfo.sort && pagingInfo.sort.length > 0) {
        pagingInfo.sort.forEach((sort, index) => {
          if (sort.field && sort.dir) {
            formData.append(`sort[${index}][field]`, sort.field);
            formData.append(`sort[${index}][dir]`, sort.dir);
            formData.append(`sort[${index}][index]`, index);
          }
        });
      }

      const response = await API.post("Employee/Get", formData, {
        signal: controller.signal,
      });

      console.log("Fetch Employees API Response:", response.data); // Debugging

      return {
        data: response.data.data || [], // Correctly accessing 'data'
        totalRecords: response.data.data ? response.data.data.length : 0, // Adjusted to match response
      };
    } catch (error) {
      console.error("Fetch Employees Error:", error.response || error.message || error);
      return rejectWithValue(error.response?.data?.reasonPhrase || "Fetching employees failed.");
    }
  }
);

// Update Employee
export const updateEmployeeRegistration = createAsyncThunk(
  "employeeRegistration/updateEmployee",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await API.put("Employee/Update", payload);
      console.log("Update Employee API Response:", response.data); // Debugging
      return response.data.data; // Ensure the API returns the updated employee under 'data'
    } catch (error) {
      console.error("Update Employee Error:", error.response || error.message || error);
      return rejectWithValue(error.response?.data?.reasonPhrase || "Update failed.");
    }
  }
);

// Delete Employee
export const deleteEmployeeRegistration = createAsyncThunk(
  "employeeRegistration/deleteEmployee",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.delete("Employee/Delete", {
        headers: {
          "Content-Type": "application/json",
        },
        data: { id },
      });

      console.log("Delete Employee API Response:", response.data); // Debugging

      if (response.status >= 200 && response.status < 300) {
        return id;
      } else {
        return rejectWithValue(response.data?.reasonPhrase || "Deletion failed.");
      }
    } catch (error) {
      console.error("Delete Employee Error:", error.response || error.message || error);
      return rejectWithValue(error.response?.data?.reasonPhrase || "An error occurred during deletion.");
    }
  }
);
