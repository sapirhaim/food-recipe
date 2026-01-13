import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const MONGODB_URI = process.env.MONGODB_URI as string;

async function start() {
  if (!MONGODB_URI) {
    throw new Error("❌ MONGODB_URI is missing in .env");
  }

  await connectDB(MONGODB_URI);

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

start();
