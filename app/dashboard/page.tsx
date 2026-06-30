import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl">

        <h1 className="mb-4 text-3xl font-bold text-white">
          Dashboard
        </h1>

        <p className="mb-8 text-slate-400">
          You are successfully logged in.
        </p>

        <Link
          href="/api/auth/logout"
          className="inline-block rounded-xl bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-400"
        >
          Logout
        </Link>

      </div>
    </main>
  );
}