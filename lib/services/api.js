import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL,
  }),
  endpoints: (builder) => ({
    getWwcdTeamStats: builder.query({
      query: () => "/wwcd",
    }),
    getMatchSummary: builder.query({
      query: () => "/match-summary",
    }),
  }),
});

export const { useGetWwcdTeamStatsQuery, useGetMatchSummaryQuery } = api;
