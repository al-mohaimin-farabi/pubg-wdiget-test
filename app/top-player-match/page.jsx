"use client";

import Layout from "@/components/layout";
import PlayerCard from "@/components/PlayerCard";
import Title from "@/components/Title";
import { useGetTopPlayersQuery } from "@/lib/services/api";
import { useEffect, useState } from "react";

const TopPlayerMatch = () => {
  const { data, error, isLoading } = useGetTopPlayersQuery();
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
      <Title title={"Top Players"} data={data?.game[0]} />

      <div className="mx-auto mt-16 flex h-[508px] w-max gap-6 px-16">
        <div className="grid grid-cols-5 gap-4">
          {team?.map((player, idx) => (
            <PlayerCard
              key={player.id}
              player={player}
              type="MATCH"
              rank={idx+1}
              showTeamLogo
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default TopPlayerMatch;
