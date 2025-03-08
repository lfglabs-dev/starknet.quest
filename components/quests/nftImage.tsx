"use client";

import React, { FunctionComponent, useState } from "react";
import styles from "@styles/quests.module.css";
import { CDNImg } from "@components/cdn/image";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";

type NftImageProps = {
  nfts: Nft[];
};

const NftImage: FunctionComponent<NftImageProps> = ({ nfts }) => {
  return (
    <div className="flex gap-5 flex-wrap justify-center items-center">
      {nfts?.map((nft, index) => (
        <NFTCard key={index} nft={nft} nfts={nfts} />
      ))}
    </div>
  );
};

const NFTCard: FunctionComponent<{ nft: Nft, nfts: Nft[] }> = ({ nft, nfts }) => {
  const [style, setStyle] = useState({ transform: "scale(1) rotateX(0deg) rotateY(0deg)", transition: "transform 0.3s ease-out" });
  const [glowStyle, setGlowStyle] = useState({ background: "none" });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 8;
    const y = -(e.clientY - top - height / 2) / 8;
    const glowX = (e.clientX - left) / width * 100;
    const glowY = (e.clientY - top) / height * 100;
    setStyle({
      transform: `scale(1.1) rotateX(${y}deg) rotateY(${x}deg)`,
      transition: "transform 0.3s ease-out"
    });
    setGlowStyle({
      background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.4), transparent 50%)`
    });
  };

  const handleMouseLeave = () => {
    setStyle({ transform: "scale(1) rotateX(0deg) rotateY(0deg)", transition: "transform 0.3s ease-out" });
    setGlowStyle({ background: "none" });
  };

  return (
    <div
      className="flex justify-center items-center flex-col relative"
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute w-full h-full rounded-lg" style={{ ...glowStyle, pointerEvents: "none" }}></div>
      <CDNImg className={styles.nftStyle} src={nft.imgSrc} />
      {nft.level && nfts.length > 1 ? (
        <Typography type={TEXT_TYPE.BODY_DEFAULT} className={styles.level}>Level {nft.level}</Typography>
      ) : null}
    </div>
  );
};

export default NftImage;
