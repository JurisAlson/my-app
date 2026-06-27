"use client";

import { useState } from "react";
import Link from "next/link";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

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

      <form className="space-y-5">

        <div>
          <label className="mb-2 block text-sm text-slate-300">
            Email
          </label>

          <Input
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
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

        <Button>
          Sign In
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