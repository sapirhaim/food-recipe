import { Types } from "mongoose";
import { Comment } from "../models/Comment";

export async function addCommentLogic(userId: string, storyId: string, text: string) {
  return Comment.create({
    storyId: new Types.ObjectId(storyId),
    authorId: new Types.ObjectId(userId),
    text,
  });
}

export async function listCommentsLogic(storyId: string) {
  return Comment.find({ storyId }).sort({ createdAt: -1 }).lean();
}

export async function deleteCommentLogic(userId: string, commentId: string) {
  const c = await Comment.findById(commentId);
  if (!c) throw new Error("NOT_FOUND");
  if (c.authorId.toString() !== userId) throw new Error("FORBIDDEN");
  await c.deleteOne();
}
