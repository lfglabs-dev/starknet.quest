import { useEffect, useState } from "react";
import { memberSince } from "../utils/profile";

export default function useCreationDate(identity: Identity | undefined) {
  const [sinceDate, setSinceDate] = useState<string | null>(null);

  useEffect(() => {
    if (!identity || !identity.addr) return;
    fetch(
      `https://${
        process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? "api-testnet" : "api"
      }.starkscan.co/api/v0/transactions?from_block=1&limit=1&order_by=asc&contract_address=${
        identity.addr
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": `${process.env.NEXT_PUBLIC_STARKSCAN}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.data[0].timestamp) {
          const sinceData = memberSince(data.data[0].timestamp);
          setSinceDate(sinceData);
        } else {
          setSinceDate(null);
        }
      });
  }, [identity]);

  return sinceDate;
}
