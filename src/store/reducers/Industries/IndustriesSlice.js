// industryRegistrationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../../utills/services";

const initialState = {
    entities: [],
    loading: false,
    error: null,
    total: 0,
};

const handleError = (error, defaultMessage) => error.response?.data || defaultMessage;

export const addIndustryRegistration = createAsyncThunk(
    "IndustryRegistration/addIndustry",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await API.post("Industry/Add", payload);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(handleError(error, "Addition failed."));
        }
    }
);

// export const fetchIndustry = createAsyncThunk(
//     "industry/fetchIndustry",
//     async ({ pagingInfo, controller }, { rejectWithValue }) => {
//         try {
//             const formData = new FormData();
//             formData.append("skip", pagingInfo.skip);
//             formData.append("take", pagingInfo.take);
//             formData.append("page", Math.ceil((pagingInfo.skip + 1) / pagingInfo.take));
//             formData.append("pageSize", pagingInfo.take);


//             pagingInfo.filter?.filters?.forEach((filter, index) => {
//                 formData.append(`filter[filters][${index}][field]`, filter.field);
//                 formData.append(`filter[filters][${index}][operator]`, filter.operator);
//                 formData.append(`filter[filters][${index}][value]`, filter.value);
//             });

//             pagingInfo.sort?.forEach((sort, index) => {
//                 if (sort.field && sort.dir) {
//                     formData.append(`sort[${index}][field]`, sort.field);
//                     formData.append(`sort[${index}][dir]`, sort.dir);
//                     formData.append(`sort[${index}][index]`, index);
//                 }
//             });

//             const response = await API.post("Industry/Get", formData, { signal: controller.signal });
//             return response.data;
//         } catch (error) {
//             return rejectWithValue(handleError(error, "Fetching industries failed."));
//         }
//     }
// );
export const fetchIndustry = createAsyncThunk(
  "industry/fetchIndustry",
  async ({ pagingInfo, controller, search }, { rejectWithValue }) => {
      try {
          const formData = new FormData();
          formData.append("skip", pagingInfo.skip);
          formData.append("take", pagingInfo.take);
          formData.append("page", Math.ceil((pagingInfo.skip + 1) / pagingInfo.take));
          formData.append("pageSize", pagingInfo.take);

          // Add search parameter
          if (search) {
              formData.append("search", search);
          }

          pagingInfo.filter?.filters?.forEach((filter, index) => {
              formData.append(`filter[filters][${index}][field]`, filter.field);
              formData.append(`filter[filters][${index}][operator]`, filter.operator);
              formData.append(`filter[filters][${index}][value]`, filter.value);
          });

          pagingInfo.sort?.forEach((sort, index) => {
              if (sort.field && sort.dir) {
                  formData.append(`sort[${index}][field]`, sort.field);
                  formData.append(`sort[${index}][dir]`, sort.dir);
                  formData.append(`sort[${index}][index]`, index);
              }
          });

          const response = await API.post("Industry/Get", formData, { signal: controller.signal });
          return response.data;
      } catch (error) {
          return rejectWithValue(handleError(error, "Fetching industries failed."));
      }
  }
);

export const updateIndustryRegistration = createAsyncThunk(
    "IndustryRegistration/updateIndustry",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await API.put("Industry/Update", payload);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(handleError(error, "Update failed."));
        }
    }
);

export const deleteIndustryRegistration = createAsyncThunk(
    "IndustryRegistration/deleteIndustry",
    async (id, { rejectWithValue }) => {
        try {
            const response = await API.delete("Industry/Delete", {
                headers: { "Content-Type": "application/json" },
                data: { id },
            });

            return response.status >= 200 && response.status < 300 ? id : rejectWithValue(response.data || "Deletion failed.");
        } catch (error) {
            return rejectWithValue(handleError(error, "An error occurred during deletion."));
        }
    }
);

export const uploadIndustryLogo = createAsyncThunk(
  "industry/uploadIndustryLogo",
  async ({ id, file }, { rejectWithValue }) => {
      const formData = new FormData();
      formData.append("ID", id);
      formData.append("files", file);

      try {
          // Make API call to upload the logo
          const response = await API.post(`/Industry/AddIndustryImageAsync`, formData, {
              headers: {
                  "Content-Type": "multipart/form-data",
              },
          });

          // Return the response data which might include the updated image URL
          return response.data;
      } catch (error) {
          // Handle the error and return the error message
          return rejectWithValue(error.message);
      }
  }
);



const industryRegistrationSlice = createSlice({
    name: "industryRegistration",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchIndustry.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchIndustry.fulfilled, (state, { payload }) => {
                Object.assign(state, {
                    entities: payload.data,
                    total: payload.totalRecords,
                    loading: false,
                    error: null,
                });
            })
            .addCase(fetchIndustry.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            .addCase(addIndustryRegistration.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addIndustryRegistration.fulfilled, (state, { payload }) => {
                state.entities.push(payload);
                state.loading = false;
                state.error = null;
            })
            .addCase(addIndustryRegistration.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            .addCase(updateIndustryRegistration.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateIndustryRegistration.fulfilled, (state, { payload }) => {
                const index = state.entities.findIndex(({ id }) => id === payload.id);
                if (index !== -1) state.entities[index] = payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(updateIndustryRegistration.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            .addCase(deleteIndustryRegistration.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteIndustryRegistration.fulfilled, (state, { payload }) => {
                state.entities = state.entities.filter(({ id }) => id !== payload);
                state.loading = false;
                state.error = null;
            })
            .addCase(deleteIndustryRegistration.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            
            .addCase(uploadIndustryLogo.pending, (state) => {
              state.loading = true;
          })
          .addCase(uploadIndustryLogo.fulfilled, (state, action) => {
              state.loading = false;
              // Assuming the uploaded logo's data (image URL) is returned from the API
              // You can update the state to include the new image URL in the appropriate place
              // For example, updating the specific entity with the new logo URL
              const updatedEntities = state.entities.map((entity) =>
                  entity.id === action.payload.id
                      ? { ...entity, logoUrl: action.payload.logoUrl } // Assuming `logoUrl` is returned
                      : entity
              );
              state.entities = updatedEntities;
          })
          .addCase(uploadIndustryLogo.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
          });
            
    },
});

export default industryRegistrationSlice.reducer;
