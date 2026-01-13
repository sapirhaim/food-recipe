import CreateStoryForm from "../components/CreateStoryForm";
import type { Story } from "../api/stories";

export default function PublishPage() {
  function onCreated(_created: Story) {
    // אפשר להוסיף ניתוב אוטומטי ל-feed אם תרצי
    // לדוגמה: nav("/feed")
  }

  return (
    <div style={{ maxWidth: 800, margin: "30px auto", fontFamily: "Arial" }}>
      <h2>Publish a new story ✍️</h2>
      <CreateStoryForm onCreated={onCreated} />
    </div>
  );
}
