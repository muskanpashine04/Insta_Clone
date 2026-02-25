import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";

export default function Signup() {
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      setMsg("Signup successful 🎉 Redirecting...");
      
      setTimeout(() => {
        nav("/login");
      }, 1500);

    } catch (err) {
      setError("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>

        {msg && <p className="success">{msg}</p>}
        {error && <p className="error">{error}</p>}

        <input
          placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button onClick={submit} disabled={loading}>
          {loading ? "Please wait..." : "Signup"}
        </button>

        <p className="switch">
          Already have an account?{" "}
          <span onClick={() => nav("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}
