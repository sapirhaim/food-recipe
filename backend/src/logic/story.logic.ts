import { Types } from "mongoose";
import { Story } from "../models/Story";
import { getPagination } from "../utils/pagination";

export async function createStoryLogic(userId: string, data: any) {
  const story = await Story.create({
    authorId: new Types.ObjectId(userId),
    title: data.title,
    body: data.body,
    recipe: data.recipe,
    images: data.images || [],
    isPublished: true,
  });
  return story;
}

export async function listStoriesLogic(query: any) {
  const { page, limit, skip } = getPagination(query);

  const filter: any = { isPublished: true };

  if (query.cuisine) filter["recipe.cuisine"] = String(query.cuisine);
  if (query.mood) filter["recipe.moodTags"] = String(query.mood).toLowerCase();
  if (query.maxPrep) filter["recipe.prepTimeMinutes"] = { $lte: Number(query.maxPrep) };

  if (query.q) {
    // עובד אם שמנו text index במודל
    filter.$text = { $search: String(query.q) };
  }

  // sort
  const sortKey = String(query.sort || "new");
  let sort: any = { createdAt: -1 };
  if (sortKey === "old") sort = { createdAt: 1 };
  // אם אצלך יש ratingAvg/ratingCount בשדה אחר—אפשר לשנות פה
  if (sortKey === "top") sort = { ratingAvg: -1, ratingCount: -1, createdAt: -1 };

  const [items, total] = await Promise.all([
    Story.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Story.countDocuments(filter),
  ]);

  return { page, limit, total, items };
}

export async function getStoryByIdLogic(storyId: string) {
  const story = await Story.findById(storyId).lean();
  if (!story) throw new Error("NOT_FOUND");
  return story;
}

export async function updateStoryLogic(userId: string, storyId: string, patch: any) {
  const story = await Story.findById(storyId);
  if (!story) throw new Error("NOT_FOUND");

  if (story.authorId.toString() !== userId) throw new Error("FORBIDDEN");

  if (patch.title !== undefined) story.title = patch.title;
  if (patch.body !== undefined) story.body = patch.body;
  if (patch.recipe !== undefined) story.recipe = patch.recipe;
  if (patch.images !== undefined) story.images = patch.images;

  await story.save();
  return story;
}

export async function deleteStoryLogic(userId: string, storyId: string) {
  const story = await Story.findById(storyId);
  if (!story) throw new Error("NOT_FOUND");
  if (story.authorId.toString() !== userId) throw new Error("FORBIDDEN");

  await story.deleteOne();
}
