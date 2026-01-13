import { api } from "./client";

export type Story = {
  _id: string;
  title: string;
  body: string;
  recipe?: {
    prepTimeMinutes?: number;
    cuisine?: string;
    moodTags?: string[];
    ingredients?: string[];
    steps?: string[];
  };
  images?: { url: string; caption?: string }[];
  ratingAvg?: number;
  ratingCount?: number;
};

export type FetchStoriesParams = {
  q?: string;
  cuisine?: string;
  minRating?: number;
  sort?: "new" | "top";
};

function toQuery(params?: FetchStoriesParams) {
  const sp = new URLSearchParams();
  if (!params) return "";
  if (params.q) sp.set("q", params.q);
  if (params.cuisine) sp.set("cuisine", params.cuisine);
  if (typeof params.minRating === "number") sp.set("minRating", String(params.minRating));
  if (params.sort) sp.set("sort", params.sort);
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export async function fetchStories(params?: FetchStoriesParams): Promise<Story[]> {
  const res = await api.get(`/stories${toQuery(params)}`);
  return res.data.items ?? res.data;
}

export async function fetchMyStories(params?: FetchStoriesParams): Promise<Story[]> {
  const res = await api.get(`/stories/mine${toQuery(params)}`);
  return res.data.items ?? res.data;
}

export async function fetchStoryById(id: string): Promise<Story> {
  const res = await api.get(`/stories/${id}`);
  return res.data;
}

export type CreateStoryInput = {
  title: string;
  body: string;
  recipe?: {
    prepTimeMinutes?: number;
    cuisine?: string;
    moodTags?: string[];
    ingredients?: string[];
    steps?: string[];
  };
  images?: { url: string; caption?: string }[];
};

export async function createStory(input: CreateStoryInput): Promise<Story> {
  const res = await api.post("/stories", input);
  return res.data;
}

// ✅ UPDATE (עריכה חלקית)
export async function updateStory(
  id: string,
  input: Partial<CreateStoryInput>
): Promise<Story> {
  const res = await api.patch(`/stories/${id}`, input);
  return res.data;
}

// ✅ DELETE (מחיקה)
export async function deleteStory(id: string): Promise<{ ok: true } | void> {
  // שימי לב: אצלך בבאק את מחזירה 204 No Content,
  // אז לפעמים res.data יהיה ריק. לכן נחזיר ok גם אם אין body.
  const res = await api.delete(`/stories/${id}`);
  return res.data ?? { ok: true };
}

