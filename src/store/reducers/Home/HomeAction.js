// src/store/reducers/Home/HomeAction.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../../utills/services"; // Verify this path points to your services file

// Fetch customers (assumed API endpoint)
export const fetchCustomers = createAsyncThunk(
  "home/fetchCustomers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("Customer/GetAll"); // Adjust endpoint if needed
      if (response.data && Array.isArray(response.data.customers)) {
        return response.data.customers;
      } else {
        return rejectWithValue("No customers found.");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Fetching customers failed."
      );
    }
  }
);



export const submitQuestionnairexxxxxx = createAsyncThunk(
  "questionnaire/submitQuestionnaire",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await API.post("Answer/Add", payload); // Ensure the endpoint is correct
      if (response.data.status === 0) {
        return response.data; // Adjust based on API response
      } else {
        return rejectWithValue(response.data.reasonPhrase || "Submission failed.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.reasonPhrase || "Submission failed.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const submitQuestionnaire = createAsyncThunk(
  "questionnaire/submitQuestionnaire",
  async (payload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("FK_CustomerProject_ID", payload.fK_CustomerProject_ID);

      payload.answerDetailInp.forEach((answer, index) => {
        formData.append(
          `AnswerDetailInp[${index}].QuestionText`,
          answer.questionText
        );
        formData.append(
          `AnswerDetailInp[${index}].AnswerText`,
          answer.answerText || null
        );

        if (answer.answerImageInp && answer.answerImageInp.length > 0) {
          answer.answerImageInp.forEach((image, imgIndex) => {
            if (image.files) {
              formData.append(
                `AnswerDetailInp[${index}].AnswerImageInp[${imgIndex}].files`,
                image.files
              );
            }
            formData.append(
              `AnswerDetailInp[${index}].AnswerImageInp[${imgIndex}].ImageUrl`,
              image.imageUrl || ""
            );
          });
        }
      });

      const response = await API.post("Answer/Add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.responseCode === 1000 && response.data.message === "") {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || "Submission failed.");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Submission failed.");
    }
  }
);








// Fetch customer projects given a customer id
export const fetchCustomerProjects = createAsyncThunk(
  "home/fetchCustomerProjects",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await API.get(`Customer/GetProjects?customerId=${customerId}`); // Adjust endpoint as needed
      if (response.data && Array.isArray(response.data.projects)) {
        return response.data.projects;
      } else {
        return rejectWithValue("No projects found for this customer.");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Fetching customer projects failed."
      );
    }
  }
);
