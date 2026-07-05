import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            OSA Recommendation System
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Office of Student Affairs
          </p>
        </div>

        {/* Form */}
        {children}
      </div>
    </main>
  );
}