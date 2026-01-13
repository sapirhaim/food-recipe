import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";
import {
  createStory,
  deleteStory,
  getStory,
  listStories,
  updateStory,
  listMyStories, // ✅ חדש
} from "../controllers/story.controller";

const router = Router();

const storyCreateSchema = z.object({
  title: z.string().min(3).max(120),
  body: z.string().min(20),
  recipe: z
    .object({
      ingredients: z.array(z.string()).default([]),
      steps: z.array(z.string()).default([]),
      prepTimeMinutes: z.number().int().nonnegative().optional(),
      cuisine: z.string().optional(),
      moodTags: z.array(z.string()).optional(),
    })
    .optional(),
  images: z.array(z.object({ url: z.string().url(), caption: z.string().optional() })).optional(),
});

const storyUpdateSchema = storyCreateSchema.partial();

router.get("/", listStories);

// ✅ MY STORIES
router.get("/mine", requireAuth, listMyStories);

router.get("/me", requireAuth, listMyStories);

// ⚠️ חייב להיות אחרי /mine
router.get("/:id", getStory);

router.post("/", requireAuth, validateBody(storyCreateSchema), createStory);
router.patch("/:id", requireAuth, validateBody(storyUpdateSchema), updateStory);
router.delete("/:id", requireAuth, deleteStory);

export default router;
