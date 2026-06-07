import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Briefcase } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold text-lg"
        >
          <Briefcase size={22} />
          <span>JobPlatform</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Centered card */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
            {/* Title */}
            <div className="mb-7">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}