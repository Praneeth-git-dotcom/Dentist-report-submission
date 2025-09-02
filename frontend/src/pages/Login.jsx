import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { getRoleFromToken } from "../utils/jwt";
import "../styles/login.css"; // small styles for centering + card (see file)

/**
 * Modern centered login card.
 * - Uses your API (/auth/login)
 * - Stores token in localStorage
 * - Navigates by role (Technician -> /technician, Dentist -> /dentist)
 */
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/login", { email, password });
      const token = res.data.token;
      if (!token) throw new Error("No token received");
      localStorage.setItem("token", token);
      const role = res.data.role || getRoleFromToken();
      if (role === "Technician") nav("/technician");
      else if (role === "Dentist") nav("/dentist");
      else nav("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(err?.response?.data?.error || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // quick fill test credentials
  const fillTechnician = () => {
    setEmail("tech@oralvis.com");
    setPassword("tech123");
    setError("");
  };
  const fillDentist = () => {
    setEmail("dent@oralvis.com");
    setPassword("dent123");
    setError("");
  };

  return (
    <div className="login-wrap" role="main">
      <div className="login-card" aria-live="polite">
        <div className="login-brand">
          <div className="logo">OV</div>
          <div>
            <h1 className="login-title">OralVis</h1>
            <div className="login-sub">Sign in to continue</div>
          </div>
        </div>

        <form onSubmit={submit} className="login-form" autoComplete="on">
          {error && <div className="login-error" role="alert">{error}</div>}

          <label className="label" htmlFor="email">Email</label>
          <input
            id="email"
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="username"
            disabled={loading}
          />

          <div style={{ position: "relative" }}>
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              className="input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              disabled={loading}
            />
            <button
              type="button"
              className="btn-password-toggle"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((s) => !s)}
              tabIndex={0}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button className="btn primary full" type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="login-footer">
          <div className="muted">Test accounts</div>
          <div className="test-buttons">
            <button className="btn ghost" onClick={fillTechnician} type="button">Technician</button>
            <button className="btn ghost" onClick={fillDentist} type="button">Dentist</button>
          </div>
          <div className="muted small" style={{ marginTop: 8 }}>
            Need help? Contact your instructor or check the README.
          </div>
        </div>
      </div>
    </div>
  );
}
