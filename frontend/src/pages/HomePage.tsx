import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { token } = useAuth();

  return (
    <div style={{ maxWidth: 800, margin: "50px auto", fontFamily: "Arial" }}>
      <h1 style={{ marginBottom: 10 }}>Welcome to Food Stories 🍲</h1>
      <p style={{ marginTop: 0, color: "#444" }}>
        Share the story behind your food, discover recipes, rate and save favorites.
      </p>

      <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
        {token ? (
          <>
            <Link to="/feed">Go to Feed</Link>
            <Link to="/publish">Publish a Story</Link>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Create account</Link>
          </>
        )}
      </div>
    </div>
  );
}
