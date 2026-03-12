import Image from "next/image";

const PlayerCard = ({ player }) => {
  return (
    <div className="flex flex-col">
      <div className="bg-primary">
        <div className="px-16">
          <Image src={player?.image} width={200} height={200} alt="" />
        </div>
        <p className="bg-primary-shade-one p-2 text-center text-2xl">
          {player?.name}
        </p>
      </div>

      <div className="grid h-full flex-1 grid-cols-2 bg-black p-2">
        <div className="border-primary border-r-2 border-b bg-black">
          <p className="text-center text-lg font-normal uppercase">Elimis</p>
          <p className="text-center text-3xl ">
            {player?.eliminations}
          </p>
        </div>
        <div className="border-primary border-b border-l-2 bg-black">
          <p className="text-center text-lg font-normal uppercase">Damage</p>
          <p className="text-center text-3xl ">
            {player?.total_damage}
          </p>
        </div>
        <div className="border-primary border-t-2 border-r-2 bg-black">
          <p className="text-center text-lg font-normal uppercase">Assists</p>
          <p className="text-center text-3xl ">
            {player?.total_assists}
          </p>
        </div>
        <div className="border-primary border-t-2 border-l-2 bg-black">
          <p className="text-center text-lg font-normal uppercase">
            Survival Time
          </p>
          <p className="text-center text-3xl ">
            {player?.survival_time?.text}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
