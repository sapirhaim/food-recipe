import { useState } from "react";
import { createStory, type CreateStoryInput, type Story } from "../api/stories";
import { uploadImageToCloudinary } from "../api/cloudinary";

export default function CreateStoryForm({ onCreated }: { onCreated: (s: Story) => void }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number>(20);

  // ✅ תמונה
  const [imageUrl, setImageUrl] = useState(""); // פה נשמור את ה-URL שחוזר מ-Cloudinary
  const [uploading, setUploading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  async function handlePickFile(file: File | null) {
    setError(null);
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadImageToCloudinary(file);
      setImageUrl(url);
    } catch (e: any) {
      setError(e?.message || "Upload failed");
      setImageUrl("");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload: CreateStoryInput = {
      title,
      body,
      recipe: {
        cuisine: cuisine || undefined,
        prepTimeMinutes: prepTimeMinutes || undefined,
      },
      images: imageUrl ? [{ url: imageUrl }] : [],
    };

    try {
      const created = await createStory(payload);
      onCreated(created);

      // ניקוי טופס
      setTitle("");
      setBody("");
      setCuisine("");
      setPrepTimeMinutes(20);
      setImageUrl("");
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message || "Create failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 14, marginBottom: 16 }}>
      <h3 style={{ marginTop: 0 }}>Create new story</h3>

      <form onSubmit={onSubmit}>
        <label>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
          required
        />

        <label>Story</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 10, minHeight: 90 }}
          required
        />

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label>Cuisine</label>
            <input
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              style={{ width: "100%", padding: 8, marginBottom: 10 }}
              placeholder="Italian / Thai / Israeli..."
            />
          </div>

          <div style={{ width: 160 }}>
            <label>Prep time</label>
            <input
              type="number"
              value={prepTimeMinutes}
              onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
              style={{ width: "100%", padding: 8, marginBottom: 10 }}
              min={0}
            />
          </div>
        </div>

        {/* ✅ Upload אמיתי */}
        <label>Upload Image (Cloudinary)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handlePickFile(e.target.files?.[0] ?? null)}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />

        {uploading ? <p style={{ marginTop: 0 }}>Uploading image...</p> : null}

        {/* ✅ עדיין אפשר להשאיר URL ידני (אופציונלי) */}
        <label>Or Image URL</label>
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
          placeholder="https://..."
        />

        {/* ✅ Preview */}
        {!uploading && imageUrl ? (
          <div style={{ marginBottom: 10 }}>
            <small>Preview:</small>
            <img
              src={imageUrl}
              alt="preview"
              style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 10, marginTop: 6 }}
            />
          </div>
        ) : null}

        <button disabled={loading || uploading} style={{ padding: 10, width: "100%" }}>
          {uploading ? "Uploading..." : loading ? "Creating..." : "Publish"}
        </button>
      </form>

      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </div>
  );
}
