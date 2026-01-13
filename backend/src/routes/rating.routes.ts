import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";
import { rateStory } from "../controllers/rating.controller";

const router = Router();

router.post(
  "/:storyId/rate",
  requireAuth,
  validateBody(z.object({ value: z.number().int().min(1).max(5) })),
  rateStory
);

export default router;
