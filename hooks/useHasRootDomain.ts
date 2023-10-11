import BN from "bn.js";
import { useContext, useEffect, useState } from "react";
import { StarknetIdJsContext } from "../context/StarknetIdJsProvider";
import { utils } from "starknetid.js";

export default function useHasRootDomain(address: string | BN | undefined) {
  const [hasRootDomain, setHasRootDomain] = useState(false);
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  useEffect(() => {
    if (!address) return;
    starknetIdNavigator?.getStarkName(address.toString()).then((res) => {
      if (utils.isStarkRootDomain(res)) setHasRootDomain(true);
    });
  }, [starknetIdNavigator, address]);

  return hasRootDomain;
}
