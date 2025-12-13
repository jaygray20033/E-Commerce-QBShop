import { apiSlice } from './apiSlice';

const DASHBOARD_URL = '/api/dashboard';

export const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => ({
        url: DASHBOARD_URL,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApiSlice;
