import Image from "next/image";
import { GiChickenOven } from "react-icons/gi";

const HighLightTeam = ({ teamOne }) => {
  return (
    <div className="bg-primary-shade-two relative flex w-full h-[184px]">
      <div className="bg-primary absolute top-0 left-0 px-2 py-3 text-3xl font-bold text-white">
        #{teamOne?.position}
      </div>
      <div className="flex w-[70%] justify-center">
        <div className="relative z-20 flex w-[320px] items-end justify-center">
          <Image
            src={teamOne?.player_1_image}
            alt="team logo"
            width={120}
            height={120}
            className="relative translate-x-14"
          />
          <Image
            src={teamOne?.player_2_image}
            alt="team logo"
            width={120}
            className="relative translate-x-4"
            height={120}
          />
          <Image
            src={teamOne?.player_3_image}
            alt="team logo"
            width={120}
            className="relative z-10 -translate-x-8"
            height={120}
          />
          <Image
            src={teamOne?.player_4_image}
            alt="team logo"
            width={120}
            height={120}
            className="relative z-5 -translate-x-20"
          />
        </div>
      </div>
      <div className="flex h-full w-[30%] flex-col">
        <div className="flex h-[50%] items-center justify-center gap-2 p-2">
          <Image
            src={teamOne?.team_logo}
            alt="team logo"
            width={64}
            height={64}
          />
          <p className="text-3xl font-bold">{teamOne.team_name}</p>
          <p className="text-3xl">
            <GiChickenOven />
          </p>
        </div>
        <div className="bg-primary flex h-[50%] px-2  text-4xl">
          <div className="w-[80.67px] text-center  h-full grid place-content-center">
            {teamOne?.position_points}
          </div>
          <div className="w-[80.67px] text-center h-full grid place-content-center">{teamOne?.kills}</div>
          <div className="w-[80.67px] text-center h-full grid place-content-center">{teamOne?.points}</div>
        </div>
      </div>
    </div>
  );
};

export default HighLightTeam;
