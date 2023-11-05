import { useEffect, useState } from "react";
import { memberSince } from "../utils/profile";
import { DeployedTime, QueryError } from "../types/backTypes";

export default function useCreationDate(identity: Identity | undefined) {
  const [sinceDate, setSinceDate] = useState<string | null>(null);

  useEffect(() => {
    if (!identity || !identity.addr) return;
    fetch(
      `${process.env.NEXT_PUBLIC_API_LINK}/get_deployed_time?addr=${identity.addr}`
    )
      .then((res) => res.json())
      .then((data: DeployedTime | QueryError) => {
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
