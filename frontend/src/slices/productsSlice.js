import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    products: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    sortDirection: 'desc' // 'asc' | 'desc'
}

const productsSlice = createSlice({
    name: 'productsList',
    initialState,
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        setStatus: (state, action) => {
            state.status = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        sortProducts: (state) => {
            state.products.sort((a, b) => {
                if (state.sortDirection === 'asc') {
                    return a.name.localeCompare(b.name)
                } else {
                    return b.name.localeCompare(a.name)
                }
            });
            state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
        },
        clearProducts: (state) => {
            state.products = [];
        }
    }
})

export const { setProducts, setStatus, setError, sortProducts, clearProducts } = productsSlice.actions;

export default productsSlice.reducer;
