"use client";

import Link from "next/link";
import React, { useState, useEffect, FunctionComponent } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import styles from "@styles/components/navbar.module.css";
import Button from "./button";
import { useConnect, useAccount, useDisconnect } from "@starknet-react/core";
import ModalMessage from "./modalMessage";
import { useDisplayName } from "@hooks/displayName.tsx";
import { useDomainFromAddress } from "../../hooks/naming";
import { constants } from "starknet";
import { usePathname } from "next/navigation";
import theme from "@styles/theme";
import { FaDiscord, FaTwitter } from "react-icons/fa";
import WalletButton from "@components/navbar/walletButton";
import NotificationIcon from "@components/UI/iconsComponents/icons/notificationIcon";
import ModalNotifications from "@components/UI/notifications/modalNotifications";
import { useNotificationManager } from "@hooks/useNotificationManager";
import NotificationUnreadIcon from "@components/UI/iconsComponents/icons/notificationIconUnread";
import { getPendingBoostClaims } from "@services/apiService";
import { hexToDecimal } from "@utils/feltService";
import CloseFilledIcon from "./iconsComponents/icons/closeFilledIcon";
import { getCurrentNetwork } from "@utils/network";
import { availableConnectors } from "@app/provider";
import { useStarknetkitConnectModal } from "starknetkit";
import Image from "next/image";
import { PendingBoostClaim } from "types/backTypes";
import Typography from "./typography/typography";
import { TEXT_TYPE } from "@constants/typography";
import Hamburger from "./hamburger";

