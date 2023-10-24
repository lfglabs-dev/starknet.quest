import BN from "bn.js";
import { useContext, useEffect, useState } from "react";
import { StarknetIdJsContext } from "../context/StarknetIdJsProvider";
import { utils } from "starknetid.js";

export default function useHasRootDomain(
  mandatoryDomain: string | null,
  address: string | BN | undefined
) {
  const [hasRootDomain, setHasRootDomain] = useState(false);
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);

  useEffect(() => {
    if (!address) return;
    if (mandatoryDomain === "none") setHasRootDomain(true);
    starknetIdNavigator?.getStarkName(address.toString()).then((res) => {
      switch (mandatoryDomain) {
        case null:
        case "root":
          if (utils.isStarkRootDomain(res)) setHasRootDomain(true);
          break;
        case "braavos":
          if (utils.isStarkRootDomain(res) || utils.isBraavosSubdomain(res))
            setHasRootDomain(true);
          break;
        default:
          break;
      }
    });
  }, [starknetIdNavigator, address, mandatoryDomain]);

  return hasRootDomain;
}
