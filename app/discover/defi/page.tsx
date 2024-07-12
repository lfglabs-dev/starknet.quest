"use client";

import DataTable from "@components/discover/defiTable";
import {
  getAltProtocolStats,
  getDerivatesStats,
  getLendingStats,
  getPairingStats,
} from "@services/apiService";
import { formatStatsData } from "@utils/defi";
import React, { useEffect, useCallback } from "react";

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
    <div className="flex w-full flex-col mt-24 gap-8 items-center">
      {/* <div
        className={`w-full h-[400px] ${styles.backgroundImage} flex justify-center items-center`}
      >
        <div className="w-full justify-center items-center flex flex-col">
          <Typography type={TEXT_TYPE.BODY_DEFAULT} color="primary">
            Starknet Foundation
          </Typography>
          <Typography
            type={TEXT_TYPE.H1}
            color="white"
            style={{ textAlign: "center" }}
          >
            The Start of DeFi Spring
          </Typography>
        </div>
      </div> */}
      <div className="mx-4 p-6 border-[1px] border-[#f4faff4d] rounded-xl w-full lg:w-3/4">
        <DataTable loading={loading} data={data} />
      </div>
    </div>
  );
}
