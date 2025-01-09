// src/store/reducers/Home/HomeSlice.js

import { createSlice } from "@reduxjs/toolkit";
import {
  fetchIndustries,
  fetchCustomerProjects,
  fetchQuestionnaireByProjectId,
} from "./HomeAction";

const homeSlice = createSlice({
  name: "home",
  initialState: {
    industries: [],
    customerProjects: [],
    loadingIndustries: false,
    loadingCustomerProjects: false,
    loadingQuestionnaire: false,
    errorIndustries: null,
    errorCustomerProjects: null,
    errorQuestionnaire: null,
    selectedIndustry: null, // Holds the selected industry
    selectedProject: null,  // Holds the selected project
    fetchedQuestionnaire: [], // Holds the fetched questionnaire
  },
  reducers: {
    setSelectedIndustry: (state, action) => {
      state.selectedIndustry = action.payload;
      state.selectedProject = null; // Clear selected project when a new industry is selected
      state.fetchedQuestionnaire = []; // Clear fetched questionnaire
    },
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload;
      state.fetchedQuestionnaire = []; // Clear previous questionnaire
    },
    clearSelections: (state) => {
      state.selectedIndustry = null;
      state.selectedProject = null;
      state.fetchedQuestionnaire = [];
      state.errorQuestionnaire = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Industries
      .addCase(fetchIndustries.pending, (state) => {
        state.loadingIndustries = true;
        state.errorIndustries = null;
      })
      .addCase(fetchIndustries.fulfilled, (state, action) => {
        state.loadingIndustries = false;
        state.industries = action.payload;
      })
      .addCase(fetchIndustries.rejected, (state, action) => {
        state.loadingIndustries = false;
        state.errorIndustries = action.payload;
      })

      // Fetch Customer Projects
      .addCase(fetchCustomerProjects.pending, (state) => {
        state.loadingCustomerProjects = true;
        state.errorCustomerProjects = null;
      })
      .addCase(fetchCustomerProjects.fulfilled, (state, action) => {
        state.loadingCustomerProjects = false;
        state.customerProjects = action.payload;
      })
      .addCase(fetchCustomerProjects.rejected, (state, action) => {
        state.loadingCustomerProjects = false;
        state.errorCustomerProjects = action.payload;
      })

      // Fetch Questionnaire by Project ID
      .addCase(fetchQuestionnaireByProjectId.pending, (state) => {
        state.loadingQuestionnaire = true;
        state.errorQuestionnaire = null;
      })
      .addCase(fetchQuestionnaireByProjectId.fulfilled, (state, action) => {
        state.loadingQuestionnaire = false;
        state.fetchedQuestionnaire = action.payload;
      })
      .addCase(fetchQuestionnaireByProjectId.rejected, (state, action) => {
        state.loadingQuestionnaire = false;
        state.errorQuestionnaire = action.payload;
      });
  },
});

export const { setSelectedIndustry, setSelectedProject, clearSelections } = homeSlice.actions;

export default homeSlice.reducer;
