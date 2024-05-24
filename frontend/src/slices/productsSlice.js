import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    products: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    columns: ['Nome', 'Categoria', 'Informação', 'Preço', 'Data / Hora', 'Criador', 'Reposição', 'Stock'],
    filters: false,
    searchName: '',
    searchCategory: '',
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
        resetFilters: (state, action) => {
            state.filters = action.payload;
        },
        setColumns: (state, action) => {
            state.columns = action.payload;
        },
        setSearchName: (state, action) => {
            state.searchName = action.payload;
        },
        setSearchCategory: (state, action) => {
            state.searchCategory = action.payload;
        }
    }
})

export const { setProducts, setStatus, setError, resetFilters, setColumns, setSearchName, setSearchCategory } = productsSlice.actions;

export default productsSlice.reducer;
