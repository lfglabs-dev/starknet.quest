import type { NextApiRequest, NextApiResponse } from "next";
import { Provider } from "starknet";
import { StarknetIdNavigator } from "starknetid.js";
import { RequestResponse } from "../../../../types/backTypes";

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
    const _name = await starknetIdNavigator.getStarkName(address.toLowerCase());
    res
      .setHeader("cache-control", "max-age=30")
      .status(200)
      .json({ res: true });
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ res: false, error_msg: error.message });
  }
}
