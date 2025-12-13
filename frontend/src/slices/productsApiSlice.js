import { PRODUCTS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: PRODUCTS_URL,
        params: { keyword, pageNumber },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Products'],
    }),
    getInventory: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/inventory`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Products'],
    }),
    updateStock: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/stock`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    updateBulkStock: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/bulk-stock`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    createBulkProducts: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/bulk`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    importProductsFromExcel: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/import-excel`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `/api/upload`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE',
      }),
      providesTags: ['Product'],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product'],
    }),
    getTopProducts: builder.query({
      query: () => `${PRODUCTS_URL}/top`,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useGetInventoryQuery,
  useUpdateStockMutation,
  useUpdateBulkStockMutation,
  useCreateProductMutation,
  useCreateBulkProductsMutation,
  useImportProductsFromExcelMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
} = productsApiSlice;
