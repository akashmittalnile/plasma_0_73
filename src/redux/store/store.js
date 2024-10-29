// import { createStore, combineReducers, applyMiddleware } from "redux";
import common_reducer from "../reducerd/common_reducer";
import user_reducer from "../reducerd/user_reducer";
import afterSignup from "../reducerd/afterSignup";
import latLong_reducer from "../reducerd/latLong_reducer";
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../reduxSlices/cartSlice'
import communitySlice from "../reduxSlices/communitySlice";
import courseSlice from "../reduxSlices/courseSlice";
import unseenMessageCountSlice from "../reduxSlices/unseenMessageCountSlice";

// import thunk from 'redux-thunk';

// const reducer = combineReducers({
//   common : common_reducer,
//   user : user_reducer,
//   maplocation : latLong_reducer
//   })



// const store = createStore(reducer);
const store = configureStore({
  reducer: {
    common: common_reducer,
    user: user_reducer,
    maplocation: latLong_reducer,
    afterSignup: afterSignup,
    cart: cartReducer,
    community: communitySlice,
    course: courseSlice,
    unseenMessageCount: unseenMessageCountSlice

  },
});


export default store;





