import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// import axios from 'axios'

const initialState = {
    cartData: {},
    cartItems: [],
    isLoading: false,
    hasError: null,
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart(state, { payload }) {

            if (!(payload.data)) {

                return {
                    ...state,
                    cartData: {},
                    cartItems: []
                }
            }

            console.log("createSlice setCart", payload?.data, state);

            return {
                ...state,
                cartData: payload?.data,
                cartItems: payload?.data?.items
            };
        },
        emptyCart(state, { payload }) {

            // console.log("cart is empty");

            return {
                ...state,
                cartData: {},
                cartItems: []
            }

        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.pending, (state) => {
                state.isLoading = true;
                state.hasError = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems.push(action.payload); // Add response data to cart
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = action.error.message;
            });
    },
});

export const { setCart, emptyCart } = cartSlice.actions;

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async (data) => {
        const formData = new FormData();
        formData.append('id', data.id);
        formData.append('type', data.type);

        // const response = await axios.post(
        //     'https://www.niletechinnovations.com/projects/plasmapen/api/add-cart',
        //     formData,
        //     {
        //         headers: {
        //             'Content-Type': 'multipart/form-data',
        //         },
        //     }
        // );

        // console.log("response.data", response.data);

        // return response.data; // Replace with actual response data structure
    }
);

const api = createApi({
    reducerPath: 'cartApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://www.niletechinnovations.com/projects/plasmapen/api/' }),
    endpoints: (builder) => ({
        addToCart: builder.mutation({
            query: addToCart,
        }),
    }),
});

export const selectCartItems = (state) => state.cart.cartItems;
export const selectIsLoading = (state) => state.cart.isLoading;
export const selectHasError = (state) => state.cart.hasError;

export default cartSlice.reducer;

export const useAddToCartMutation = api.endpoints;
