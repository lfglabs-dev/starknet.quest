import React, { FunctionComponent, useContext, useEffect, useState } from "react";
import styles from "@styles/dashboard.module.css";
import CopyIcon from "@components/UI/iconsComponents/icons/copyIcon";
import ShareIcon from "@components/UI/iconsComponents/icons/shareIcon";
import { CDNImage } from "@components/cdn/image";
import { useAccount, useStarkProfile } from "@starknet-react/core";
import { isHexString, minifyAddress, minifyAddressFromStrings } from "@utils/stringService";
import TrophyIcon from "../iconsComponents/icons/trophyIcon";
import xpUrl from "public/icons/xpBadge.svg";
import { getCompletedQuests } from "@services/apiService";
import { decimalToHex, hexToDecimal } from "@utils/feltService";
import { getDomainFromAddress } from "@utils/domainService";
import useCreationDate from "@hooks/useCreationDate";
import { calculatePercentile } from "@utils/numberService";
import { utils } from "starknetid.js";
import { StarknetIdJsContext } from "@context/StarknetIdJsProvider";
import ErrorScreen from "../screens/errorScreen";
import router from "next/router";
import SocialMediaActions from "../actions/socialmediaActions";
import trophyUrl from "public/icons/trophy.svg";
import starkUrl from "public/icons/starknet.svg";




const ProfileCard: FunctionComponent<ProfileCardModified> = ({
  addressOrDomain,
  data,
  userPercentile,
  achievemenets
}) => {
  
  const [copied, setCopied] = useState(false);
  const [ displayData, setDisplayData] = useState<FormattedRankingProps>([]);
  const { address } = useAccount();
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  const [identity, setIdentity] = useState<Identity>(); 
  const sinceDate = useCreationDate(identity); 
  const { data: profileData } = useStarkProfile({ address });
  const [notFound, setNotFound] = useState(false);
  const [initProfile, setInitProfile] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const copyToClipboard = () => {
    setCopied(true);
    navigator.clipboard.writeText(identity?.addr as string);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  useEffect(() => {
    if (!data) return;
    if (!(Object.keys(data).length > 0)) return;
    const res: FormattedRankingProps = data?.ranking;
    const makeCall = async () => {
      await Promise.all(
        await res?.map(async (item) => {
          // fetch completed quests and add to the display data
          if (address != undefined) {
            const completedQuestsResponse = await getCompletedQuests(address);
            item.completedQuests = completedQuestsResponse?.length;
          } else {
            const completedQuestsResponse = 0;
            item.completedQuests = 0;
          }

          // get the domain name from the address
          const hexAddress = decimalToHex(address);
          const domainName = await getDomainFromAddress(hexAddress);
          if (domainName.length > 0) {
            item.displayName = domainName;
          } else {
            item.displayName = minifyAddress(hexAddress);
          }
        })
      );
      setDisplayData(res);
    };
    makeCall();
  }, [data]);

  useEffect(() => { 
    if (
      typeof address === "string" &&
      address?.toString().toLowerCase().endsWith(".stark")
    ) {
      if (
        !utils.isBraavosSubdomain(address) &&
        !utils.isXplorerSubdomain(address)
      ) {
        starknetIdNavigator
          ?.getStarknetId(address)
          .then((id) => {
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
          .catch(() => {
            return;
          });
      } else {
        starknetIdNavigator
          ?.getAddressFromStarkName(address)
          .then((addr) => {
            setIdentity({
              starknet_id: "0",
              addr: addr,
              domain: address,
              is_owner_main: false,
            });
            setInitProfile(true);
            if (hexToDecimal(address) === hexToDecimal(addr)) setIsOwner(true);
          })
          .catch(() => {
            return;
          });
      }
    } else if (
      typeof address === "string" &&
      isHexString(address)
    ) {
      starknetIdNavigator
        ?.getStarkName(hexToDecimal(address))
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
                .catch(() => {
                  return;
                });
            } else {
              setIdentity({
                starknet_id: "0",
                addr: address,
                domain: name,
                is_owner_main: false,
              });
              setInitProfile(true);
              if (hexToDecimal(address) === hexToDecimal(address))
                setIsOwner(true);
            }
          } else {
            setIdentity({
              starknet_id: "0",
              addr: address,
              domain: minifyAddress(address),
              is_owner_main: false,
            });
            setIsOwner(false);
            setInitProfile(true);
          }
        })
        .catch(() => {
          setIdentity({
            starknet_id: "0",
            addr: address,
            domain: minifyAddress(address),
            is_owner_main: false,
          });
          setInitProfile(true);
          if (hexToDecimal(address) === hexToDecimal(address))
            setIsOwner(true);
        });
    } else {
      setNotFound(true);
    }
  }, [address]);


  const getIdentityData = async (id: string) => { 
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STARKNET_ID_API_LINK}/id_to_data?id=${id}`
    );
    return response.json();
  };

  if (!identity) {
      return <div>Loading profile data...</div>;
  }


  return (
    
    <div className={styles.dashboard_profile_card}>
      <div className={`${styles.left} ${styles.child}`}>
        <div className={styles.profile_picture_div}>
          <img
            className={styles.profile_picture_img}
            src={profileData?.profilePicture}
          />
        </div>
      </div>
      <div className={`${styles.center} ${styles.child}`}>
        <p className={styles.profile_paragraph0}>{ sinceDate? sinceDate : "" } ago</p>
        <h2 className={styles.profile_name}>{profileData?.name}</h2>
        <div className={styles.address_div}>
          <div onClick={() => copyToClipboard()}>
            <CopyIcon width={"20"} color="#F4FAFF" />
          </div>
        <p className={styles.profile_paragraph}>{typeof address === "string" && minifyAddressFromStrings([address, identity?.addr || ""],8)}
        </p>
        </div>
        <p className={styles.profile_paragraph2}>
          You are <span className={styles.green_span}>better than {userPercentile}%</span> of other players.
        </p>
      </div>
      <div className={`${styles.right} ${styles.child}`}>
        <div className={styles.right_top}>
          <div className={styles.right_socials}>
            <SocialMediaActions identity={identity}/>
          </div>
          <div className={styles.right_share_button}>
            <ShareIcon width="20" color="white" />
            <p className={styles.profile_paragraph}> Share </p>
          </div>
        </div>
        <div className={styles.right_middle}></div>
        <div className={styles.right_bottom}>
          <div className={styles.right_bottom_content}>
            <CDNImage src={starkUrl} priority width={20} height={20} alt="STRK"/>
            <p className={styles.profile_paragraph}>{0}</p>
          </div>
          <div className={styles.right_bottom_content}>
            <CDNImage src={trophyUrl} priority width={20} height={20} alt="achievements"/>
            <p className={styles.profile_paragraph}>{0}</p>
          </div>
          <div className={styles.right_bottom_content}>
            <CDNImage src={xpUrl} priority width={20} height={20} alt="xp badge" />
            <p className={styles.profile_paragraph}>{0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;