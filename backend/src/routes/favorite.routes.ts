import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { listMyFavorites, toggleFavorite } from "../controllers/favorite.controller";

const router = Router();

router.post("/:storyId/favorite", requireAuth, toggleFavorite);
router.get("/me/favorites", requireAuth, listMyFavorites);

export default router;
