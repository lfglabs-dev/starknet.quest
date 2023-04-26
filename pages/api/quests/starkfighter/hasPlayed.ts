import type { NextApiRequest, NextApiResponse } from "next";

type requestResponse = {
  res: boolean;
  error_msg?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<requestResponse>
) {
  const {
    query: { address },
  } = req;

  if (!address || Array.isArray(address)) {
    return res
      .status(400)
      .json({ res: false, error_msg: "Invalid address parameter" });
  }

  try {
    if (address) {
      const response = await fetch(
        "https://server.starkfighter.xyz/fetch_user_score",
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
        if (playerScore) {
          res
            .setHeader("cache-control", "max-age=30")
            .status(200)
            .json({ res: true });
        } else {
          res
            .status(400)
            .json({ res: false, error_msg: "User has not played" });
        }
      } else {
        res.status(400).json({ res: false, error_msg: "User has not played" });
      }
    } else {
      res.status(400).json({ res: false, error_msg: "Invalid request" });
    }
  } catch (error: any) {
    res
      .status(error.status || 500)
      .json({ res: false, error_msg: error.message });
  }
}