const Navbar: FunctionComponent = () => {
  const currentNetwork = getCurrentNetwork();
  const [nav, setNav] = useState<boolean>(false);
  const { address, account } = useAccount();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const { connectAsync } = useConnect();
  const { disconnect } = useDisconnect();
  const domainOrAddressMinified = useDisplayName(address ?? "");
  const network = currentNetwork === "TESTNET" ? "testnet" : "mainnet";
  const [navbarBg, setNavbarBg] = useState<boolean>(false);
  const [showWallet, setShowWallet] = useState<boolean>(false);
  const route = usePathname();
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const { notifications, unreadNotifications, updateReadStatus } =
    useNotificationManager();
  const [informationNotifications, setInformationNotifications] = useState<
    SQInfoData[]
  >([
    {
      title: "",
      subtext: "",
      link: "",
      linkText: "",
    },
  ]);
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: availableConnectors,
  });

  const fetchAndUpdateNotifications = async () => {
    if (!address) return;
    const res = await getPendingBoostClaims(hexToDecimal(address));
    if (!res) return;
    const finalNotificationsList: SQInfoData[] = [];
    res.forEach((boost: PendingBoostClaim) => {
      const data = {
        title: "Congratulations! 🎉",
        subtext: `You have just won ${parseInt(
          String(boost?.amount / boost?.num_of_winners)
        )} USDC thanks to the "${boost.name}” boost`,
        link: "/quest-boost/" + boost.id,
        linkText: "Claim your reward",
      };
      finalNotificationsList.push(data);
    });
    setInformationNotifications(finalNotificationsList);
  };

  useEffect(() => {
    if (!address) return;
    fetchAndUpdateNotifications();
  }, [address]);

  // Autoconnect
  useEffect(() => {
    const connectToStarknet = async () => {
      if (
        !localStorage.getItem("SQ-connectedWallet") &&
        route !== "/partnership"
      ) {
        connectWallet();
      } else {
        const connectordId = localStorage.getItem("SQ-connectedWallet");
        const connector = availableConnectors.find(
          (item) => item.id === connectordId
        );
        await connectAsync({ connector });
      }
    };
    connectToStarknet();
  }, []);

  useEffect(() => {
    address ? setIsConnected(true) : setIsConnected(false);
  }, [address]);

  useEffect(() => {
    if (!isConnected || !account) return;
    account.getChainId().then((chainId) => {
      const isWrongNetwork =
        (chainId === constants.StarknetChainId.SN_SEPOLIA &&
          network === "mainnet") ||
        (chainId === constants.StarknetChainId.SN_MAIN &&
          network === "testnet");
      setIsWrongNetwork(isWrongNetwork);
    });
  }, [account, network, isConnected]);

  const connectWallet = async () => {
    const { connector } = await starknetkitConnectModal();
    if (!connector) {
      return;
    }
    await connectAsync({ connector });
    localStorage.setItem("SQ-connectedWallet", connector.id);
  };

  function disconnectByClick(): void {
    disconnect();
    setIsConnected(false);
    setIsWrongNetwork(false);
    setShowWallet(false);
    localStorage.removeItem("SQ-connectedWallet");
  }

  function handleNav(): void {
    setNav(!nav);
  }

  function onTopButtonClick(): void {
    if (!isConnected) {
      connectWallet();
    } else {
      setShowWallet(true);
    }
  }

  function topButtonText(): string | undefined {
    const textToReturn = isConnected ? domainOrAddressMinified : "connect";

    return textToReturn;
  }

  const handleScroll = () => {
    if (window.scrollY > 10) {
      setNavbarBg(true);
    } else {
      setNavbarBg(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function openNotificationModal(): void {
    if (!address) return;
    setShowNotifications(true);
    updateReadStatus();
  }

  return (
    <>
      <div className={`fixed w-full z-20`} id="nav">
        <div
          className={`${styles.navbarContainer} ${
            navbarBg ? styles.navbarScrolled : ""
          }`}
        >
          <div className={styles.navbarLogo}>
            <Link href="/" className="modified-cursor-pointer">
              <Image
                className={styles.logo}
                src="/visuals/starknetquestLogo.svg"
                alt="Starknet.id Logo"
                width={70}
                height={70}
                priority
              />
            </Link>
          </div>
          <div>
            <ul className="hidden lg:flex uppercase items-center">
              <Link href="/">
                <li className={styles.menuItem}>Quests</li>
              </Link>
              {isConnected && (
                <Link href={`/${address}`}>
                  <li className={styles.menuItem}>Dashboard</li>
                </Link>
              )}
              {address ? (
                <>
                  <li
                    className={styles.menuItem}
                    onClick={openNotificationModal}
                  >
                    {(unreadNotifications ||
                      informationNotifications[0]?.title?.length > 0) &&
                    address ? (
                      <NotificationUnreadIcon
                        width="24"
                        color={theme.palette.secondary.dark}
                        secondColor="#D32F2F"
                      ></NotificationUnreadIcon>
                    ) : (
                      <NotificationIcon
                        width="24"
                        color={theme.palette.secondary.dark}
                      />
                    )}
                  </li>
                </>
              ) : null}
              <WalletButton
                setShowWallet={setShowWallet}
                showWallet={showWallet}
                connect={connectWallet}
                disconnectByClick={disconnectByClick}
              />
            </ul>
            <div className="lg:hidden">
              <Hamburger active={nav} onClick={handleNav} />
            </div>
          </div>
        </div>

        <div
          className={
            nav
              ? "mt-24 lg:hidden fixed left-0 top-0 w-full h-screen bg-black/10 z-10"//extra margin so page doesnt cover forst navbar buttons
              : ""
          }
        >
          <div
            className={`mt-20 fixed left-0 top-0 w-full sm:w-[60%] lg:w-[45%] h-screen bg-background px-5 ease-in justify-between flex-col overflow-auto ${//extra margin so page doesnt overlap the navbar
              nav ? styles.mobileNavbarShown : styles.mobileNavbarHidden
            }`}
          >
            <div className="h-full flex flex-col">
             <div className="py-4 my-auto text-center font-extrabold">
                <ul className="uppercase text-babe-blue">
                  <Link href="/">
                    <li
                      onClick={() => setNav(false)}
                      className={styles.menuItemSmall}
                    >
                      Quests
                    </li>
                  </Link>
                  {isConnected && (
                    <Link href={`/${address}`}>
                      <li
                        onClick={() => setNav(false)}
                        className={styles.menuItemSmall}
                      >
                        Dashboard
                      </li>
                    </Link>
                  )}
                </ul>
              </div>
            </div>
            <div className="flex flex-col items-center my-4 w-full">
              <div className={styles.connectButtonContainer}>
                <Button onClick={onTopButtonClick}>{topButtonText()}</Button>
              </div>
              <div className="flex">
                <div className={styles.socialIconContainer}>
                  <a
                    href="https://twitter.com/starknet_quest"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaTwitter size={28} color={theme.palette.secondary.main} />
                  </a>
                </div>
                <div className={styles.socialIconContainer}>
                  <a
                    href="https://discord.gg/byEGk6w6T6"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaDiscord size={28} color={theme.palette.secondary.main} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalMessage
        open={isWrongNetwork}
        title={"Wrong network"}
        closeModal={() => setIsWrongNetwork(false)}
        message={
          <div className="mt-3 flex flex-col items-center justify-center text-center">
            <Typography type={TEXT_TYPE.BODY_DEFAULT}>
              This app only supports Starknet {network}, you have to change your
              network to be able use it.
            </Typography>
            <div className="mt-3">
              <Button onClick={() => disconnectByClick()}>
                {`Disconnect`}
              </Button>
            </div>
          </div>
        }
      />
      {showNotifications ? (
        <ModalNotifications
          open={showNotifications}
          closeModal={() => setShowNotifications(false)}
          notifications={notifications}
          informationNotifications={informationNotifications}
        />
      ) : null}
    </>
  );
};

export default Navbar;
