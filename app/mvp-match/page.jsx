"use client";
import { useGetMvpMatchQuery } from "@/lib/services/api";
import MVPPage from "@/components/MVPPage";

function MvpMatch() {
  const { data } = useGetMvpMatchQuery();
  const mvp = data?.data?.[0] || [];

  return <MVPPage mvp={mvp} />;
}

export default MvpMatch;
