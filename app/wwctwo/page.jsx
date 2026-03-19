"use client";

import { useGetWwcdTeamStatsQuery } from "@/lib/services/api";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Layout from "@/components/layout";

const WwcTwo = () => {
  const { data } = useGetWwcdTeamStatsQuery();
  const team = data?.data?.[0]?.players || [];

  return (
    <Layout>
      <div className="absolute bottom-16 z-10 h-auto w-full px-16">
        <div className="relative z-10 mx-auto mb-8 flex max-h-[180px] w-max">
          <div className="grid aspect-square place-content-center bg-black px-4">
            <Image
              priority
              src={data?.data[0]?.team_image}
              alt="Team Logo"
              className="aspect-square"
              width={100}
              height={100}
            />
          </div>
          <div className="bg-primary-shade-two grid place-content-center px-24">
            <p className="text-5xl font-extrabold">Team Name</p>
          </div>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-8">
          <DataBox title="Elimanations" data={data?.data[0]?.total_kills} />
          <DataBox title="Total Damage" data={data?.data[0]?.total_damage} />
          <DataBox title="Total Points" data={data?.data[0]?.total_points} />
        </div>

        {/* player images */}
        <div className="absolute bottom-0 left-1/2 z-5 flex -translate-x-1/2">
          {team?.map((player, index) => (
            <div
              key={player.id}
              className={cn("relative", {
                "-ml-28": index !== 0,
                [`z-[${index}]`]: index !== team.length - 1,
                "-z-10": index === team.length - 1,
              })}
            >
              <Image
                priority
                src={player.image}
                width={600}
                height={750}
                alt={player.name}
                className="h-[750px] w-[600px] scale-x-150"
              />
            </div>
          ))}
          {/* big title */}
          {/* leading-none */}
          <p className="text-primary absolute -top-10 left-1/2 -z-20 w-max -translate-x-1/2 text-center text-[220px] leading-[280px] font-extrabold uppercase">
            <span className="stroked-text">Winner </span>
            Winner
            <br />
            Chicken <span className="stroked-text">Dinner </span>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default WwcTwo;

const DataBox = ({ title, data }) => {
  return (
    <div className="">
      <h1 className="bg-primary-shade-two p-2 text-center text-3xl uppercase">
        {title}
      </h1>
      <div className="grid place-content-center bg-black p-8 text-7xl font-extrabold">
        {data}
      </div>
    </div>
  );
};
