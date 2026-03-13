import Image from "next/image";

const PlayerCard = ({ player, showTeamLogo = false, type = "", rank }) => {
  return (
    <div className="relative flex flex-col">
      <div className="bg-primary">
        <div className="px-16">
          <Image
            src={player?.image || player?.player_image}
            width={200}
            height={200}
            alt=""
          />
        </div>
        <p className="bg-primary-shade-one p-2 text-center text-2xl">
          {player?.name}
        </p>
      </div>

      <div className="grid h-full flex-1 grid-cols-2 bg-black p-2">
        <div className="border-primary border-r-2 border-b bg-black">
          <p className="text-center text-lg font-normal uppercase">Elimis</p>
          <p className="text-center text-3xl">{player?.eliminations}</p>
        </div>
        <div className="border-primary border-b border-l-2 bg-black">
          <p className="text-center text-lg font-normal uppercase">Damage</p>
          <p className="text-center text-3xl">
            {type === "MATCH" || type === "OVERALL"
              ? player?.damage
              : player?.total_damage}
          </p>
        </div>
        <div className="border-primary border-t-2 border-r-2 bg-black">
          <p className="text-center text-lg font-normal uppercase">Assists</p>
          <p className="text-center text-3xl">
            {type === "MATCH" || type === "OVERALL"
              ? player?.assists
              : player?.total_assists}
          </p>
        </div>
        <div className="border-primary border-t-2 border-l-2 bg-black">
          <p className="text-center text-lg font-normal uppercase">
            {type === "OVERALL" ? "E/M Ratio" : "Survival Time"}
          </p>
          <p className="text-center text-3xl">
            {type === "OVERALL"
              ? player?.kd_ratio
              : player?.survival_time?.text}
          </p>
        </div>
      </div>
      {player?.team_logo && showTeamLogo && (
        <div className="absolute top-0 left-0 bg-black/20">
          <Image src={player?.team_logo} width={64} height={64} alt="" />
        </div>
      )}
      {rank && (
        <p className="absolute top-2 right-2 text-center text-3xl font-bold">
          #{rank}
        </p>
      )}
    </div>
  );
};

export default PlayerCard;
