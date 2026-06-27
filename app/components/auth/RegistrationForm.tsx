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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    // Backend will be connected in the next step.
    console.log({
      email,
      username,
      password,
      confirmPassword,
    });

    setLoading(false);
  }

  return (
    <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-8 shadow-2xl">

      <h1 className="text-3xl font-bold text-white text-center">
        Create Account
      </h1>

      <p className="text-slate-400 text-center mt-2 mb-8">
        Register for a secure account
      </p>

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
          className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
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