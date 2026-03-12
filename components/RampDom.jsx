"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Data constants
const data1 = {
  id: 131675,
  type: "domination",
  value: "3",
  player_id: 259417,
  player_name: null,
  player_ign: "RLX¹丨Legend",
  player_image: "/t3arPASSPORT.png",
  player_thumbnail: "/t3arPASSPORT.png",
  player_user_id: 5454589161,
  team_id: 28635,
  team_name: "RLX OFFICIAL",
  team_clan_tag: "RLXO",
  team_image: "/KS_AXE_2020.png",
};

const data2 = {
  id: 131672,
  type: "rampage",
  value: "5",
  player_id: 259328,
  player_name: null,
  player_ign: "GSxNupXD",
  player_image:
    "https://tournalink.com/images/default/game/official/player-full.png?full=true&off=1",
  player_thumbnail:
    "https://tournalink.com/images/default/game/official/player-thumb.png?off=1",
  player_user_id: 5262986780,
  team_id: 28626,
  team_name: "GANG STAR",
  team_clan_tag: "GS",
  team_image: "/KS_AXE_2020.png",
};

// Card Component
const RampDomCard = ({ data }) => {
  const elmisIcon =
    data?.type?.toLowerCase() === "domination" ? "/scope.png" : "/helmet.png";

  console.log(data?.type?.toLowerCase());

  return (
    <div className="relative h-[70px] w-[300px] bg-gray-200">
      {/* title */}
      <div className="relative z-1 h-[40px] w-full bg-linear-to-t from-[#6F6EBB] to-[#414098]">
        <p className="p-2 text-2xl font-bold text-[#F9F871]">
          {data?.type?.toLowerCase() === "domination"
            ? "DOMINATION"
            : "RAMPAGE"}
        </p>
      </div>

      {/* player ign and team logo */}
      <div className="relative flex h-[30px] w-full items-center justify-start gap-2 bg-[#D4DFEA] p-2">
        <Image src={data.team_image} alt="Team Logo" width={20} height={20} />
        <p className="text-[#2F3475]">{data.player_ign}</p>
        <Image
          className="absolute right-10 bottom-0 z-10 h-[100px] w-[120px]"
          src={data.player_thumbnail}
          alt="Player Thumbnail"
          width={80}
          height={80}
        />
      </div>

      {/* elmis box */}
      <div className="absolute -top-12 -right-8 z-1 flex aspect-square flex-col justify-between border-4 border-[#DCE3FF] bg-linear-to-b from-[#6F6EBB] to-[#414098] p-3">
        <div className="flex items-center gap-2">
          <Image src={elmisIcon} alt="Elmis Icon" width={40} height={40} />
          <p className="text-4xl font-extrabold">{data.value}</p>
        </div>
        <p className="text-end text-xl">ELMIS</p>
      </div>
    </div>
  );
};

// Main Controller Component
function RampDom() {
  const [activeData, setActiveData] = useState(data1);
  const [isVisible, setIsVisible] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const changeData = () => {
    if (isLocked) return;
    setIsLocked(true);

    // Toggle data
    setActiveData((prev) => (prev.id === data1.id ? data2 : data1));
    setIsVisible(true);

    // Stay for 4 seconds then slide out
    setTimeout(() => {
      setIsVisible(false);
      // Wait for exit animation to finish before unlocking
      setTimeout(() => {
        setIsLocked(false);
      }, 500);
    }, 4000);
  };

  return (
    <>
      {/* Button: fixed top-right */}
      <div className="fixed top-5 right-5 z-50">
        <button
          className={`rounded bg-white px-4 py-2 font-bold text-black shadow hover:bg-gray-100 ${
            isLocked ? "cursor-not-allowed opacity-50" : ""
          }`}
          onClick={changeData}
        >
          Change Data
        </button>
      </div>

      {/* Notification: fixed, vertically centered, left side */}
      <div className="pointer-events-none fixed top-0 left-0 z-99 flex h-screen w-[350px] items-center">
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <RampDomCard data={activeData} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default RampDom;
