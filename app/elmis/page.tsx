"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const ElmisPage = () => {
  return (
    <div className="relative h-screen bg-transparent">
      <div className="absolute top-[200px] left-1/2 -translate-x-1/2 transform">
        {/* Yellow Div */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 280 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative h-[100px] overflow-hidden border-t-2 border-yellow-600 bg-yellow-900"
        >
          {/* Blue Div */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="relative h-full w-full bg-blue-900"
          >
            <div className="absolute top-1 left-2">#8</div>
            <div className="flex h-full w-full items-center justify-between p-4">
              <div className="relative">
                <Image
                  className="ml-4"
                  src="/KS_AXE_2020.png"
                  alt="ks_axe"
                  width={60}
                  height={60}
                />
                <div className="absolute -top-4 -right-8">
                  <Image
                    className="ml-4"
                    src="/flag.png"
                    alt="ks_axe"
                    width={30}
                    height={20}
                  />
                </div>
              </div>
              <div className="mr-6 flex flex-col items-center justify-center">
                <div className="overflow-hidden">
                  <motion.h2
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5, delay: 1.0, ease: "easeOut" }}
                    className="text-3xl leading-none font-bold text-white uppercase italic"
                  >
                    5 ELIMS
                  </motion.h2>
                </div>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 1.1, ease: "easeOut" }}
                  className="my-1 h-[2px] w-full origin-center bg-blue-300"
                />

                <div className="overflow-hidden">
                  <motion.h3
                    initial={{ y: "-100%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2, ease: "easeOut" }}
                    className="text-xl leading-none font-bold tracking-widest text-[#FCD34D] uppercase italic"
                  >
                    ELIMINATED
                  </motion.h3>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ElmisPage;
