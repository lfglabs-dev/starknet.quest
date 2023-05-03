import type { NextApiResponse } from "next";
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
  const task_id = 4;

  if (!address || Array.isArray(address)) {
    return res
      .status(400)
      .json({ res: false, error_msg: "Invalid address parameter" });
  }

  try {
    const response = await fetch(
      "https://muscledserver.starkfighter.xyz/fetch_user_score",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_addr: address,
        }),
      }
    );

    if (response.ok) {
      const playerScore = await response.json();
      if (playerScore && playerScore.score >= 100) {
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
      } else {
        res
          .status(400)
          .json({ res: false, error_msg: "User has a score lower" });
      }
    } else {
      res.status(400).json({ res: false, error_msg: "User has not played" });
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
