import { cn } from "@/lib/utils";
import Image from "next/image";

const data = {
  success: true,
  data: [
    {
      id: 28634,
      position: 1,
      name: "TSV OFFICIALS",
      score: 14,
      image: "https://tournalink.com/storage/83087/014.png",
      clan_tag: "TSVO",
      color: "rgb(207, 206, 207)",
      total_players: 4,
      knocked_players: 0,
      alive_players: 4,
      active_players: 4,
      playing: true,
      players: [
        {
          player_id: 259409,
          name: "PANTHEROG",
          in_game_name: "PANTHEROG",
          image:
            "https://tournalink.com/images/default/game/official/player-full.png?full=true&off=1",
          thumbnail:
            "https://tournalink.com/images/default/game/official/player-thumb.png?off=1",
          is_knocked: false,
          is_alive: true,
          health: 97,
          is_inside_zone: true,
          player_status: "alive",
        },
        {
          player_id: 259410,
          name: "TSV艾MrSOLOO",
          in_game_name: "TSV艾MrSOLOO",
          image: "https://tournalink.com/storage/71862/mrSolo.png",
          thumbnail:
            "https://tournalink.com/storage/71862/conversions/mrSolo-preview.png",
          is_knocked: false,
          is_alive: true,
          health: 100,
          is_inside_zone: true,
          player_status: "alive",
        },
        {
          player_id: 259411,
          name: "TSV艾Fardi9",
          in_game_name: "TSV艾Fardi9",
          image: "https://tournalink.com/storage/71861/fardin.png",
          thumbnail:
            "https://tournalink.com/storage/71861/conversions/fardin-preview.png",
          is_knocked: true,
          is_alive: true,
          health: 75,
          is_inside_zone: true,
          player_status: "alive",
        },
        {
          player_id: 265230,
          name: "TSV艾pushpa",
          in_game_name: "TSV艾pushpa",
          image: "https://tournalink.com/storage/73787/TSV-PUSHPA.png",
          thumbnail:
            "https://tournalink.com/storage/73787/conversions/TSV-PUSHPA-preview.png",
          is_knocked: false,
          is_alive: true,
          health: 10,
          is_inside_zone: true,
          player_status: "alive",
        },
      ],
      win_chance: 95,
      is_inside_zone: true,
      is_eliminated: false,
    },
    {
      id: 28623,
      position: 2,
      name: "TERROR REIGN X",
      score: 4,
      image: "https://tournalink.com/storage/71821/003.png",
      clan_tag: "TRX",
      color: "rgb(27, 78, 131)",
      total_players: 4,
      knocked_players: 0,
      alive_players: 0,
      active_players: 0,
      playing: true,
      players: [
        {
          player_id: 259220,
          name: "TRxMONSTÉR",
          in_game_name: "TRxMONSTÉR",
          image: "https://tournalink.com/storage/71874/monster.png",
          thumbnail:
            "https://tournalink.com/storage/71874/conversions/monster-preview.png",
          is_knocked: false,
          is_alive: true,
          health: 100,
          is_inside_zone: true,
          player_status: "alive",
        },
        {
          player_id: 259222,
          name: "TRxGHOST",
          in_game_name: "TRxGHOST",
          image: "https://tournalink.com/storage/71875/ghost.png",
          thumbnail:
            "https://tournalink.com/storage/71875/conversions/ghost-preview.png",
          is_knocked: true,
          is_alive: false,
          health: 0,
          is_inside_zone: true,
          player_status: "eliminated",
        },
        {
          player_id: 282768,
          name: "1971彡leader",
          in_game_name: "1971彡leader",
          image:
            "https://tournalink.com/images/default/game/official/player-full.png?full=true&off=1",
          thumbnail:
            "https://tournalink.com/images/default/game/official/player-thumb.png?off=1",
          is_knocked: true,
          is_alive: false,
          health: 0,
          is_inside_zone: true,
          player_status: "eliminated",
        },
        {
          player_id: 283700,
          name: "sfc๛fahim",
          in_game_name: "sfc๛fahim",
          image:
            "https://tournalink.com/images/default/game/official/player-full.png?full=true&off=1",
          thumbnail:
            "https://tournalink.com/images/default/game/official/player-thumb.png?off=1",
          is_knocked: true,
          is_alive: false,
          health: 0,
          is_inside_zone: true,
          player_status: "eliminated",
        },
      ],
      win_chance: 5,
      is_inside_zone: true,
      is_eliminated: false,
    },
    {
      id: 28638,
      position: 3,
      name: "TSV ESPORTS",
      score: 4,
      image: "https://tournalink.com/storage/71846/tsv.png",
      clan_tag: "TSV",
      color: "rgb(24, 17, 18)",
      total_players: 4,
      knocked_players: 0,
      alive_players: 0,
      active_players: 0,
      playing: true,
      players: [
        {
          player_id: 259436,
          name: "TSV艾MAFIAGANG",
          in_game_name: "TSV艾MAFIAGANG",
          image: "https://tournalink.com/storage/74247/TSV-MAFIAGANG.png",
          thumbnail:
            "https://tournalink.com/storage/74247/conversions/TSV-MAFIAGANG-preview.png",
          is_knocked: true,
          is_alive: false,
          health: 0,
          is_inside_zone: true,
          player_status: "eliminated",
        },
        {
          player_id: 282789,
          name: "tsv艾mr٭t〇m",
          in_game_name: "tsv艾mr٭t〇m",
          image: "https://tournalink.com/storage/82996/TSV-TOMBABY.png",
          thumbnail:
            "https://tournalink.com/storage/82996/conversions/TSV-TOMBABY-preview.png",
          is_knocked: true,
          is_alive: false,
          health: 0,
          is_inside_zone: true,
          player_status: "eliminated",
        },
        {
          player_id: 282790,
          name: "tsv艾justhaddy",
          in_game_name: "tsv艾justhaddy",
          image:
            "https://tournalink.com/images/default/game/official/player-full.png?full=true&off=1",
          thumbnail:
            "https://tournalink.com/images/default/game/official/player-thumb.png?off=1",
          is_knocked: true,
          is_alive: false,
          health: 0,
          is_inside_zone: true,
          player_status: "eliminated",
        },
        {
          player_id: 283702,
          name: "tsv艾joyboy",
          in_game_name: "tsv艾joyboy",
          image:
            "https://tournalink.com/images/default/game/official/player-full.png?full=true&off=1",
          thumbnail:
            "https://tournalink.com/images/default/game/official/player-thumb.png?off=1",
          is_knocked: true,
          is_alive: false,
          health: 0,
          is_inside_zone: true,
          player_status: "eliminated",
        },
      ],
      win_chance: 0,
      is_inside_zone: true,
      is_eliminated: true,
    },
    {
      id: 28625,
      position: 4,
      name: "TEAM RETIRED",
      score: 2,
      image: "https://tournalink.com/storage/71827/trt.png",
      clan_tag: "TRT",
      color: "rgb(62, 193, 175)",
      total_players: 4,
      knocked_players: 0,
      alive_players: 0,
      active_players: 0,
      playing: true,
      players: [
        {
          player_id: 259469,
          name: "trtes・don'vi",
          in_game_name: "trtes・don'vi",
          image: "https://tournalink.com/storage/73798/TRTes-DON-VAI.png",
          thumbnail:
            "https://tournalink.com/storage/73798/conversions/TRTes-DON-VAI-preview.png",
          is_knocked: true,
          is_alive: false,
          health: 0,
          is_inside_zone: true,
          player_status: "eliminated",
        },
        {
          player_id: 259470,
          name: "trtesthor",
          in_game_name: "trtesthor",
          image: "https://tournalink.com/storage/73799/thor.png",
          thumbnail:
            "https://tournalink.com/storage/73799/conversions/thor-preview.png",
          is_knocked: true,
          is_alive: false,
          health: 0,
          is_inside_zone: true,
          player_status: "eliminated",
        },
        {
          player_id: 259569,
          name: "trtesasif",
          in_game_name: "trtesasif",
          image: "https://tournalink.com/storage/73801/TRTes-ASIF.png",
          thumbnail:
            "https://tournalink.com/storage/73801/conversions/TRTes-ASIF-preview.png",
          is_knocked: true,
          is_alive: false,
          health: 0,
          is_inside_zone: false,
          player_status: "eliminated",
        },
        {
          player_id: 282779,
          name: "trtesabir",
          in_game_name: "trtesabir",
          image:
            "https://tournalink.com/images/default/game/official/player-full.png?full=true&off=1",
          thumbnail:
            "https://tournalink.com/images/default/game/official/player-thumb.png?off=1",
          is_knocked: true,
          is_alive: false,
          health: 0,
          is_inside_zone: true,
          player_status: "eliminated",
        },
      ],
      win_chance: 0,
      is_inside_zone: false,
      is_eliminated: true,
    },
  ],
};

