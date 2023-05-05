import type { NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";
import { connectToDatabase } from "../../../../lib/mongodb";
import { ec, hash, Signature } from "starknet";
import { QueryError } from "../../../../types/backTypes";

const quest_id = 123;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | {
        rewards: {
          task_id: number;
          nft_contract: string;
          token_id: string;
          sig: Signature;
        }[];
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
          "task.quest_id": quest_id,
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

    const getNFT = (taskId: number): [number, Signature] => {
      let nftLevel;
      if (taskId === 1) {
        nftLevel = 1;
      } else if (taskId === 2) {
        nftLevel = 2;
      } else {
        return [0, []];
      }

      const tokenId = nftLevel + 100 * Math.floor(Math.random() * 2 ** 32);
      const hashed = hash.pedersen([
        hash.pedersen([
          hash.pedersen([hash.pedersen([tokenId, 0]), quest_id]),
          taskId,
        ]),
        addr as string,
      ]);
      const sig = ec.sign(
        ec.getKeyPair(process.env.NEXT_PUBLIC_PRIVATE_KEY as string),
        hashed
      );
      return [tokenId, sig];
    };

    if (completedTasks.length > 0) {
      const claimable = completedTasks.map((task) => {
        const task_id = task.task_id as number;
        const [token_id, sig] = getNFT(task_id);
        return {
          task_id,
          nft_contract: process.env
            .NEXT_PUBLIC_QUEST_NFT_STARKFIGHTER_CONTRACT as string,
          token_id: token_id.toString(),
          sig,
        };
      });

      res.setHeader("cache-control", "max-age=30").status(200).json({
        rewards: claimable,
      });
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
