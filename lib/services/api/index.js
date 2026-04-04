import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const defaultBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL;

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: defaultBaseUrl,
  }),
  keepUnusedDataFor: 300, // Keep data in cache for 5 minutes after unmount
  refetchOnMountOrArgChange: true, // Re-validate/fetch whenever a component mounts
  endpoints: (builder) => ({
    getWwcdTeamStats: builder.query({
      query: () => "/wwcd",
    }),
    getMatchSummary: builder.query({
      query: () => "/match-summary",
    }),
    getTopPlayers: builder.query({
      query: () => "/top-players",
    }),
    getTopPlayersGroup: builder.query({
      query: () => "/top-players-group",
    }),
    getHeadToHead: builder.query({
      query: () => "/head-to-head",
    }),
    getMvpMatch: builder.query({
      query: () => "/mvp-match",
    }),
    getMvpGroup: builder.query({
      query: () => "/mvp-group",
    }),
    getAfterMatchScore: builder.query({
      query: () => "/after-match-score",
    }),
    getAfterMatchScoreGroup: builder.query({
      query: () => "/after-match-score-group",
    }),
  }),
});

export const {
  useGetWwcdTeamStatsQuery,
  useGetMatchSummaryQuery,
  useGetTopPlayersQuery,
  useGetTopPlayersGroupQuery,
  useGetHeadToHeadQuery,
  useGetMvpMatchQuery,
  useGetMvpGroupQuery,
  useGetAfterMatchScoreQuery,
  useGetAfterMatchScoreGroupQuery,
} = api;
