import { Response } from "express";
import { AuthedRequest } from "../middleware/auth.middleware";
import { upsertRatingLogic } from "../logic/rating.logic";

export async function rateStory(req: AuthedRequest, res: Response) {
  const result = await upsertRatingLogic(req.userId!, req.params.storyId, req.body.value);
  res.json(result);
}
