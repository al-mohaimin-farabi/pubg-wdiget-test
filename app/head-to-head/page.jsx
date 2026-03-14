"use client";
import Layout from "@/components/layout";
import Title from "@/components/Title";
import { useGetHeadToHeadQuery } from "@/lib/services/api";
import Image from "next/image";
import { useEffect, useState } from "react";

const statsConfig = [
  { label: "Damages", key: "total_damage" },
  { label: "Knocks", key: "total_knockouts" },
  { label: "Eliminations", key: "kills" },
  { label: "Surv.Time", key: "time" },
  { label: "Total Points", key: "points" },
];

const HeadToHead = () => {
  const { data, error, isLoading } = useGetHeadToHeadQuery();
  const [teamA, setTeamA] = useState(null);
  const [teamB, setTeamB] = useState(null);

  useEffect(() => {
    if (isLoading) {
      console.log("Loading...");
    } else if (error) {
      console.error("Error fetching data:", error);
    } else if (data) {
      console.log("data a", data?.data[0]);
      setTeamA(data?.data[0]);
      setTeamB(data?.data[1]);
    }
  }, [data, error, isLoading]);
  return (
    <Layout top>
      <Title title="Team Head-to-Head" data={data?.game[0]} />
      <div className="wrapper">
        <div className="grid grid-cols-4 gap-4">
          <Teambanner team={teamA} />
          <div className="col-span-2 flex h-[400px] flex-col gap-[22px]">
            {statsConfig.map((stat, idx) => (
              <CompareRow
                key={idx}
                teamA={teamA}
                label={stat.label}
                teamB={teamB}
                statKey={stat.key}
              />
            ))}
          </div>
          <Teambanner team={teamB} />
        </div>
      </div>
    </Layout>
  );
};

export default HeadToHead;

const Teambanner = ({ team }) => {
  return (
    <div className="">
      <p className="bg-primary p-2 text-center text-3xl font-bold text-white">
        {team?.team_name || ""}
      </p>
      <div className="bg-primary-shade-two grid place-content-center p-2">
        {team?.team_logo ? (
          <Image
            width={400}
            height={400}
            src={team?.team_logo}
            alt="Team Logo"
            priority
          />
        ) : (
          <div className="h-[400px] w-[400px] bg-gray-800" />
        )}
      </div>
    </div>
  );
};

const CompareRow = ({ teamA, label, teamB, statKey }) => {
  return (
    <div className="bg-primary grid grid-cols-4 gap-4 p-3">
      <div className="bg-primary-shade-two col-span-1 p-2 text-center text-3xl font-bold text-white">
        {teamA?.[statKey] ?? 0}
      </div>
      <div className="bg-primary-shade-one col-span-2 mx-auto w-full p-2 text-center text-3xl font-medium text-white uppercase">
        {label}
      </div>
      <div className="bg-primary-shade-two col-span-1 p-2 text-center text-3xl font-bold text-white">
        {teamB?.[statKey] ?? null}
      </div>
    </div>
  );
};
