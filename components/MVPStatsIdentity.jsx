import Image from "next/image";

const MVPStatsIdentity = ({ mvp, isGroup = false }) => {
  return (
    <div className="absolute bottom-48 left-0">
      <div className="absolute bottom-48 ml-4 flex flex-col items-start">
        <p className="text-primary ml-8 -mb-4 text-[92px] leading-none font-bold uppercase">
          {isGroup ? "OVERALL" : "MATCH"}
        </p>
        <p className="stroked-text z-10 text-[500px] leading-[0.8] font-extrabold text-white">
          MVP
        </p>
      </div>
      <div className="bg-primary flex w-[400px]">
        <div className="grid place-content-center py-2">
          <div className="bg-primary-shade-two">
            <Image src={mvp?.team_logo} alt="" width={120} height={120} />
          </div>
        </div>
        <div className="w-full">
          <div className="bg-primary-shade-one p-2 text-center text-3xl text-white">
            {mvp?.team_name}
          </div>
          <div className="bg-primary-shade-two p-2 text-center text-5xl text-black">
            {mvp?.player_ign}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MVPStatsIdentity;
