import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<QuestDocument[] | QueryError>
) {
  await NextCors(req, res, {
    methods: ["GET"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  const { db } = await connectToDatabase();
  try {
    const quests = await db.collection("quests").find().toArray();
    if (quests.length > 0) {
      const questsFormatted = quests.map((quest) => {
        const { _id, ...rest } = quest;
        return rest as QuestDocument;
      });
      res
        .setHeader("cache-control", "max-age=30")
        .status(200)
        .json(questsFormatted);
    } else {
      res
        .setHeader("cache-control", "max-age=30")
        .status(200)
        .json({ error: "No quests found" });
    }
  } catch (error) {
    res
      .setHeader("cache-control", "max-age=30")
      .status(500)
      .json({ error: "Error querying quests" });
  }
}
