import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const pcobBaseUrl = process.env.NEXT_PUBLIC_PCOB_URL || process.env.PCOB_URL;

export const pcobApi = createApi({
  reducerPath: "pcobApi",
  baseQuery: fetchBaseQuery({
    baseUrl: pcobBaseUrl,
  }),
  keepUnusedDataFor: 5,
  refetchOnMountOrArgChange: false,
  endpoints: () => ({}),
});
