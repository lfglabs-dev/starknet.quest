import type { NextApiRequest, NextApiResponse } from "next";
import { Provider } from "starknet";
import { StarknetIdNavigator } from "starknetid.js";
import { RequestProps, RequestResponse } from "../../../../types/backTypes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RequestResponse>
) {
  const { address }: RequestProps = req.body;

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
    const _name = await starknetIdNavigator.getStarkName(address.toLowerCase());
    res
      .setHeader("cache-control", "max-age=30")
      .status(200)
      .json({ res: true });
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
