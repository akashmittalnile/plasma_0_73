import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const initialState = {
    updateCourse: {},
};

const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {
        reloadCourse(state, { payload }) {
            // reloadcourse(state, { payload }) {

            return {
                ...state,

                updateCourse: JSON.parse(JSON.stringify({
                    update: true
                }))
            }

        }
    },

});


export const { reloadCourse } = courseSlice.actions;

export default courseSlice.reducer;