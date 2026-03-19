"use client";

import MVPPage from "@/components/MVPPage";
import { useGetMvpGroupQuery } from "@/lib/services/api";

function MVPGroup() {
  const { data } = useGetMvpGroupQuery();
  const mvp = data?.data?.[0] || [];

  return <MVPPage mvp={mvp} isGroup={true} />;
}

export default MVPGroup;
