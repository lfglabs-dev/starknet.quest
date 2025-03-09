"use client";

import DataTable from "@components/discover/defiTable";
import DeFiConceptCard from "@components/UI/DefiConceptCard";
import {
  getAltProtocolStats,
  getDerivatesStats,
  getLendingStats,
  getPairingStats,
} from "@services/apiService";
import { formatStatsData } from "@utils/defi";
import React, { useEffect, useCallback } from "react";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";
import { DEFI_CONCEPTS } from "./constants";
import Image from "next/image";

export default function Page() {
  const [data, setData] = React.useState<TableInfo[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const fetchPageData = useCallback(async () => {
    try {
      setLoading(true);
      const derivatesStats = await getDerivatesStats();
      const lendingStats = await getLendingStats();
      const pairingStats = await getPairingStats();
      const altProtocolStats = await getAltProtocolStats();

      const res = formatStatsData(
        derivatesStats,
        lendingStats,
        pairingStats,
        altProtocolStats
      );
      setData(res);
      setLoading(false);
    } catch (e) {
      console.error("Error while fetching defi stats data", e);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPageData();
  }, []);

  return (
    <div className="flex w-full flex-col mt-24 gap-8 items-center mb-32">
      <div className="mx-4 p-6 border-[1px] border-[#f4faff4d] rounded-xl w-full lg:w-3/4 mb-36">
        <DataTable loading={loading} data={data} />
      </div>

      <div className="w-full lg:w-3/4 px-4 sm:px-6 md:px-8 2xl:px-32 relative overflow-x-hidden no-scrollbar">
        <div className="absolute left-1/2 top-0 translate-x-[5rem] md:translate-x-[8rem]  2xl:translate-x-[34rem] w-[781px] h-[764px] opacity-30 pointer-events-none">
          <Image
            src="/icons/patternCircle.svg"
            alt="pattern-circle"
            width={781}
            height={764}
            className="w-full h-full relative animate-spin-slow"
          />
        </div>

        <div className="max-w-md sm:max-w-lg md:max-w-none mx-auto relative z-10">
          <Typography
            type={TEXT_TYPE.H2}
            className="mb-6 sm:mb-8 text-center sm:text-left text-white font-bold text-xl sm:text-2xl"
          >
            Essential DeFi Concepts
          </Typography>
          <div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            aria-label="DeFi concept cards grid"
          >
            {DEFI_CONCEPTS.map((concept) => (
              <DeFiConceptCard
                key={concept.title}
                title={concept.title}
                description={concept.description}
                icon={concept.icon}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
