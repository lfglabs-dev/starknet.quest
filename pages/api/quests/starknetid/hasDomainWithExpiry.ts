import type { NextApiRequest, NextApiResponse } from "next";
import { Contract, Provider } from "starknet";
import { StarknetIdNavigator, utils } from "starknetid.js";
import naming_abi from "../../../../abi/naming_abi.json";
import BN from "bn.js";
import { RequestResponse } from "../../../../types/backTypes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RequestResponse>
) {
  const {
    query: { address, years },
  } = req;

  if (!address || Array.isArray(address)) {
    return res
      .status(400)
      .json({ res: false, error_msg: "Invalid address parameter" });
  }

  if (!years) {
    return res
      .status(400)
      .json({ res: false, error_msg: "Invalid years parameter" });
  }

  const provider = new Provider({
    sequencer: {
      network: "mainnet-alpha",
    },
  });
  const starknetIdNavigator = new StarknetIdNavigator(provider);

  try {
    const name = await starknetIdNavigator.getStarkName(address.toLowerCase());

    if (/^([a-z0-9-]){1,48}\.stark$/.test(name)) {
      const namingContract = new Contract(
        naming_abi,
        process.env.NEXT_PUBLIC_NAMING_CONTRACT as string,
        provider
      );
      const data = await namingContract.call("domain_to_expiry", [
        utils.encodeDomain(name).map((elem) => new BN(elem.toString())),
      ]);

      const currentTimeStamp = new Date().getTime() / 1000;
      if (
        Number(data?.["expiry"]) >=
        currentTimeStamp + 86400 * 365 * Number(years)
      ) {
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
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ res: false, error_msg: error.message });
  }
}
