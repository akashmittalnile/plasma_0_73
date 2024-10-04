import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const initialState = {
    msgUnseenDataObj: {},
};

const unseenMessageCountSlice = createSlice({
    name: 'msgUnseenData',
    initialState,
    reducers: {
        setMsgUnseenData(state, { payload }) {
            // reloadCommunity(state, { payload }) {

            return {
                ...state,

                msgUnseenDataObj: payload
            }

        }
    },

});


export const { setMsgUnseenData } = unseenMessageCountSlice.actions;

export default unseenMessageCountSlice.reducer;