import type { NextApiResponse } from "next";
import { Contract, Provider } from "starknet";
import { StarknetIdNavigator, utils } from "starknetid.js";
import naming_abi from "../../../../../abi/naming_abi.json";
import BN from "bn.js";
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
      network:
        process.env.NEXT_PUBLIC_IS_TESTNET === "true"
          ? "goerli-alpha"
          : "mainnet-alpha",
    },
  });
  const starknetIdNavigator = new StarknetIdNavigator(provider);

  try {
    const name = await starknetIdNavigator.getStarkName(address.toLowerCase());

    if (utils.isStarkRootDomain(name)) {
      const namingContract = new Contract(
        naming_abi,
        process.env.NEXT_PUBLIC_NAMING_CONTRACT as string,
        provider
      );
      const data = await namingContract.call("domain_to_expiry", [
        utils.encodeDomain(name).map((elem) => new BN(elem.toString())),
      ]);

      const currentTimeStamp = new Date().getTime() / 1000;
      if (Number(data?.["expiry"]) >= currentTimeStamp + 86400 * 365) {
        res
          .setHeader("cache-control", "max-age=30")
          .status(200)
          .json({ res: true });
      } else {
        res.status(400).json({ res: false, error_msg: "Expiry is lower" });
      }
    } else {
      res
        .status(400)
        .json({ res: false, error_msg: "Domain is not a root domain" });
    }
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
