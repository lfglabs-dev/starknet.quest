"use client";

import React, { useEffect, useCallback } from "react";
import DataTable from "@components/discover/defiTable";
import DeFiConceptCard from "@components/UI/DefiConceptCard";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";
import { DEFI_CONCEPTS } from "./constants";
import Image from "next/image";
import {
  getAltProtocolStats,
  getDerivatesStats,
  getLendingStats,
  getPairingStats,
} from "@services/apiService";
import { formatStatsData } from "@utils/defi";
import { LendingAndBorrowing } from "./categories";

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
    <div className="flex flex-col items-center w-full gap-8 mt-24 mb-32">
      <div className="w-full p-6 mx-4 rounded-xl lg:w-3/4 mb-36">
        <DataTable loading={loading} data={data} />
      </div>

      <div className="relative w-full px-5 lg:w-3/4 lg:px-0">
        <div className="absolute -right-1/2 top-0 w-[781px] h-[764px] opacity-30 pointer-events-none">
          <Image
            src="/icons/patternCircle.svg"
            alt="pattern-circle"
            width={781}
            height={764}
            className="relative w-full h-full animate-spin-slow"
          />
        </div>

        <div className="max-w-sm mx-auto md:max-w-none">
          <Typography
            type={TEXT_TYPE.H2}
            className="mb-8 text-2xl font-bold text-center text-white lg:text-left"
          >
            Essential DeFi Concepts
          </Typography>
          <div
            className="relative grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 z-5"
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

        <div className="w-full">
          <LendingAndBorrowing />
        </div>
      </div>
    </div>
  );
}
