import express from "express";
import cors from "cors";
import "dotenv/config";

import authRoutes from "./routes/auth.routes";
import storyRoutes from "./routes/story.routes";
import commentRoutes from "./routes/comment.routes";
import ratingRoutes from "./routes/rating.routes";
import favoriteRoutes from "./routes/favorite.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    db: "connected_if_server_started",
    ts: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/stories", storyRoutes);

// commentRoutes מוגדר עם paths שמתחילים ב-/:storyId/comments
app.use("/api/stories", commentRoutes);
app.use("/api/stories", ratingRoutes);

app.use("/api", favoriteRoutes);

app.use(errorHandler);

export default app;
