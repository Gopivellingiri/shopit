import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
  tagTypes: ["Order", "AdminOrders"],
  endpoints: (builder) => ({
    createNewOrder: builder.mutation({
      query: (body) => ({
        url: "/orders/new",
        method: "POST",
        body,
      }),
    }),
    MyOrders: builder.query({
      query: () => `/me/orders`,
    }),
    orderDetails: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: ["Order"],
    }),
    razorpayCheckoutSession: builder.mutation({
      query: (body) => ({
        url: "/payment/razorpay_order",
        method: "POST",
        body,
      }),
    }),
    getDashboardSales: builder.query({
      query: ({ startDate, endDate }) => ({
        url: `/admin/get_sales/?startDate=${startDate}&endDate=${endDate}`,
      }),
    }),
    getAdminOrders: builder.query({
      query: () => `/admin/orders`,
      providesTags: ["AdminOrders"],
    }),
    updateOrder: builder.mutation({
      query: ({ id, body }) => ({
        url: `/admin/orders/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Order"],
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/admin/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminOrders"],
    }),
  }),
});

export const {
  useCreateNewOrderMutation,
  useRazorpayCheckoutSessionMutation,
  useMyOrdersQuery,
  useOrderDetailsQuery,
  useLazyGetDashboardSalesQuery,
  useGetAdminOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApi;
