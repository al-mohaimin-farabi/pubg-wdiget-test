"use client";

import Layout from "@/components/layout";
import PlayerCard from "@/components/PlayerCard";
import Title from "@/components/Title";
import { useGetTopPlayersGroupQuery } from "@/lib/services/api";

function TopPlayersGroup() {
  const { data } = useGetTopPlayersGroupQuery();
  const team = data?.data || [];
  return (
    <Layout top>
      <Title title="Overall Top Players" stageOnly data={data?.game[0]} />
      <div className="mx-auto mt-16 flex h-127 w-max gap-6 px-16">
        <div className="grid grid-cols-5 gap-4">
          {team?.map((player, idx) => (
            <PlayerCard
              key={player.id}
              player={player}
              type="OVERALL"
              rank={idx + 1}
              showTeamLogo
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default TopPlayersGroup;
