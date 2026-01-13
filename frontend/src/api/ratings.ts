import { api } from "./client";

export async function rateStory(storyId: string, value: number) {
  const res = await api.post(`/stories/${storyId}/rate`, { value });
  return res.data; // לרוב story מעודכן
}
