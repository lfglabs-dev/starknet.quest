import BN from "bn.js";
import { useContext, useEffect, useState } from "react";
import { StarknetIdJsContext } from "@context/StarknetIdJsProvider";
import { basicAlphabet } from "@constants/common";

type DomainData = {
  domain: string;
  error?: string;
};

export function useDomainFromAddress(
  address: string | BN | undefined
): DomainData {
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  const [domain, setDomain] = useState<string>("");
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!address) return;
    console.log("============================");
    const fetchStarkName = async () => {
      const domain = await starknetIdNavigator
        ?.getStarkName(address.toString())
        .catch((err) => {
          console.log("err", err);
          setError(err);
        });
      console.error("aaa", domain);
      setDomain(domain as string);
    };
    fetchStarkName();
    const interval = setInterval(() => {
      fetchStarkName();
    }, 1000);
    return () => clearInterval(interval);
  }, [starknetIdNavigator, address]);

  return { domain, error };
}

type AddressData = {
  address?: string;
  error?: string;
};

export function useAddressFromDomain(domain: string): AddressData {
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  const [address, setAddress] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!domain) return;
    const fetchAddress = async () => {
      const addr = await starknetIdNavigator
        ?.getAddressFromStarkName(domain)
        .catch((err) => {
          setError(err);
        });
      setAddress(addr as string);
    };
    fetchAddress();
  }, [starknetIdNavigator, domain]);

  return { address, error };
}

export function useIsValid(domain: string | undefined): boolean | string {
  if (!domain) domain = "";

  for (const char of domain) if (!basicAlphabet.includes(char)) return char;
  return true;
}

type TokenIdData = {
  tokenId?: string;
  error?: string;
};

export function useTokenIdFromDomain(domain: string): TokenIdData {
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  const [tokenId, setTokenId] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!domain) return;
    const fetchAddress = async () => {
      const token = await starknetIdNavigator
        ?.getStarknetId(domain)
        .catch((err) => {
          setError(err);
        });
      setTokenId(token as string);
    };
    fetchAddress();
  }, [starknetIdNavigator, domain]);

  return { tokenId, error };
}
