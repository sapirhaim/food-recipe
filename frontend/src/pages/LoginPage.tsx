import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message || "Login failed");
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", fontFamily: "Arial" }}>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: 8 }} />
        <label style={{ marginTop: 10, display: "block" }}>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: 8 }} />
        <button style={{ marginTop: 12, padding: 10, width: "100%" }}>Sign in</button>
      </form>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

       <p style={{ marginTop: 10 }}>
      No account? <Link to="/register">Register</Link>
    </p>
    </div>
  );
}
