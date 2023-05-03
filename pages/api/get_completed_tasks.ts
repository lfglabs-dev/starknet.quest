import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | {
      task_ids: number[];
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
    query: { quest_id, addr },
  } = req;
  try {
    const pipeline = [
      {
        $match: {
          address: addr,
        },
      },
      {
        $lookup: {
          from: "tasks",
          localField: "task_id",
          foreignField: "id",
          as: "task",
        },
      },
      {
        $match: {
          "task.0": { $exists: true },
          "task.quest_id": Number(quest_id),
        },
      },
      {
        $project: {
          _id: 0,
          task_id: 1,
        },
      },
    ];

    const completedTasks = await db
      .collection("completed_tasks")
      .aggregate(pipeline)
      .toArray();

    if (completedTasks.length > 0) {
      const tasksFormatted = completedTasks.map((quest) => quest.task_id as number);

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
