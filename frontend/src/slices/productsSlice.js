import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    products: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    columns:['Nome','Categoria','Informação', 'Preço','Data / Hora', 'Criador','Reposição','Stock'],
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
        clearProducts: (state) => {
            state.products = [];
        },
        setColumns: (state, action) =>{
            state.columns = action.payload;
        }
    }
})

export const { setProducts, setStatus, setError, clearProducts, setColumns } = productsSlice.actions;

export default productsSlice.reducer;
