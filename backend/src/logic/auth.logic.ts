import { User } from "../models/User";
import { hashPassword, verifyPassword } from "../utils/hash";
import { signToken } from "../utils/jwt";

export async function registerLogic(input: { name: string; email: string; password: string }) {
  const exists = await User.findOne({ email: input.email });
  if (exists) throw new Error("EMAIL_EXISTS");

  const passwordHash = await hashPassword(input.password);
  const user = await User.create({
    name: input.name,
    email: input.email,
    passwordHash,
  });

  const token = signToken({ userId: user._id.toString() });

  return {
    token,
    user: { id: user._id.toString(), name: user.name, email: user.email },
  };
}

export async function loginLogic(input: { email: string; password: string }) {
  const user = await User.findOne({ email: input.email });
  if (!user) throw new Error("INVALID_CREDENTIALS");

  const ok = await verifyPassword(input.password, user.passwordHash);
  if (!ok) throw new Error("INVALID_CREDENTIALS");

  const token = signToken({ userId: user._id.toString() });

  return {
    token,
    user: { id: user._id.toString(), name: user.name, email: user.email },
  };
}
