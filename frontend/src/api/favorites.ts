import { api } from "./client";

export async function toggleFavorite(storyId: string) {
  const res = await api.post(`/${storyId}/favorite`);
  return res.data;
}

export async function fetchMyFavorites() {
  const res = await api.get(`/me/favorites`);
  return res.data;
}
