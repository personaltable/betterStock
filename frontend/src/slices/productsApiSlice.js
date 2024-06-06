import { apiSlice } from './apiSlice'
const PRODUCTS_URL = '/api/products'

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => ({
                url: PRODUCTS_URL,
                method: 'GET'
            }),
            providesTags: ['Product'],
        }),
        createProduct: builder.mutation({
            query: (data) => ({
                url: PRODUCTS_URL,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Product']
        }),
        deleteProduct: builder.mutation({
            query: (data) => ({
                url: PRODUCTS_URL,
                method: 'DELETE',
                body: data
            }),
            invalidatesTags: ['Product']
        })
    })
})

export const { useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation } = productsApiSlice;
