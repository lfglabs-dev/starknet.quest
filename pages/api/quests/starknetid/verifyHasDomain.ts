import type { NextApiResponse } from "next";
import { Provider } from "starknet";
import { StarknetIdNavigator } from "starknetid.js";
import {
  CustomNextApiRequest,
  RequestResponse,
} from "../../../../types/backTypes";
import NextCors from "nextjs-cors";
import { connectToDatabase } from "../../../../lib/mongodb";
import { hexToDecimal } from "../../../../utils/feltService";

export default async function handler(
  req: CustomNextApiRequest,
  res: NextApiResponse<RequestResponse>
) {
  await NextCors(req, res, {
    methods: ["POST"],
    origin: "*",
    optionsSuccessStatus: 200,
  });
  const { db } = await connectToDatabase();

  const { address } = req.query;
  const task_id = 1;

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
    try {
      await db
        .collection("completed_tasks")
        .updateOne(
          { address: hexToDecimal(address), task_id },
          { $setOnInsert: { address: hexToDecimal(address), task_id } },
          { upsert: true }
        );
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
