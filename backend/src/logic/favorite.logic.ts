import { Types } from "mongoose";
import { Favorite } from "../models/Favorite";

export async function toggleFavoriteLogic(userId: string, storyId: string) {
  if (!Types.ObjectId.isValid(storyId)) throw new Error("INVALID_STORY_ID");
  if (!Types.ObjectId.isValid(userId)) throw new Error("INVALID_USER_ID");

  const sId = new Types.ObjectId(storyId);
  const uId = new Types.ObjectId(userId);

  const exists = await Favorite.findOne({ storyId: sId, userId: uId });
  if (exists) {
    await exists.deleteOne();
    return { isFavorite: false };
  }

  await Favorite.create({ storyId: sId, userId: uId });
  return { isFavorite: true };
}

export async function listFavoritesLogic(userId: string) {
  const uId = new Types.ObjectId(userId);

  const favs = await Favorite.find({ userId: uId })
    .sort({ createdAt: -1 })
    .populate("storyId")
    .lean();

  return favs.map((f: any) => f.storyId);
}

