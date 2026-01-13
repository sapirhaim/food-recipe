import { Request, Response } from "express";
import { AuthedRequest } from "../middleware/auth.middleware";
import { Story } from "../models/Story";

import {
  createStoryLogic,
  deleteStoryLogic,
  getStoryByIdLogic,
  updateStoryLogic,
} from "../logic/story.logic";

// ✅ CREATE
export async function createStory(req: AuthedRequest, res: Response) {
  const story = await createStoryLogic(req.userId!, req.body);
  res.status(201).json(story);
}

// ✅ LIST ALL STORIES + Search/Filter/Sort
export async function listStories(req: Request, res: Response) {
  const q = String(req.query.q ?? "").trim();
  const cuisine = String(req.query.cuisine ?? "").trim();
  const minRating = Number(req.query.minRating ?? 0);
  const sort = String(req.query.sort ?? "new"); // new | top

  const filter: any = { isPublished: true };

  // פילטר מטבח
  if (cuisine) {
    filter["recipe.cuisine"] = { $regex: cuisine, $options: "i" };
  }

  // פילטר מינימום דירוג
  if (!Number.isNaN(minRating) && minRating > 0) {
    filter.ratingAvg = { $gte: minRating };
  }

  // חיפוש טקסט (יש לך index ✅)
  const useText = Boolean(q);
  let query = Story.find(useText ? { ...filter, $text: { $search: q } } : filter);

  // אם יש חיפוש טקסט – מיון לפי רלוונטיות
  if (useText) {
    query = query
      .select({
        score: { $meta: "textScore" },
        title: 1,
        body: 1,
        recipe: 1,
        images: 1,
        ratingAvg: 1,
        ratingCount: 1,
        createdAt: 1,
        authorId: 1,
      })
      .sort({ score: { $meta: "textScore" } });
  } else {
    // בלי חיפוש – מיון רגיל
    if (sort === "top") {
      query = query.sort({ ratingAvg: -1, ratingCount: -1, createdAt: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }
  }

  const items = await query.limit(200);
  res.json(items);
}

// ✅ LIST MY STORIES + Search/Filter/Sort
export async function listMyStories(req: AuthedRequest, res: Response) {
  const q = String(req.query.q ?? "").trim();
  const cuisine = String(req.query.cuisine ?? "").trim();
  const minRating = Number(req.query.minRating ?? 0);
  const sort = String(req.query.sort ?? "new"); // new | top

  const filter: any = { authorId: req.userId, isPublished: true };

  if (cuisine) filter["recipe.cuisine"] = { $regex: cuisine, $options: "i" };
  if (!Number.isNaN(minRating) && minRating > 0) filter.ratingAvg = { $gte: minRating };

  const useText = Boolean(q);
  let query = Story.find(useText ? { ...filter, $text: { $search: q } } : filter);

  if (useText) {
    query = query
      .select({
        score: { $meta: "textScore" },
        title: 1,
        body: 1,
        recipe: 1,
        images: 1,
        ratingAvg: 1,
        ratingCount: 1,
        createdAt: 1,
        authorId: 1,
      })
      .sort({ score: { $meta: "textScore" } });
  } else {
    if (sort === "top") {
      query = query.sort({ ratingAvg: -1, ratingCount: -1, createdAt: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }
  }

  const items = await query.limit(200);
  res.json(items);
}

// ✅ GET
export async function getStory(req: Request, res: Response) {
  try {
    const story = await getStoryByIdLogic(req.params.id);
    res.json(story);
  } catch (e: any) {
    if (e.message === "NOT_FOUND") return res.status(404).json({ message: "Story not found" });
    throw e;
  }
}

// ✅ UPDATE (עם בדיקת בעלות דרך logic)
export async function updateStory(req: AuthedRequest, res: Response) {
  try {
    const story = await updateStoryLogic(req.userId!, req.params.id, req.body);
    res.json(story);
  } catch (e: any) {
    if (e.message === "NOT_FOUND") return res.status(404).json({ message: "Story not found" });
    if (e.message === "FORBIDDEN") return res.status(403).json({ message: "Not your story" });
    throw e;
  }
}

// ✅ DELETE (עם בדיקת בעלות דרך logic)
export async function deleteStory(req: AuthedRequest, res: Response) {
  try {
    await deleteStoryLogic(req.userId!, req.params.id);
    res.status(204).send();
  } catch (e: any) {
    if (e.message === "NOT_FOUND") return res.status(404).json({ message: "Story not found" });
    if (e.message === "FORBIDDEN") return res.status(403).json({ message: "Not your story" });
    throw e;
  }
}

