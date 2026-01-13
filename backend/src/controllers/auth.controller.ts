import { Request, Response } from "express";
import { loginLogic, registerLogic } from "../logic/auth.logic";

export async function register(req: Request, res: Response) {
  try {
    const result = await registerLogic(req.body);
    res.status(201).json(result);
  } catch (e: any) {
    if (e.message === "EMAIL_EXISTS") return res.status(409).json({ message: "Email already exists" });
    res.status(400).json({ message: "Register failed" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = await loginLogic(req.body);
    res.json(result);
  } catch (e: any) {
    if (e.message === "INVALID_CREDENTIALS") return res.status(401).json({ message: "Invalid credentials" });
    res.status(400).json({ message: "Login failed" });
  }
}
