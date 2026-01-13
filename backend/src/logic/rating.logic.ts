import { Types } from "mongoose";
import { Rating } from "../models/Rating";
import { Story } from "../models/Story";

export async function upsertRatingLogic(userId: string, storyId: string, value: number) {
  const sId = new Types.ObjectId(storyId);
  const uId = new Types.ObjectId(userId);

  await Rating.updateOne(
    { storyId: sId, userId: uId },
    { $set: { value } },
    { upsert: true }
  );

  const agg = await Rating.aggregate([
    { $match: { storyId: sId } },
    { $group: { _id: "$storyId", avg: { $avg: "$value" }, count: { $sum: 1 } } },
  ]);

  const avg = agg[0]?.avg ?? 0;
  const count = agg[0]?.count ?? 0;

  await Story.updateOne({ _id: sId }, { $set: { ratingAvg: avg, ratingCount: count } });

  return { ratingAvg: avg, ratingCount: count };
}
