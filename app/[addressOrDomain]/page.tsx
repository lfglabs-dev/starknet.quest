"use client";

import React, { useContext, useEffect, useState } from "react";
import styles from "@styles/profile.module.css";
import { useRouter, usePathname } from "next/navigation";
import { isHexString } from "@utils/stringService";
import { useAccount } from "@starknet-react/core";
import { StarknetIdJsContext } from "@context/StarknetIdJsProvider";
import { hexToDecimal } from "@utils/feltService";
import { minifyAddress } from "@utils/stringService";
import { utils } from "starknetid.js";
import ErrorScreen from "@components/UI/screens/errorScreen";
import { Land } from "@components/lands/land";
import { useMediaQuery } from "@mui/material";
import ProfileCards from "@components/UI/profileCards";
import useCreationDate from "@hooks/useCreationDate";

type AddressOrDomainProps = {
  params: {
    addressOrDomain: string;
  };
};

export default function Page({ params }: AddressOrDomainProps) {
  const router = useRouter();
  const addressOrDomain = params.addressOrDomain;
  const { address } = useAccount();
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  const [initProfile, setInitProfile] = useState(false);
  const [identity, setIdentity] = useState<Identity>();
  const [notFound, setNotFound] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const dynamicRoute = usePathname();
  const isMobile = useMediaQuery("(max-width:768px)");
  const [achievements, setAchievements] = useState<BuildingsInfo[]>([]);
  const [soloBuildings, setSoloBuildings] = useState<StarkscanNftProps[]>([]);
  const sinceDate = useCreationDate(identity);

  useEffect(() => setNotFound(false), [dynamicRoute]);

  useEffect(() => {
    setInitProfile(false);
    setAchievements([]);
    setSoloBuildings([]);
  }, [address, addressOrDomain]);

  useEffect(() => {
    if (!address) setIsOwner(false);
  }, [address]);

  useEffect(() => {
    console.log({ addressOrDomain });
    if (
      typeof addressOrDomain === "string" &&
      addressOrDomain?.toString().toLowerCase().endsWith(".stark")
    ) {
      if (
        !utils.isBraavosSubdomain(addressOrDomain) &&
        !utils.isXplorerSubdomain(addressOrDomain)
      ) {
        starknetIdNavigator
          ?.getStarknetId(addressOrDomain)
          .then((id) => {
            console.log({ id });
            getIdentityData(id).then((data: Identity) => {
              if (data.error) {
                setNotFound(true);
                return;
              }
              setIdentity({
                ...data,
                starknet_id: id.toString(),
              });
              if (hexToDecimal(address) === hexToDecimal(data.addr))
                setIsOwner(true);
              setInitProfile(true);
            });
          })
          .catch((error) => {
            console.log({ error });
            return;
          });
      } else {
        starknetIdNavigator
          ?.getAddressFromStarkName(addressOrDomain)
          .then((addr) => {
            setIdentity({
              starknet_id: "0",
              addr: addr,
              domain: addressOrDomain,
              is_owner_main: false,
            });
            setInitProfile(true);
            if (hexToDecimal(address) === hexToDecimal(addr)) setIsOwner(true);
          })
          .catch((error) => {
            console.log({ error });
            return;
          });
      }
    } else if (
      typeof addressOrDomain === "string" &&
      isHexString(addressOrDomain)
    ) {
      starknetIdNavigator
        ?.getStarkName(hexToDecimal(addressOrDomain))
        .then((name) => {
          if (name) {
            if (
              !utils.isBraavosSubdomain(name) &&
              !utils.isXplorerSubdomain(name)
            ) {
              starknetIdNavigator
                ?.getStarknetId(name)
                .then((id) => {
                  getIdentityData(id).then((data: Identity) => {
                    if (data.error) return;
                    setIdentity({
                      ...data,
                      starknet_id: id.toString(),
                    });
                    if (hexToDecimal(address) === hexToDecimal(data.addr))
                      setIsOwner(true);
                    setInitProfile(true);
                  });
                })
                .catch((error) => {
                  console.log({ error });
                  return;
                });
            } else {
              setIdentity({
                starknet_id: "0",
                addr: addressOrDomain,
                domain: name,
                is_owner_main: false,
              });
              setInitProfile(true);
              if (hexToDecimal(addressOrDomain) === hexToDecimal(address))
                setIsOwner(true);
            }
          } else {
            setIdentity({
              starknet_id: "0",
              addr: addressOrDomain,
              domain: minifyAddress(addressOrDomain),
              is_owner_main: false,
            });
            setIsOwner(false);
            setInitProfile(true);
          }
        })
        .catch((error) => {
          setIdentity({
            starknet_id: "0",
            addr: addressOrDomain,
            domain: minifyAddress(addressOrDomain),
            is_owner_main: false,
          });
          console.log({ error });
          setInitProfile(true);
          if (hexToDecimal(addressOrDomain) === hexToDecimal(address))
            setIsOwner(true);
        });
    } else {
      setNotFound(true);
    }
  }, [addressOrDomain, address, dynamicRoute]);

  if (notFound) {
    return (
      <ErrorScreen
        errorMessage="Profile or Page not found"
        buttonText="Go back to quests"
        onClick={() => router.push("/")}
      />
    );
  }

  const getIdentityData = async (id: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STARKNET_ID_API_LINK}/id_to_data?id=${id}`
    );
    return response.json();
  };

  return (
    <div className={styles.profileBg}>
      {initProfile && identity ? (
        <>
          <Land
            address={identity.addr}
            isOwner={isOwner}
            isMobile={isMobile}
            setAchievements={setAchievements}
            setSoloBuildings={setSoloBuildings}
          />
          <div className={styles.profiles}>
            <ProfileCards
              title={"Profile"}
              identity={identity}
              addressOrDomain={addressOrDomain}
              sinceDate={sinceDate}
              achievements={achievements}
              soloBuildings={soloBuildings}
            />
          </div>
        </>
      ) : (
        <div
          className={`h-screen flex justify-center items-center ${styles.name}`}
        >
          <h2>Loading</h2>
        </div>
      )}
    </div>
  );
}
