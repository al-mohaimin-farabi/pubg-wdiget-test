'use client'

const { default: MVPPage } = require("@/components/MVPPage");
const { useGetMvpGroupQuery } = require("@/lib/services/api");
const { useState, useEffect } = require("react");

const MVPGroup = () => {
  const { data, isLoading, error } = useGetMvpGroupQuery();
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

  return <MVPPage mvp={mvp} isGroup={true} />;
};

export default MVPGroup;

