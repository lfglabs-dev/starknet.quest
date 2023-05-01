import type { NextApiResponse } from "next";
import {
  CustomNextApiRequest,
  RequestResponse,
} from "../../../../types/backTypes";

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
      if (playerScore && playerScore.score >= 50) {
        res
          .setHeader("cache-control", "max-age=30")
          .status(200)
          .json({ res: true });
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
