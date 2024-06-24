import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    products: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    columns: ['Nome', 'Categoria', 'Informação', 'Preço', 'Data / Hora', 'Criador', 'Reposição', 'Stock'],
    filters: false,
    searchName: '',
    searchStock: { stockChoice: 'Exato', stockInput: undefined, stockSecondInput: undefined },
    searchCategory: '',
    searchUser: '',
    searchPrice: '',
    searchDate: {
        startDate: null,
        endDate: null,
    },
    searchReStock: '',
    deleteList: [],
    editProduct: {},
    deleteConfirmation: false,
    formFeedback: '',
    printStockTable: false,
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
            state.filters = false;
            if (action.payload) {
                state.searchName = '';
                state.searchCategory = '';
                state.searchUser = '';
                state.searchPrice = '';
                state.searchDate = {
                    startDate: null,
                    endDate: null,
                };
                state.searchReStock = '';
            }
        },
        setColumns: (state, action) => {
            state.columns = action.payload;
        },
        setSearchName: (state, action) => {
            state.searchName = action.payload;

        },
        setSearchStock: (state, action) => {
            state.searchStock.stockChoice = action.payload.stockChoice;
            state.searchStock.stockInput = action.payload.stockInput;
            state.searchStock.stockSecondInput = action.payload.stockSecondInput;
        },
        setSearchCategory: (state, action) => {
            state.searchCategory = action.payload;
        },
        setSearchUser: (state, action) => {
            state.searchUser = action.payload;
        },
        setSearchPrice: (state, action) => {
            state.searchPrice = action.payload;
        },
        setSearchDate(state, action) {
            state.searchDate.startDate = action.payload.startDate;
            state.searchDate.endDate = action.payload.endDate;
        },
        setSearchReStock: (state, action) => {
            state.searchReStock = action.payload;
        },
        setDeleteList: (state, action) => {
            state.deleteList = action.payload;
        },
        setEditProduct: (state, action) => {
            state.editProduct = action.payload;
        },
        setDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload;
        },
        setFormFeedback: (state, action) => {
            state.formFeedback = action.payload;
        },
        setPrintStockTable: (state, action) => {
            state.printStockTable = action.payload;
        }
    }
})

export const { setProducts, setStatus, setError, resetFilters, setColumns, setSearchName, setSearchStock, setSearchCategory, setSearchUser, setSearchPrice, setSearchDate, setSearchReStock, setDeleteList, setDeleteConfirmation, setFormFeedback, setEditProduct, setPrintStockTable } = productsSlice.actions;

export default productsSlice.reducer;
