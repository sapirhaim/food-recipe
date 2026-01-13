import { useEffect, useState } from "react";
import { fetchMyFavorites } from "../api/favorites";
import type { Story } from "../api/stories";

export default function FavoritesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const favs = await fetchMyFavorites();
      setStories(favs ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "30px auto", fontFamily: "Arial" }}>
      <h2>My Favorites ❤️</h2>

      {loading ? <p>Loading...</p> : null}
      {!loading && stories.length === 0 ? <p>No favorites yet.</p> : null}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {stories.map((s) => (
          <li key={s._id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 14, marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>{s.title}</h3>
            <p style={{ marginTop: 6 }}>{s.body?.slice(0, 120)}...</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
