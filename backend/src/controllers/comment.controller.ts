import { Request, Response } from "express";
import { AuthedRequest } from "../middleware/auth.middleware";
import { addCommentLogic, deleteCommentLogic, listCommentsLogic } from "../logic/comment.logic";

export async function addComment(req: AuthedRequest, res: Response) {
  const c = await addCommentLogic(req.userId!, req.params.storyId, req.body.text);
  res.status(201).json(c);
}

export async function listComments(req: Request, res: Response) {
  const items = await listCommentsLogic(req.params.storyId);
  res.json(items);
}

export async function deleteComment(req: AuthedRequest, res: Response) {
  try {
    await deleteCommentLogic(req.userId!, req.params.commentId);
    res.status(204).send();
  } catch (e: any) {
    if (e.message === "NOT_FOUND") return res.status(404).json({ message: "Comment not found" });
    if (e.message === "FORBIDDEN") return res.status(403).json({ message: "Not your comment" });
    throw e;
  }
}
