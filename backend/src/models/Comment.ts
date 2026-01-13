import { Schema, model, Types } from "mongoose";

export interface IComment {
  _id: Types.ObjectId;
  storyId: Types.ObjectId;
  authorId: Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    storyId: { type: Schema.Types.ObjectId, ref: "Story", required: true, index: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    text: { type: String, required: true, trim: true, minlength: 1, maxlength: 1000 },
  },
  { timestamps: true }
);

export const Comment = model<IComment>("Comment", commentSchema);
