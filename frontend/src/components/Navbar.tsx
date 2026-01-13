//יצירת NAVBAR קבוע למעלה
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div
      style={{
        borderBottom: "1px solid #eee",
        padding: "12px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "Arial",
      }}
    >
      <Link to="/" style={{ fontWeight: 700, textDecoration: "none", color: "black" }}>
        Food Stories
      </Link>

      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <Link to="/feed">Home Feed</Link>
        <Link to="/publish">Publish</Link>
        <Link to="/favorites">Favorites ❤️</Link>
        <Link to="/my-stories">My Stories</Link>

        {user ? (
          <>
            <span style={{ marginLeft: 10 }}>Hi, {user.name}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}
