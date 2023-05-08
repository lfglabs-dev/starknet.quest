import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { QueryError } from "../../../../types/backTypes";

type TokenURI = {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number | Array<string>;
  }>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TokenURI | QueryError>
) {
  await NextCors(req, res, {
    methods: ["GET"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  const { level } = req.query;
  const levelInt = Number(level);

  function getLevel(levelInt: number) {
    // switch statement to return bronze if level 1, silver if level 2, gold if level 3
    switch (levelInt) {
      case 2:
        return "silver";
      case 3:
        return "gold";
      default:
        return "bronze";
    }
  }

  if (levelInt > 0 && levelInt <= 3) {
    res
      .setHeader("cache-control", "max-age=30")
      .status(200)
      .json({
        name: `StarkFighter ${getLevel(levelInt)} arcade`,
        description: "A starknet.quest NFT won during the Starkfighter event.",
        image: `${process.env.NEXT_PUBLIC_APP_LINK}/starkfighter/level${level}.webp`,
        attributes: [
          {
            trait_type: "level",
            value: levelInt,
          },
        ],
      });
  } else {
    res
      .setHeader("cache-control", "max-age=30")
      .status(500)
      .json({ error: "Error, this level is not correct" });
  }
}
