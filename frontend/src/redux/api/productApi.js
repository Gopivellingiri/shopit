import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  tagTypes: ["Product", "AdminProducts", "Reviews"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ page, keyword, min, max, category, ratings }) => {
        const queryString = new URLSearchParams({
          page,
          keyword,
          ...(min && { "price[gte]": min }),
          ...(max && { "price[lte]": max }),
          ...(category && { category }),
          ...(ratings && { "ratings[gte]": ratings }),
        }).toString();
        console.log("query string:", queryString);
        return `/products?${queryString}`;
      },
    }),

    getProductDetails: builder.query({
      query: (id) => ({
        url: `/products/${id}`,
        providesTags: ["Product"],
      }),
    }),

    submitReview: builder.mutation({
      query: (body) => ({
        url: "/reviews",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Product"],
    }),
    canUserReview: builder.query({
      query: (productId) => `/can_review/?productId=${productId}`,
    }),
    getAdminProducts: builder.query({
      query: () => `/admin/products`,
      providesTags: ["AdminProducts"],
    }),
    createProduct: builder.mutation({
      query: (body) => ({
        url: "/admin/products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AdminProducts"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, body }) => ({
        url: `/admin/products/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["AdminProducts", "Product"],
    }),
    uploadProductImages: builder.mutation({
      query: ({ id, body }) => ({
        url: `/admin/products/${id}/upload_images`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProductImage: builder.mutation({
      query: ({ id, body }) => ({
        url: `/admin/products/${id}/delete_image`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminProducts"],
    }),
    getProductReviews: builder.query({
      query: (productId) => `/reviews?id=${productId}`,
      providesTags: ["Reviews"],
    }),
    deleteReview: builder.mutation({
      query: ({ productId, id }) => ({
        url: `/admin/reviews?productId=${productId}&id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reviews"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useGetAdminProductsQuery,
  useSubmitReviewMutation,
  useCanUserReviewQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImagesMutation,
  useDeleteProductImageMutation,
  useDeleteProductMutation,
  useLazyGetProductReviewsQuery,
  useDeleteReviewMutation,
} = productApi;
