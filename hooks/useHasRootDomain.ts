import BN from "bn.js";
import { useContext, useEffect, useState } from "react";
import { StarknetIdJsContext } from "../context/StarknetIdJsProvider";
import { hexToDecimal } from "../utils/feltService";

export default function useHasRootDomain(address: string | BN | undefined) {
  const [hasRootDomain, setHasRootDomain] = useState(false);
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  useEffect(() => {
    if (!address) return;
    fetch(
      `${
        process.env.NEXT_PUBLIC_STARKNET_ID_API_LINK
      }/addr_to_domain?addr=${hexToDecimal(address.toString())}`
    ).then((res) => res.status === 200 && setHasRootDomain(true));
  }, [starknetIdNavigator, address]);

  return hasRootDomain;
}
