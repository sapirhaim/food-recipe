import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";
import { addComment, deleteComment, listComments } from "../controllers/comment.controller";

const router = Router();

router.get("/:storyId/comments", listComments);

router.post(
  "/:storyId/comments",
  requireAuth,
  validateBody(z.object({ text: z.string().min(1).max(1000) })),
  addComment
);

router.delete("/comments/:commentId", requireAuth, deleteComment);

export default router;
