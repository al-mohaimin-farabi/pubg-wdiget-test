import Image from "next/image";

const TableRow = ({ team, overall = false }) => {
  return (
    <div className="bg-primary flex">
      <div className="bg-primary-shade-two grid min-w-[60px]! place-items-center p-3 text-2xl font-bold text-white">
        #{team?.position}
      </div>
      <div className="flex w-full items-center gap-2 px-2">
        <Image
          src={team?.team_logo}
          width={44}
          height={44}
          className=""
          alt=""
        />
        <p className="text-2xl font-bold text-black">{team?.team_name}</p>
      </div>
      <div className="bg-primary-shade-two flex items-center p-2 text-center text-xl font-bold">
        {overall && (
          <>
            <div className="w-[80.67px]">{team?.games_played}</div>
            <div className="w-[80.67px]">{team?.games_won}</div>
          </>
        )}
        <div className="w-[80.67px]">
          {overall ? team?.placement_point : team?.position_points}
        </div>
        <div className="w-[80.67px]">{team?.kills}</div>
        {!overall && <div className="w-[80.67px]">{team?.points}</div>}
      </div>
      {overall && (
        <div className=" min-w-[80.67px] p-2 text-xl font-bold text-black flex items-center"> 
          <div className="w-full  text-center "> {team?.total_points}</div>
        </div>
      )}
    </div>
  );
};

export default TableRow;
