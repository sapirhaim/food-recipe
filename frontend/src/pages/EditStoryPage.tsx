import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { CreateStoryInput } from "../api/stories";
import { fetchStoryById, updateStory } from "../api/stories";
import { uploadImageToCloudinary } from "../api/cloudinary";

export default function EditStoryPage() {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number>(0);

  // 🖼️ image
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  useEffect(() => {
    (async () => {
      try {
        if (!storyId) return;
        setLoading(true);

        const s = await fetchStoryById(storyId);

        setTitle(s.title ?? "");
        setBody(s.body ?? "");
        setCuisine(s.recipe?.cuisine ?? "");
        setPrepTimeMinutes(s.recipe?.prepTimeMinutes ?? 0);

        const img = s.images?.[0]?.url ?? "";
        setImageUrl(img);
        setSelectedFileName("");
      } catch (e: any) {
        setError(e?.response?.data?.message || e.message || "Failed to load story");
      } finally {
        setLoading(false);
      }
    })();
  }, [storyId]);

  async function handlePickFile(file: File | null) {
    setError(null);
    setSelectedFileName(file?.name ?? "");
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadImageToCloudinary(file);
      setImageUrl(url);
    } catch (e: any) {
      setError(e?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload: Partial<CreateStoryInput> = {
      title,
      body,
      recipe: {
        cuisine: cuisine || undefined,
        prepTimeMinutes: prepTimeMinutes || undefined,
      },
      images: imageUrl ? [{ url: imageUrl }] : [],
    };

    try {
      await updateStory(storyId!, payload);
      navigate(`/stories/${storyId}`);
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p style={{ maxWidth: 800, margin: "30px auto" }}>Loading...</p>;

  return (
    <div style={{ maxWidth: 800, margin: "30px auto", fontFamily: "Arial" }}>
      <h2>Edit story ✏️</h2>

      <form onSubmit={onSave} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 14 }}>
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

        {/* ✅ Upload Image (Cloudinary) */}
        <label>Upload Image (Cloudinary)</label>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <input
            id="editImageUpload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handlePickFile(e.target.files?.[0] ?? null)}
          />

          <button
            type="button"
            onClick={() => document.getElementById("editImageUpload")?.click()}
            style={{ padding: 10 }}
            disabled={uploading}
          >
            Choose file
          </button>

          <span style={{ fontSize: 14, color: "#555" }}>
            {selectedFileName ? selectedFileName : "No file chosen"}
          </span>
        </div>

        {uploading ? <p style={{ marginTop: 0 }}>Uploading image...</p> : null}

        {/* ✅ Preview */}
        {!uploading && imageUrl ? (
          <div style={{ marginBottom: 10 }}>
            <small>Preview:</small>
            <img
              src={imageUrl}
              alt="preview"
              style={{ width: "100%", maxHeight: 240, objectFit: "cover", borderRadius: 10, marginTop: 6 }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        ) : null}

        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" onClick={() => navigate(-1)} style={{ padding: 10, flex: 1 }}>
            Cancel
          </button>

          <button disabled={saving || uploading} style={{ padding: 10, flex: 1 }}>
            {uploading ? "Uploading..." : saving ? "Saving..." : "Save"}
          </button>
        </div>

        {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
      </form>
    </div>
  );
}
