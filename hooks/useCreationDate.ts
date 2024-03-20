import { useEffect, useState } from "react";
import { memberSince } from "@utils/profile";
import { DeployedTime, QueryError } from "types/backTypes";
import { getDeployedTimeByAddress } from "@services/apiService";

export default function useCreationDate(identity: Identity | undefined) {
  const [sinceDate, setSinceDate] = useState<string | null>(null);

  useEffect(() => {
    if (!identity || !identity.addr) return;
      getDeployedTimeByAddress(identity.addr).then((data) => {
        if (data as DeployedTime) {
          const sinceData = memberSince((data as DeployedTime).timestamp);
          setSinceDate(sinceData);
        } else {
          setSinceDate(null);
        }
      })
      .catch((_) => {
        setSinceDate(null);
      });
  }, [identity]);

  return sinceDate;
}