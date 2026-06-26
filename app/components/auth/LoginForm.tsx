"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md">

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">

        <div className="text-center mb-8">

          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-cyan-500 flex items-center justify-center text-2xl font-bold text-black">
            S
          </div>

          <h1 className="text-3xl font-bold text-white">
            Secure Login
          </h1>

          <p className="text-slate-400 mt-2">
            Sign in to continue.
          </p>

        </div>

        <form className="space-y-5">

          <div>

            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="example@email.com"
              autoComplete="email"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
            />

          </div>

          <div>

            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="current-password"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 pr-14 text-white outline-none transition focus:border-cyan-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-sm text-cyan-400 hover:text-cyan-300"
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

          </div>

          <div className="flex justify-between items-center">

            <label className="flex items-center gap-2 text-sm text-slate-300">

              <input
                type="checkbox"
                className="accent-cyan-500"
              />

              Remember Me

            </label>

            <Link
              href="/forgot-password"
              className="text-sm text-cyan-400 hover:text-cyan-300"
            >
              Forgot Password?
            </Link>

          </div>

          <button
            className="w-full rounded-lg bg-cyan-500 py-3 font-semibold text-black transition hover:bg-cyan-400"
          >
            Sign In
          </button>

        </form>

        <div className="mt-8 border-t border-slate-800 pt-6 text-center">

          <p className="text-slate-400">

            Don't have an account?

            <Link
              href="/register"
              className="ml-2 text-cyan-400 hover:text-cyan-300"
            >
              Create Account
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}