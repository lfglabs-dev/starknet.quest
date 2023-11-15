import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { connectToDatabase } from "../../lib/mongodb";
import { QueryError, QuestDocument } from "../../types/backTypes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<QuestDocument | QueryError>
) {
  await NextCors(req, res, {
    methods: ["GET"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  const { db } = await connectToDatabase();
  const { id } = req.query;

  if (!id) {
    res
      .setHeader("cache-control", "max-age=30")
      .status(400)
      .json({ error: "Missing quest_id parameter" });
    return;
  }

  try {
    const quest = await db.collection("quests").findOne({ id: Number(id) });

    if (quest) {
      const { _id, ...rest } = quest;
      const questFormatted = rest as QuestDocument;
      res
        .setHeader("cache-control", "max-age=30")
        .status(200)
        .json(questFormatted);
    } else {
      res
        .setHeader("cache-control", "max-age=30")
        .status(404)
        .json({ error: "Quest not found" });
    }
  } catch (error) {
    res
      .setHeader("cache-control", "max-age=30")
      .status(500)
      .json({ error: "Error querying quest" });
  }
}
