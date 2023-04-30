import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TaskDocument[] | QueryError>
) {
  await NextCors(req, res, {
    methods: ["GET"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  const { db } = await connectToDatabase();
  const {
    query: { quest_id },
  } = req;
  try {
    const tasks = await db
      .collection("tasks")
      .find({
        quest_id: Number(quest_id),
      })
      .toArray();
    if (tasks.length > 0) {
      const tasksFormatted = tasks.map((quest) => {
        const { _id, ...rest } = quest;
        return rest as TaskDocument;
      });
      res
        .setHeader("cache-control", "max-age=30")
        .status(200)
        .json(tasksFormatted);
    } else {
      res
        .setHeader("cache-control", "max-age=30")
        .status(200)
        .json({ error: "No tasks found for this quest_id" });
    }
  } catch (error) {
    res
      .setHeader("cache-control", "max-age=30")
      .status(500)
      .json({ error: "Error querying tasks" });
  }
}
