"use client";

import DataTable from "@components/discover/defiTable";
import {
  getAltProtocolStats,
  getDerivatesStats,
  getLendingStats,
  getPairingStats,
} from "@services/apiService";
import React, { useEffect, useCallback } from "react";

export default function Page() {
  const [data, setData] = React.useState<TableInfo[]>([]);
  const fetchPageData = useCallback(async () => {
    const derivatesStats = await getDerivatesStats();
    const lendingStats = await getLendingStats();
    const pairingStats = await getPairingStats();
    const altProtocolStats = await getAltProtocolStats();

    const res: TableInfo[] = [];

    if (!derivatesStats) return;
    Object.keys(derivatesStats).map((eachKey) => {
      const item: TableInfo = {
        title: derivatesStats[eachKey].protocol,
        action: "yay",
        apr: derivatesStats[eachKey].apr,
        volume: derivatesStats[eachKey].volumes,
        daily_rewards: derivatesStats[eachKey].allocation,
        app: eachKey,
      };
      res.push(item);
    });

    if (!lendingStats) return;
    Object.keys(lendingStats).map((eachKey) => {
      Object.keys(lendingStats[eachKey]).map((eachSubKey) => {
        const item: TableInfo = {
          title: eachSubKey,
          action: "Lend",
          apr: lendingStats[eachKey][eachSubKey].strk_grant_apr_nrs,
          volume: lendingStats[eachKey][eachSubKey].supply_usd,
          daily_rewards: lendingStats[eachKey][eachSubKey].allocation,
          app: eachKey,
        };
        res.push(item);
      });
    });

    if (!pairingStats) return;
    Object.keys(pairingStats).map((eachKey) => {
      Object.keys(pairingStats[eachKey]).map((eachSubKey) => {
        const item: TableInfo = {
          title: eachSubKey,
          action: "Pair",
          apr: pairingStats[eachKey][eachSubKey].apr,
          volume: pairingStats[eachKey][eachSubKey].tvl_usd,
          daily_rewards: pairingStats[eachKey][eachSubKey].allocation,
          app: eachKey,
        };
        res.push(item);
      });
    });

    if (!altProtocolStats) return;

    Object.keys(altProtocolStats).map((eachKey) => {
      Object.keys(altProtocolStats[eachKey]).map((eachSubKey) => {
        const item: TableInfo = {
          title: eachSubKey,
          action: "Alt",
          apr: altProtocolStats[eachKey][eachSubKey].apr,
          volume: altProtocolStats[eachKey][eachSubKey].tvl_usd,
          daily_rewards: altProtocolStats[eachKey][eachSubKey].allocation,
          app: eachKey,
        };
        res.push(item);
      });
    });

    setData(res);
  }, []);

  useEffect(() => {
    fetchPageData();
  }, []);
  return (
    <div className="flex w-full flex-col mt-24 gap-8 items-center">
      <div className="w-full h-[400px] bg-primary"></div>
      <div className="w-3/4 p-6 border-[1px] border-[#f4faff4d] rounded-xl">
        <DataTable data={data} />
      </div>
    </div>
  );
}
