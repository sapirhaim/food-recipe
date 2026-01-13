import { Schema, model, Types } from "mongoose";

export interface IStory {
  _id: Types.ObjectId;
  authorId: Types.ObjectId;
  title: string;
  body: string; // הסיפור
  recipe?: {
    ingredients: string[];
    steps: string[];
    prepTimeMinutes?: number;
    cuisine?: string;   // איטלקי/מרוקאי/ישראלי...
    moodTags?: string[]; // "נחמה", "חגיגי", "געגוע"...
  };
  images: { url: string; caption?: string }[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  ratingAvg: number;
  ratingCount: number;

}

const storySchema = new Schema<IStory>(
  {
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },

    title: { type: String, required: true, trim: true, maxlength: 120 },
    body: { type: String, required: true, minlength: 20 },

    recipe: {
      ingredients: [{ type: String }],
      steps: [{ type: String }],
      prepTimeMinutes: { type: Number, min: 0 },
      cuisine: { type: String, trim: true },
      moodTags: [{ type: String, trim: true, lowercase: true }],
    },

    images: [
      {
        url: { type: String, required: true },
        caption: { type: String },
      },
    ],

    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },

    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

storySchema.index({ title: "text", body: "text", "recipe.cuisine": "text" }); // חיפוש טקסט

export const Story = model<IStory>("Story", storySchema);
