"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useGetWwcdTeamStatsQuery } from "../../lib/services/api";
import { cn } from "../../lib/utils";

const WWC = () => {
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

  // const teams = data?.data[0]?.players;

  return (
    <div className="flex h-screen w-full items-center justify-center overflow-hidden p-2">
      <div className="w-490 space-y-4 overflow-hidden">
        <h1 className="text-primary text-5xl font-bold uppercase">
          wwcd team stats
        </h1>
        <div className="border-primary grid h-185.25 grid-cols-6 border-2">
          <div className="border-r-primary h-full border-r-2 font-bold">
            <div className="flex h-[80%] flex-col items-center justify-center overflow-hidden">
              <Image
                alt=""
                src={data?.data[0]?.team_image}
                width={250}
                height={250}
                priority
              />
            </div>
            <div className="bg-primary mt-1 grid h-[20%] place-content-center">
              <p className="mx-auto text-5xl font-bold text-white">
                {data?.data[0]?.clan_tag}
              </p>
            </div>
          </div>
          <div className="col-span-5 grid grid-cols-4">
            {team?.map((player, idx) => (
              <Player
                key={player?.id || idx}
                player={player}
                className={
                  idx === team.length - 1 ? "" : "border-primary border-r-2"
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WWC;

const Player = ({ player, className }) => {
  return (
    <div className={cn("h-full font-bold", className)}>
      <div className="relative h-[85%] w-full overflow-hidden">
        <Image
          src={player?.thumbnail}
          width={400}
          height={400}
          priority
          className="absolute inset-0 z-10 h-full w-full object-cover"
        />
        <div className="absolute top-4 left-2 z-20 flex w-25 flex-col text-lg uppercase">
          <div className="grid h-[80px] place-content-center bg-black text-center">
            <p>ELIMS</p>
            <p className="text-primary text-2xl">00</p>
          </div>
          <div className="grid h-[80px] place-content-center bg-black text-center">
            <p>KnockOuts</p>
            <p className="text-primary text-2xl">00</p>
          </div>
          <div className="bg-primary grid h-[80px] place-content-center text-center">
            <p>Dmg taken</p>
            <p className="text-2xl text-white">00</p>
          </div>
        </div>
      </div>
      <div className="text-primary grid h-[15%] w-full place-content-center bg-transparent text-3xl">
        <p className="mx-auto"> {player?.name || "PLAYER"}</p>
      </div>
    </div>
  );
};
