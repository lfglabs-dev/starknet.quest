import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { connectToDatabase } from "../../lib/mongodb";
import { QueryError, UserTask } from "../../types/backTypes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserTask[] | QueryError>
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
          quest_id: Number(quest_id),
        },
      },
      {
        $lookup: {
          from: "completed_tasks",
          let: { task_id: "$id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$task_id", "$$task_id"] },
                address: addr,
              },
            },
          ],
          as: "completed",
        },
      },
      {
        $project: {
          _id: 0,
          id: 1,
          quest_id: 1,
          name: 1,
          href: 1,
          cta: 1,
          verify_endpoint: 1,
          desc: 1,
          completed: { $gt: [{ $size: "$completed" }, 0] },
        },
      },
    ];

    const tasks = await db.collection("tasks").aggregate(pipeline).toArray();

    if (tasks.length > 0) {
      const tasksFormatted = tasks.map((task) => {
        return task as UserTask;
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
