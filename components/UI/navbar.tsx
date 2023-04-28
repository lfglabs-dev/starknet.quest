import Link from "next/link";
import React, { useState, useEffect, FunctionComponent } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import styles from "../../styles/components/navbar.module.css";
import Button from "./button";
import { useConnectors, useAccount, useStarknet } from "@starknet-react/core";
import Wallets from "./wallets";
import LogoutIcon from "@mui/icons-material/Logout";
import ModalMessage from "./modalMessage";
import { useDisplayName } from "../../hooks/displayName.tsx";
import { useDomainFromAddress } from "../../hooks/naming";

const Navbar: FunctionComponent = () => {
  const [nav, setNav] = useState<boolean>(false);
  const [hasWallet, setHasWallet] = useState<boolean>(true);
  const { address } = useAccount();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  const { available, connect, disconnect } = useConnectors();
  const { library } = useStarknet();
  const domainOrAddressMinified = useDisplayName(address ?? "");
  const domain = useDomainFromAddress(address ?? "").domain;
  const addressOrDomain =
    domain && domain.endsWith(".stark") ? domain : address;
  const secondary = "#f4faff";
  const network =
    process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? "testnet" : "mainnet";
  const [navbarBg, setNavbarBg] = useState<boolean>(false);

  function disconnectByClick(): void {
    disconnect();
    setIsConnected(false);
    setIsWrongNetwork(false);
  }

  useEffect(() => {
    address ? setIsConnected(true) : setIsConnected(false);
  }, [address]);

  useEffect(() => {
    if (!isConnected) return;

    const STARKNET_NETWORK = {
      mainnet: "0x534e5f4d41494e",
      testnet: "0x534e5f474f45524c49",
    };

    if (library.chainId === STARKNET_NETWORK.testnet && network === "mainnet") {
      setIsWrongNetwork(true);
    } else if (
      library.chainId === STARKNET_NETWORK.mainnet &&
      network === "testnet"
    ) {
      setIsWrongNetwork(true);
    } else {
      setIsWrongNetwork(false);
    }
  }, [library, network, isConnected]);

  function handleNav(): void {
    setNav(!nav);
  }

  function onTopButtonClick(): void {
    if (available.length > 0) {
      if (available.length === 1) {
        connect(available[0]);
      } else {
        setHasWallet(true);
      }
    } else {
      setHasWallet(true);
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

  return (
    <>
      <div className={`fixed w-full z-[1]`}>
        <div
          className={`${styles.navbarContainer} ${
            navbarBg ? styles.navbarScrolled : ""
          }`}
        >
          <div className="ml-4">
            <Link href="/" className="cursor-pointer">
              <img
                className="cursor-pointer"
                src="/visuals/starkpathLogo.svg"
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
              <Link href={`/${addressOrDomain}`}>
                <li className={styles.menuItem}>My profile</li>
              </Link>
              {/* Note: I'm not sure that our testnet will be public so we don't show any link  */}
              {/* <SelectNetwork network={network} /> */}
              <div className="text-background ml-5 mr-5">
                <Button
                  onClick={
                    isConnected
                      ? () => disconnectByClick()
                      : available.length === 1
                      ? () => connect(available[0])
                      : () => setHasWallet(true)
                  }
                >
                  {isConnected ? (
                    <div className="flex justify-center items-center">
                      <div>{domainOrAddressMinified}</div>
                      <LogoutIcon className="ml-3" />
                    </div>
                  ) : (
                    "connect"
                  )}
                </Button>
              </div>
            </ul>
            <div onClick={handleNav} className="lg:hidden">
              <AiOutlineMenu color={secondary} size={25} className="mr-3" />
            </div>
          </div>
        </div>

        <div
          className={
            nav
              ? "lg:hidden fixed left-0 top-0 w-full h-screen bg-black/10"
              : ""
          }
        >
          <div
            className={
              nav
                ? "fixed left-0 top-0 w-[75%] sm:w-[60%] lg:w-[45%] h-screen bg-background p-10 ease-in duration-500 flex justify-between flex-col"
                : "fixed left-[-100%] top-0 p-10 ease-in h-screen flex justify-between flex-col"
            }
          >
            <div>
              <div className="flex w-full items-center justify-between">
                <div className="">
                  <Link href="/">
                    <img
                      src="/visuals/starkpathLogo.svg"
                      alt="Starkpath Logo"
                      width={70}
                      height={70}
                    />
                  </Link>
                </div>

                <div
                  onClick={handleNav}
                  className="rounded-full cursor-pointer"
                >
                  <AiOutlineClose color={secondary} />
                </div>
              </div>
              <div className="border-b border-secondary my-4">
                <p className="w-[85%] lg:w-[90%] py-4 text-babe-blue">
                  Grow your starknet profile
                </p>
              </div>
              <div className="py-4 flex flex-col">
                <ul className="uppercase text-babe-blue">
                  <Link href="/">
                    <li
                      onClick={() => setNav(false)}
                      className={styles.menuItemSmall}
                    >
                      Quests
                    </li>
                  </Link>
                  <Link href="/profile">
                    <li
                      onClick={() => setNav(false)}
                      className={styles.menuItemSmall}
                    >
                      My profile
                    </li>
                  </Link>
                </ul>
              </div>
            </div>

            <div>
              <p className="uppercase tracking-widest white">
                Grow you starknet profile
              </p>
              <div className="flex items-center my-4 w-full sm:w-[80%]">
                <div className="text-background">
                  <Button onClick={onTopButtonClick}>{topButtonText()}</Button>
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
    </>
  );
};

export default Navbar;
