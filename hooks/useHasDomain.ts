import BN from "bn.js";
import { useContext, useEffect, useState } from "react";
import { StarknetIdJsContext } from "../context/StarknetIdJsProvider";
import { hexToDecimal } from "../utils/feltService";

export default function useHasDomain(address: string | BN | undefined) {
  const [domains, setDomains] = useState<string[]>([]);
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  useEffect(() => {
    if (!address) return;
    const fetchDomains = async () => {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_STARKNET_ID_API_LINK
        }/addr_to_full_ids?addr=${hexToDecimal(address.toString())}`
      );
      const ids = (await res.json()).full_ids;
      setDomains(ids.filter((id: Identity) => id.domain));
    };
    fetchDomains();
  }, [starknetIdNavigator, address]);

  return domains.length > 0;
}
