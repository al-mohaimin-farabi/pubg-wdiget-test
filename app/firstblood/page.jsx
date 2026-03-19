import Layout from "@/components/layout";
import Image from "next/image";
import React from "react";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

function Firstblood() {
  return (
    <Layout>
      <div className="absolute top-1/2 left-0 -translate-y-1/2 border-t border-yellow-400 bg-blue-900">
        <div className=""></div>
        <div className="flex w-full items-center justify-between text-yellow-400">
          <div className="flex items-center gap-2 p-1">
            <Image
              src="/KS_AXE_2020.png"
              alt="firstblood"
              width={20}
              height={20}
            />
            <p>Player 1</p>
          </div>
          <div className="flex items-center">
            <MdKeyboardDoubleArrowRight />
            <MdKeyboardDoubleArrowRight />
          </div>
          <div className="flex items-center gap-1 p-1">
            <Image
              src="/KS_AXE_2020.png"
              alt="firstblood"
              width={20}
              height={20}
            />
            <p>Player 2</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Firstblood;
