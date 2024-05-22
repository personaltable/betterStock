import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'
import productsReducer from './slices/productsSlice'
import {apiSlice} from './slices/apiSlice'

const store = configureStore({
    reducer:{
        auth: authReducer,
        productsList: productsReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
});

export default store