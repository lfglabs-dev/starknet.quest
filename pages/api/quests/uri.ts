import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { QueryError } from "../../../types/backTypes";

type ContractURI = {
  name: string;
  description: string;
  image: string;
  banner_image_url: string;
  external_link: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ContractURI | QueryError>
) {
  await NextCors(req, res, {
    methods: ["GET"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  res.setHeader("cache-control", "max-age=30").status(200).json({
    name: "Starknet Quest",
    description: "The Collection of your Starknet Achievements",
    image: "https://starknet.quest/visuals/starknetquest.webp",
    banner_image_url: "https://starknet.quest/visuals/starknetquestBanner.webp",
    external_link: "https://starknet.quest/",
  });
}
