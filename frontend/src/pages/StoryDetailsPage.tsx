import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Story } from "../api/stories";
import { fetchStoryById } from "../api/stories";

export default function StoryDetailsPage() {
  const { storyId } = useParams();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!storyId) return;

    (async () => {
      try {
        setLoading(true);
        const data = await fetchStoryById(storyId);
        setStory(data);
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || "Failed to load story");
      } finally {
        setLoading(false);
      }
    })();
  }, [storyId]);

  if (loading) return <div style={{ maxWidth: 900, margin: "30px auto", padding: 20 }}>Loading...</div>;
  if (error) return <div style={{ maxWidth: 900, margin: "30px auto", padding: 20 }}>Error: {error}</div>;
  if (!story) return <div style={{ maxWidth: 900, margin: "30px auto", padding: 20 }}>Not found</div>;

  const img = story.images?.[0]?.url;

  return (
    <div style={{ maxWidth: 900, margin: "30px auto", fontFamily: "Arial" }}>
      <div style={{ marginBottom: 16 }}>
        <Link to="/feed" style={{ textDecoration: "none" }}>
          ← Back to Feed
        </Link>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 18,
          background: "white",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
          <div>
            <h1 style={{ margin: 0 }}>{story.title}</h1>
            <div style={{ marginTop: 6, opacity: 0.75 }}>
              Avg ⭐ {story.ratingAvg ?? 0} ({story.ratingCount ?? 0})
            </div>
          </div>
        </div>

        {img ? (
          <img
            src={img}
            alt={story.title}
            style={{
              width: "100%",
              maxHeight: 360,
              objectFit: "cover",
              borderRadius: 12,
              marginTop: 16,
            }}
          />
        ) : null}

        <hr style={{ margin: "18px 0", border: "none", borderTop: "1px solid #eee" }} />

        <h3 style={{ marginTop: 0 }}>Story</h3>
        <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.7, marginTop: 8 }}>{story.body}</p>

        {story.recipe ? (
          <>
            <hr style={{ margin: "18px 0", border: "none", borderTop: "1px solid #eee" }} />
            <h3 style={{ marginTop: 0 }}>Recipe</h3>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", opacity: 0.85, marginBottom: 12 }}>
              {story.recipe.prepTimeMinutes != null ? <span>⏱ {story.recipe.prepTimeMinutes} min</span> : null}
              {story.recipe.cuisine ? <span>🍽 {story.recipe.cuisine}</span> : null}
              {story.recipe.moodTags?.length ? <span>🏷 {story.recipe.moodTags.join(", ")}</span> : null}
            </div>

            {story.recipe.ingredients?.length ? (
              <>
                <h4>Ingredients</h4>
                <ul>
                  {story.recipe.ingredients.map((ing, idx) => (
                    <li key={idx}>{ing}</li>
                  ))}
                </ul>
              </>
            ) : null}

            {story.recipe.steps?.length ? (
              <>
                <h4>Steps</h4>
                <ol>
                  {story.recipe.steps.map((step, idx) => (
                    <li key={idx} style={{ marginBottom: 6 }}>
                      {step}
                    </li>
                  ))}
                </ol>
              </>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
