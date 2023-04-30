import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | {
        task_ids: Number[];
      }
    | QueryError
  >
) {
  await NextCors(req, res, {
    methods: ["GET"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  const { db } = await connectToDatabase();
  const {
    query: { addr },
  } = req;
  try {
    const completedTasks = await db
      .collection("completed_tasks")
      .find({
        address: addr,
      })
      .toArray();
    if (completedTasks.length > 0) {
      const tasksFormatted = completedTasks.map((quest) => {
        const { task_id } = quest;
        return task_id as Number;
      });
      res
        .setHeader("cache-control", "max-age=30")
        .status(200)
        .json({ task_ids: tasksFormatted });
    } else {
      res
        .setHeader("cache-control", "max-age=30")
        .status(200)
        .json({ error: "No completed tasks found for this user" });
    }
  } catch (error) {
    res
      .setHeader("cache-control", "max-age=30")
      .status(500)
      .json({ error: "Error querying completed tasks" });
  }
}
