import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Story } from "../api/stories";
import { fetchMyStories, deleteStory } from "../api/stories";

export default function MyStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchMyStories();
      setStories(data ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "30px auto", fontFamily: "Arial" }}>
      <h2>My Stories</h2>

      {loading ? <p>Loading...</p> : null}
      {!loading && stories.length === 0 ? <p>No stories yet.</p> : null}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {stories.map((s) => (
          <li key={s._id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 14, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <h3 style={{ margin: 0, cursor: "pointer" }} onClick={() => navigate(`/stories/${s._id}`)}>
                {s.title}
              </h3>

              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" onClick={() => navigate(`/stories/${s._id}/edit`)}>
                  Edit
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    const ok = confirm("Delete this story?");
                    if (!ok) return;

                    await deleteStory(s._id);
                    setStories((prev) => prev.filter((x) => x._id !== s._id));
                  }}
                >
                  Delete
                </button>
              </div>
            </div>

            <p style={{ marginTop: 6 }}>{s.body?.slice(0, 120)}...</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
