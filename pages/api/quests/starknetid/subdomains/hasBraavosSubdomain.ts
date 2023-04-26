import type { NextApiRequest, NextApiResponse } from "next";
import { Provider } from "starknet";
import { StarknetIdNavigator } from "starknetid.js";
import { RequestResponse } from "../../../../../types/backTypes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RequestResponse>
) {
  const {
    query: { address },
  } = req;

  if (!address || Array.isArray(address)) {
    return res
      .status(400)
      .json({ res: false, error_msg: "Invalid address parameter" });
  }

  const provider = new Provider({
    sequencer: {
      network: "mainnet-alpha",
    },
  });
  const starknetIdNavigator = new StarknetIdNavigator(provider);

  try {
    const name = await starknetIdNavigator.getStarkName(address.toLowerCase());

    name.endsWith(".braavos.stark")
      ? res
          .setHeader("cache-control", "max-age=30")
          .status(200)
          .json({ res: true })
      : res.setHeader("cache-control", "max-age=30").status(200).json({
          res: false,
          error_msg: "Domain is not a braavos subdomain",
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
