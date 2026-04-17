"use client";

import { FormEvent, useState } from "react";

import { submitInquiry } from "@/lib/api";

const initialState = {
  full_name: "",
  company_name: "",
  email: "",
  phone: "",
  inquiry_type: "New Project",
  message: ""
};

export function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await submitInquiry(form);
      setStatus("success");
      setMessage(response.message);
      setForm(initialState);
    } catch {
      setStatus("error");
      setMessage("The backend is not currently reachable. Start the FastAPI service and try again.");
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          Full Name
          <input
            required
            value={form.full_name}
            onChange={(event) => setForm({ ...form, full_name: event.target.value })}
          />
        </label>
        <label>
          Company
          <input
            required
            value={form.company_name}
            onChange={(event) => setForm({ ...form, company_name: event.target.value })}
          />
        </label>
        <label>
          Email
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </label>
        <label>
          Phone
          <input
            required
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
          />
        </label>
        <label>
          Inquiry Type
          <select
            value={form.inquiry_type}
            onChange={(event) => setForm({ ...form, inquiry_type: event.target.value })}
          >
            <option>New Project</option>
            <option>Partnership</option>
            <option>Subcontractor Registration</option>
            <option>Media Request</option>
            <option>General Question</option>
          </select>
        </label>
      </div>
      <label>
        Project Brief
        <textarea
          required
          rows={6}
          value={form.message}
          onChange={(event) => setForm({ ...form, message: event.target.value })}
        />
      </label>
      <div className="form-actions">
        <button className="button" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Sending..." : "Send inquiry"}
        </button>
        {message ? (
          <span className={status === "success" ? "status-success" : "status-error"}>{message}</span>
        ) : null}
      </div>
    </form>
  );
}
