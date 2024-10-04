import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const initialState = {
    updateCommunity: {},
};

 const communitySlice = createSlice({
    name: 'community',
    initialState,
    reducers: {
        reloadCommunity(state, { payload }) {
        // reloadCommunity(state, { payload }) {

            return {
                ...state,

                updateCommunity: JSON.parse(JSON.stringify({
                update: true
            }))
        }

        }
    },
   
});


export const { reloadCommunity } = communitySlice.actions;

export default communitySlice.reducer;