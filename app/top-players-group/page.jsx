"use client";

import Layout from "@/components/layout";
import PlayerCard from "@/components/PlayerCard";
import Title from "@/components/Title";
import { useGetTopPlayersGroupQuery } from "@/lib/services/api";
import { useEffect, useState } from "react";

const page = () => {
  const { data, error, isLoading } = useGetTopPlayersGroupQuery();
  const [team, setTeam] = useState(data?.data || []);

  useEffect(() => {
    if (isLoading) {
      console.log("Loading...");
    } else if (error) {
      console.error("Error fetching data:", error);
    } else if (data) {
      setTeam(data?.data);
      console.log(data?.data);
    }
  }, [data, error, isLoading]);
  return (
    <Layout top>
      <Title title="Overall Top Players" stageOnly data={data?.game[0]} />
      <div className="mx-auto mt-16 flex h-[508px] w-max gap-6 px-16">
        <div className="grid grid-cols-5 gap-4">
          {team?.map((player, idx) => (
            <PlayerCard
              key={player.id}
              player={player}
              type="OVERALL"
              rank={idx+1}
              showTeamLogo
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default page;