const TopFour = () => {
  return (
    <div className="relative h-screen bg-transparent">
      <div className="absolute top-12 left-1/2 grid -translate-x-1/2 grid-cols-4 items-center gap-x-8 gap-y-4">
        {data?.data?.map((team, index) => (
          <div
            key={index}
            className={cn(
              "relative flex h-12 w-[220px] border-b-2 border-l-4 border-blue-400 bg-[#414098]",
            )}
          >
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Image src={"/flag.png"} alt="logo" width={35} height={40} />
                <Image
                  src={"/KS_AXE_2020.png"}
                  alt="logo"
                  width={35}
                  height={40}
                />

                <p className="font-bold text-white">{team.clan_tag}</p>
              </div>
              <div className="flex h-full gap-2 bg-blue-200 p-2">
                {team?.players?.map((player, index) => (
                  <div key={index} className={`relative w-[6px] bg-gray-400`}>
                    <div
                      className={cn(
                        "absolute bottom-0 w-full transition-all duration-300",
                        player?.is_alive ? "bg-green-500" : "bg-red-500",
                        player?.is_knocked && "bg-red-500",
                      )}
                      style={{ height: `${player?.health}%` }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
            {team?.is_eliminated && (
              <div className="absolute inset-0 bg-black/40"></div>
            )}
          </div>
        ))}
        {data?.data?.map((team, index) => (
          <div
            key={index}
            className={cn(
              "flex w-[220px] items-center",
              team?.is_eliminated && "hidden",
            )}
          >
            <div className="w-full bg-[#4F63CE] text-center">WWCD</div>
            <div className="w-full bg-[#3C41B4] text-center">
              {team?.win_chance}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopFour;
