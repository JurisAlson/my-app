"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMail, FiUser, FiLock } from "react-icons/fi";

export default function RegistrationForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message) {
          setError(data.message);
        } else if (data.errors?.fieldErrors) {
          const fieldErrors = Object.values(data.errors.fieldErrors)
            .flat()
            .filter(Boolean)
            .join("\n");

          setError(fieldErrors || "Registration failed.");
        } else {
          setError("Registration failed.");
        }

        return;
      }

      setSuccess(data.message || "Registration successful.");

      setEmail("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
      <h1 className="text-center text-3xl font-bold text-white">
        Create Account
      </h1>

      <p className="mt-2 mb-8 text-center text-slate-400">
        Register for a secure account
      </p>

      {error && (
        <div className="mb-4 whitespace-pre-line rounded-lg border border-red-500 bg-red-500/20 p-3 text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg border border-green-500 bg-green-500/20 p-3 text-green-300">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="text-sm text-slate-300">
            Email
          </label>

          <div className="mt-2 flex items-center rounded-lg border border-slate-700 bg-slate-800 px-3">
            <FiMail className="text-slate-400" />

            <input
              type="email"
              autoComplete="email"
              required
              placeholder="example@email.com"
              className="w-full bg-transparent p-3 text-white outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Username */}
        <div>
          <label className="text-sm text-slate-300">
            Username
          </label>

          <div className="mt-2 flex items-center rounded-lg border border-slate-700 bg-slate-800 px-3">
            <FiUser className="text-slate-400" />

            <input
              type="text"
              autoComplete="username"
              required
              placeholder="Username"
              className="w-full bg-transparent p-3 text-white outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-sm text-slate-300">
            Password
          </label>

          <div className="mt-2 flex items-center rounded-lg border border-slate-700 bg-slate-800 px-3">
            <FiLock className="text-slate-400" />

            <input
              type="password"
              autoComplete="new-password"
              required
              placeholder="Password"
              className="w-full bg-transparent p-3 text-white outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-sm text-slate-300">
            Confirm Password
          </label>

          <div className="mt-2 flex items-center rounded-lg border border-slate-700 bg-slate-800 px-3">
            <FiLock className="text-slate-400" />

            <input
              type="password"
              autoComplete="new-password"
              required
              placeholder="Confirm Password"
              className="w-full bg-transparent p-3 text-white outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-slate-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-blue-400 hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}