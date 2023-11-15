"use client";

import Link from "next/link";
import React, {
  useState,
  useEffect,
  FunctionComponent,
  useCallback,
} from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import styles from "../../styles/components/navbar.module.css";
import Button from "./button";
import {
  useConnect,
  useAccount,
  Connector,
  useDisconnect,
} from "@starknet-react/core";
import Wallets from "./wallets";
import ModalMessage from "./modalMessage";
import { useDisplayName } from "../../hooks/displayName.tsx";
import { useDomainFromAddress } from "../../hooks/naming";
import { constants } from "starknet";
import { usePathname } from "next/navigation";
import theme from "../../styles/theme";
import { FaDiscord, FaTwitter } from "react-icons/fa";
import WalletButton from "../navbar/walletButton";
import NotificationIcon from "./iconsComponents/icons/notificationIcon";
import ModalNotifications from "./notifications/modalNotifications";
import { useNotificationManager } from "../../hooks/useNotificationManager";
import NotificationUnreadIcon from "./iconsComponents/icons/notificationIconUnread";

const Navbar: FunctionComponent = () => {
  const [nav, setNav] = useState<boolean>(false);
  const [hasWallet, setHasWallet] = useState<boolean>(false);
  const { address, account } = useAccount();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const domainOrAddressMinified = useDisplayName(address ?? "");
  const domain = useDomainFromAddress(address ?? "").domain;
  const addressOrDomain =
    domain && domain.endsWith(".stark") ? domain : address;
  const network =
    process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? "testnet" : "mainnet";
  const [navbarBg, setNavbarBg] = useState<boolean>(false);
  const [showWallet, setShowWallet] = useState<boolean>(false);
  const route = usePathname();
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const { notifications, unreadNotifications, updateReadStatus } =
    useNotificationManager();

  useEffect(() => {
    // to handle autoconnect starknet-react adds connector id in local storage
    // if there is no value stored, we show the wallet modal
    const timeout = setTimeout(() => {
      if (!address) {
        if (
          !localStorage.getItem("lastUsedConnector") &&
          route !== "/partnership"
        ) {
          if (connectors.length > 0) setHasWallet(true);
        } else {
          const lastConnectedConnectorId =
            localStorage.getItem("lastUsedConnector");
          if (lastConnectedConnectorId === null) return;

          const lastConnectedConnector = connectors.find(
            (connector) => connector.id === lastConnectedConnectorId
          );
          if (lastConnectedConnector === undefined) return;
          tryConnect(lastConnectedConnector);
        }
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    address ? setIsConnected(true) : setIsConnected(false);
  }, [address]);

  useEffect(() => {
    if (!isConnected || !account) return;
    account.getChainId().then((chainId) => {
      const isWrongNetwork =
        (chainId === constants.StarknetChainId.SN_GOERLI &&
          network === "mainnet") ||
        (chainId === constants.StarknetChainId.SN_MAIN &&
          network === "testnet");
      setIsWrongNetwork(isWrongNetwork);
    });
  }, [account, network, isConnected]);

  const tryConnect = useCallback(
    async (connector: Connector) => {
      if (address) return;
      if (await connector.ready()) {
        connect({ connector });

        return;
      }
    },
    [address, connectors]
  );

  function disconnectByClick(): void {
    disconnect();
    setIsConnected(false);
    setIsWrongNetwork(false);
    setShowWallet(false);
  }

  function handleNav(): void {
    setNav(!nav);
  }

  function onTopButtonClick(): void {
    if (!isConnected) {
      setHasWallet(true);
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
          <div className="ml-4">
            <Link href="/" className="cursor-pointer">
              <img
                className="cursor-pointer"
                src="/visuals/starknetquestLogo.svg"
                alt="Starknet.id Logo"
                width={70}
                height={70}
              />
            </Link>
          </div>
          <div>
            <ul className="hidden lg:flex uppercase items-center">
              <Link href="/">
                <li className={styles.menuItem}>Quests</li>
              </Link>
              <Link href="/achievements">
                <li className={styles.menuItem}>Achievements</li>
              </Link>
              <Link href="/leaderboard">
                <li className={styles.menuItem}>Leaderboard</li>
              </Link>
              {address ? (
                <>
                  <Link
                    href={`/${address ? addressOrDomain : "not-connected"}`}
                  >
                    <li className={styles.menuItem}>My land</li>
                  </Link>
                  <li
                    className={styles.menuItem}
                    onClick={openNotificationModal}
                  >
                    {unreadNotifications && address ? (
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
                refreshAndShowWallet={() => setHasWallet(true)}
                disconnectByClick={disconnectByClick}
              />
            </ul>
            <div onClick={handleNav} className="lg:hidden">
              <AiOutlineMenu
                color={theme.palette.secondary.main}
                size={25}
                className="mr-3"
              />
            </div>
          </div>
        </div>

        <div
          className={
            nav
              ? "lg:hidden fixed left-0 top-0 w-full h-screen bg-black/10 z-10"
              : ""
          }
        >
          <div
            className={
              nav
                ? "fixed left-0 top-0 w-full sm:w-[60%] lg:w-[45%] h-screen bg-background px-5 ease-in duration-500 flex justify-between flex-col"
                : "fixed left-[-100%] top-0 p-10 ease-in h-screen flex justify-between flex-col"
            }
          >
            <div className="h-full flex flex-col">
              <div className="flex w-full items-center justify-between">
                <div>
                  <Link href="/">
                    <img
                      src="/visuals/starknetquestLogo.svg"
                      alt="Starknet Quest Logo"
                      width={70}
                      height={70}
                    />
                  </Link>
                </div>

                <div
                  onClick={handleNav}
                  className="rounded-lg cursor-pointer p-1"
                >
                  <AiOutlineClose color={theme.palette.secondary.main} />
                </div>
              </div>
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
                  <Link href="/achievements">
                    <li
                      onClick={() => setNav(false)}
                      className={styles.menuItemSmall}
                    >
                      Achievements
                    </li>
                  </Link>
                  {address ? (
                    <Link
                      href={`/${address ? addressOrDomain : "not-connected"}`}
                    >
                      <li
                        onClick={() => setNav(false)}
                        className={styles.menuItemSmall}
                      >
                        My land
                      </li>
                    </Link>
                  ) : null}
                  <Link href="/leaderboard">
                    <li
                      onClick={() => setNav(false)}
                      className={styles.menuItemSmall}
                    >
                      Leaderboard
                    </li>
                  </Link>
                </ul>
              </div>
            </div>
            <div className="flex flex-col items-center my-4 w-full">
              <div className="text-background">
                <Button onClick={onTopButtonClick}>{topButtonText()}</Button>
              </div>
              <div className="flex">
                <div className="rounded-full shadow-gray-400 p-3 cursor-pointer hover:scale-105 ease-in duration-300 mt-2">
                  <a
                    href="https://twitter.com/starknet_quest"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaTwitter size={28} color={theme.palette.secondary.main} />
                  </a>
                </div>
                <div className="rounded-full shadow-gray-400 p-3 cursor-pointer hover:scale-105 ease-in duration-300 mt-2">
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
            <p>
              This app only supports Starknet {network}, you have to change your
              network to be able use it.
            </p>
            <div className="mt-3">
              <Button onClick={() => disconnectByClick()}>
                {`Disconnect`}
              </Button>
            </div>
          </div>
        }
      />
      <Wallets
        closeWallet={() => setHasWallet(false)}
        hasWallet={Boolean(hasWallet && !isWrongNetwork)}
      />
      {showNotifications ? (
        <ModalNotifications
          open={showNotifications}
          closeModal={() => setShowNotifications(false)}
          notifications={notifications}
        />
      ) : null}
    </>
  );
};

export default Navbar;
