"use client";
import Layout from "@/components/layout";
import PlayerCard from "@/components/PlayerCard";
import Title from "@/components/Title";
import { useGetWwcdTeamStatsQuery } from "@/lib/services/api";
import Image from "next/image";
import { useEffect, useState } from "react";

const WWCStats = () => {
  const { data, error, isLoading } = useGetWwcdTeamStatsQuery();
  const [team, setTeam] = useState(data?.data[0]?.players || []);

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
    <Layout top className={""}>
      <Title title={"WWCD Stats"} data={data?.game[0]} />
      <div className="mx-auto mt-16 flex h-[508px] w-max gap-6 px-16">
        {/* team stats */}
        <div className="space-y-8 uppercase">
          <div className="bg-primary-shade-two mx-auto w-max">
            <p className="bg-primary-shade-one p-1 text-center text-2xl font-bold text-white">
              {data?.data[0]?.team_name}
            </p>
            <Image
              src={data?.data[0]?.team_image}
              width={180}
              height={180}
              alt=""
              className="mx-auto"
            />
          </div>

          <Databox title="Eliminations" value={data?.data[0]?.total_kills} />
          <Databox title="Total Damage" value={data?.data[0]?.total_damage} />
        </div>

        {/* player  stats */}
        <div className="grid grid-cols-4 gap-4">
          {team?.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default WWCStats;

const Databox = ({ title, value }) => {
  return (
    <div className="bg-primary relative w-[220px] px-18 py-8">
      <div className="bg-primary-shade-one absolute -top-[15px] left-1/2 h-[30px] translate-x-[-50%] p-1 whitespace-nowrap">
        {title}
      </div>
      <p className="text-center text-5xl font-bold text-black">{value}</p>
    </div>
  );
};
