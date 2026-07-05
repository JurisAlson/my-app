"use client";

import { useState, useEffect } from "react";
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

  const [lockedUntil, setLockedUntil] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);

  const router = useRouter();

  useEffect(() => {
    if (!lockedUntil) return;

    const updateTimer = () => {
      const seconds = Math.max(
        0,
        Math.ceil((new Date(lockedUntil).getTime() - Date.now()) / 1000)
      );

      setRemainingTime(seconds);

      if (seconds === 0) {
        setLockedUntil(null);
        setError("");
      }
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [lockedUntil]);

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

      if (response.status === 423) {
        setError(data.message);
        setLockedUntil(data.lockedUntil);
        return;
      }

      if (!response.ok) {
        setError(data.message ?? "Login failed.");
        return;
      }

      setSuccess(data.message ?? "Login successful.");

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <Card>
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white">
          Welcome Back
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Sign in to access your account.
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-500 bg-red-500/10 p-4 text-sm text-red-300">
          <p>{error}</p>

          {lockedUntil && (
            <p className="mt-2 font-medium">
              Try again in{" "}
              {minutes}:{seconds.toString().padStart(2, "0")}
            </p>
          )}
        </div>
      )}

      {success && (
        <div className="mt-6 rounded-lg border border-green-500 bg-green-500/10 p-4 text-sm text-green-300">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            Email Address
          </label>

          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={remainingTime > 0}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            Password
          </label>

          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={remainingTime > 0}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
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
            className="text-cyan-400 transition hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={loading || remainingTime > 0}
        >
          {loading
            ? "Signing In..."
            : remainingTime > 0
            ? `Locked (${minutes}:${seconds
                .toString()
                .padStart(2, "0")})`
            : "Sign In"}
        </Button>
      </form>

      <div className="my-8 flex items-center">
        <div className="h-px flex-1 bg-slate-700" />

        <span className="mx-3 text-xs uppercase tracking-wider text-slate-500">
          Or
        </span>

        <div className="h-px flex-1 bg-slate-700" />
      </div>

      <p className="text-center text-sm text-slate-400">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-cyan-400 transition hover:underline"
        >
          Create Account
        </Link>
      </p>
    </Card>
  );
}