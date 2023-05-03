import type { NextApiResponse } from "next";
import { Provider } from "starknet";
import { StarknetIdNavigator, utils } from "starknetid.js";
import {
  CustomNextApiRequest,
  RequestResponse,
} from "../../../../../types/backTypes";

export default async function handler(
  req: CustomNextApiRequest,
  res: NextApiResponse<RequestResponse>
) {
  const { address } = req.query;

  if (!address || Array.isArray(address)) {
    return res
      .status(400)
      .json({ res: false, error_msg: "Invalid address parameter" });
  }

  const provider = new Provider({
    sequencer: {
      network: process.env.NEXT_PUBLIC_IS_TESTNET
        ? "goerli-alpha"
        : "mainnet-alpha",
    },
  });
  const starknetIdNavigator = new StarknetIdNavigator(provider);

  try {
    const name = await starknetIdNavigator.getStarkName(address.toLowerCase());

    utils.isSubdomain(name)
      ? res
          .setHeader("cache-control", "max-age=30")
          .status(200)
          .json({ res: true })
      : res.setHeader("cache-control", "max-age=30").status(200).json({
          res: false,
          error_msg: "Domain is not a subdomain",
        });
  } catch (error) {
    res.status(500).json({
      res: false,
      error_msg:
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Unknown error",
    });
  }
}
