import { Response } from "express";
import { AuthedRequest } from "../middleware/auth.middleware";
import { listFavoritesLogic, toggleFavoriteLogic } from "../logic/favorite.logic";

export async function toggleFavorite(req: AuthedRequest, res: Response) {
  const result = await toggleFavoriteLogic(req.userId!, req.params.storyId);
  res.json(result);
}

export async function listMyFavorites(req: AuthedRequest, res: Response) {
  const items = await listFavoritesLogic(req.userId!);
  res.json(items);
}
