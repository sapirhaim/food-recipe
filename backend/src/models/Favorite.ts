import { Schema, model, Types } from "mongoose";

export interface IFavorite {
  _id: Types.ObjectId;
  storyId: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const favoriteSchema = new Schema<IFavorite>(
  {
    storyId: { type: Schema.Types.ObjectId, ref: "Story", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true }
);

favoriteSchema.index({ storyId: 1, userId: 1 }, { unique: true });

export const Favorite = model<IFavorite>("Favorite", favoriteSchema);
