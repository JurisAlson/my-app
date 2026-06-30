"use client";

import { useState } from "react";
import Link from "next/link";

import { useRouter } from "next/navigation";

import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? "Login failed.");
        return;
      }

      setSuccess(data.message ?? "Login successful.");

      router.push("/dashboard");

      // We'll add session handling and redirect later.

    } catch (err) {
      console.error(err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white">
          SecureAuth
        </h1>

        <p className="mt-2 text-slate-400">
          Secure Authentication Portal
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500 bg-red-500/20 p-3 text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg border border-green-500 bg-green-500/20 p-3 text-green-300">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Email
          </label>

          <Input
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Password
          </label>

          <div className="relative">

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>

          </div>
        </div>

        <div className="flex items-center justify-between text-sm">

          <label className="flex items-center gap-2 text-slate-300">

            <input
              type="checkbox"
              className="accent-cyan-500"
            />

            Remember Me

          </label>

          <Link
            href="/forgot-password"
            className="text-cyan-400 hover:underline"
          >
            Forgot Password?
          </Link>

        </div>

        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </Button>

      </form>

      <div className="my-8 flex items-center">

        <div className="h-px flex-1 bg-slate-700" />

        <span className="mx-3 text-sm text-slate-500">
          OR
        </span>

        <div className="h-px flex-1 bg-slate-700" />

      </div>

      <p className="text-center text-slate-400">

        Don't have an account?{" "}

        <Link
          href="/register"
          className="font-semibold text-cyan-400 hover:underline"
        >
          Create Account
        </Link>

      </p>

    </Card>
  );
}