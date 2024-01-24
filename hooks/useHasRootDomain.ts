import BN from "bn.js";
import { useEffect, useState } from "react";
import { utils } from "starknetid.js";
import { hexToDecimal } from "@utils/feltService";

export default function useHasRootDomain(
  mandatoryDomain: string | null,
  address: string | BN | undefined
) {
  const [hasRootDomain, setHasRootDomain] = useState(false);

  useEffect(() => {
    if (!address) return;
    if (mandatoryDomain === "none") setHasRootDomain(true);
    fetch(
      `${
        process.env.NEXT_PUBLIC_STARKNET_ID_API_LINK
      }/addr_to_domain?addr=${hexToDecimal(address.toString())}`
    )
      .then((res) => res.json())
      .then((data) => {
        switch (mandatoryDomain) {
          case null:
          case "root":
            if (utils.isStarkRootDomain(data.domain)) setHasRootDomain(true);
            break;
          case "braavos":
            if (
              utils.isStarkRootDomain(data.domain) ||
              utils.isBraavosSubdomain(data.domain)
            )
              setHasRootDomain(true);
            break;
          default:
            break;
        }
      })
      .catch((err) => {
        console.log("Error fetching domain", err);
        setHasRootDomain(false);
      });
  }, [address, mandatoryDomain]);

  return hasRootDomain;
}
