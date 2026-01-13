import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../middleware/validate.middleware";
import { login, register } from "../controllers/auth.controller";

const router = Router();

router.post(
  "/register",
  validateBody(
    z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
    })
  ),
  register
);

router.post(
  "/login",
  validateBody(
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })
  ),
  login
);

export default router;
