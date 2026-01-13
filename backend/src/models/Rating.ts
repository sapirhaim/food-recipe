import { Schema, model, Types } from "mongoose";

export interface IRating {
  _id: Types.ObjectId;
  storyId: Types.ObjectId;
  userId: Types.ObjectId;
  value: number; // 1..5
  createdAt: Date;
  updatedAt: Date;
}

const ratingSchema = new Schema<IRating>(
  {
    storyId: { type: Schema.Types.ObjectId, ref: "Story", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    value: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

// חשוב: משתמש יכול לדרג סטורי רק פעם אחת
ratingSchema.index({ storyId: 1, userId: 1 }, { unique: true });

export const Rating = model<IRating>("Rating", ratingSchema);
