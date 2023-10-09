import BN from "bn.js";
import { useContext, useEffect, useState } from "react";
import { StarknetIdJsContext } from "../context/StarknetIdJsProvider";
import { utils } from "starknetid.js";

export default function useHasRootOrBraavosDomain(
  address: string | BN | undefined
) {
  const [hasDomain, setHasDomain] = useState(false);
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  useEffect(() => {
    if (!address) return;
    starknetIdNavigator?.getStarkName(address.toString()).then((res) => {
      if (utils.isStarkRootDomain(res) || utils.isBraavosSubdomain(res))
        setHasDomain(true);
    });
  }, [starknetIdNavigator, address]);

  return hasDomain;
}
