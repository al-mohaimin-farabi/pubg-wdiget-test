"use client";
import { useGetMvpMatchQuery } from "@/lib/services/api";
import { useEffect, useState } from "react";
import MVPPage from "@/components/MVPPage";

const MvpMatch = () => {
  const { data, isLoading, error } = useGetMvpMatchQuery();
  const [mvp, setMvp] = useState(data?.data[0] || []);

  useEffect(() => {
    if (isLoading) {
      console.log("Loading...");
    } else if (error) {
      console.error("Error fetching data:", error);
    } else if (data) {
      setMvp(data?.data[0]);
      console.log(data?.data);
    }
  }, [data, error, isLoading]);

  return <MVPPage mvp={mvp} />;
};

export default MvpMatch;
