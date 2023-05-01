import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "twitter-api-sdk";
import { CustomTwitterNextApiRequest } from "../../../types/backTypes";

export default async function handler(
  req: CustomTwitterNextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const client = new Client(process.env.NEXT_PUBLIC_TWITTER_TOKEN as string);
  const response = await client.users.findUsersById({ ids: [id] });
  res
    .setHeader("cache-control", "max-age=86400")
    .status(200)
    .json(response.data);
}
