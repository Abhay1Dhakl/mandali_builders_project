"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";
const TOKEN_STORAGE_KEY = "mandali_admin_token";

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("mandali123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = (await response.json()) as { access_token: string };
      localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
      router.push("/admin/dashboard");
    } catch {
      setError("Login failed. Start the backend and use the seeded admin credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="admin-auth-card" onSubmit={handleSubmit}>
      <span className="eyebrow">Admin Access</span>
      <h1>Mandali Builders Control Room</h1>
      <p>Manage profile content, services, sectors, projects, insights, offices, and incoming client inquiries.</p>
      <label>
        Username
        <input value={username} onChange={(event) => setUsername(event.target.value)} />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      <button className="button" type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Enter admin panel"}
      </button>
      {error ? <span className="status-error">{error}</span> : null}
      <div className="admin-credentials">
        <strong>Seeded login</strong>
        <span>`admin` / `mandali123`</span>
      </div>
    </form>
  );
}
