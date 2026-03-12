"use client";

import Layout from "@/components/layout";
import Title from "@/components/Title";
import { useGetMatchSummaryQuery } from "@/lib/services/api";
import { useEffect, useState } from "react";
import { BiTargetLock } from "react-icons/bi";
import { FaHeartPulse } from "react-icons/fa6";
import { FaPersonFalling } from "react-icons/fa6";
import { GiGrenade } from "react-icons/gi";
import { FaHandshakeSimple } from "react-icons/fa6";
import { FaCarCrash } from "react-icons/fa";

const MatchSummary = () => {
  const { data, error, isLoading } = useGetMatchSummaryQuery();
  const [team, setTeam] = useState(data?.data[0]?.players);

  useEffect(() => {
    if (isLoading) {
      console.log("Loading...");
    } else if (error) {
      console.error("Error fetching data:", error);
    } else if (data) {
      setTeam(data?.data[0]?.players);
    }
  }, [data, error, isLoading]);

  return (
    <Layout top>
      <Title
        title={"Match Sumary"}
        subtitle={"Grand Finals - Day 1 - Match 3"}
      />

      <div className="mx-auto mt-16 grid w-max grid-cols-3 gap-x-8 gap-y-16">
        <Databox
          title="Total Elims"
          value={data?.data[0]?.eliminations}
          icon={<BiTargetLock />}
        />
        <Databox
          title="Total Heals"
          value={data?.data[0]?.total_healings}
          icon={<FaHeartPulse />}
        />
        <Databox
          title="Total Knocks"
          value={data?.data[0]?.knockouts}
          icon={<FaPersonFalling />}
        />
        <Databox
          title="Grenade Elims"
          value={data?.data[0]?.grenade_elims}
          icon={<GiGrenade />}
        />
        <Databox
          title="Total Assits"
          value={data?.data[0]?.assists}
          icon={<FaHandshakeSimple />}
        />
        <Databox
          title="Vehical Elims"
          value={data?.data[0]?.vehicle_elims}
          icon={<FaCarCrash />}
        />
      </div>
    </Layout>
  );
};

export default MatchSummary;

const Databox = ({ title, value, icon }) => {
  return (
    // px-18 py-8
    <div className="bg-primary-shade-two relative flex h-[180px] w-[400px]">
      <div className="bg-primary-shade-one absolute -top-[20px] left-1/2 h-[40px] translate-x-[-50%] py-1 px-4 text-xl whitespace-nowrap uppercase">
        {title}
      </div>
      <div className="mx-auto flex w-[40%] items-center justify-center self-center text-center text-7xl">
        {icon}
      </div>
      <div className="bg-primary-shade-one grid h-[80%] w-[60%] place-content-center self-end">
        <p className="text-center text-5xl font-bold text-black">{value}</p>
      </div>
    </div>
  );
};
