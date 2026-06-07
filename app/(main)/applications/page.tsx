"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api/client";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Briefcase, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  reviewed: "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  accepted: "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
  rejected: "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
  hired: "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<any>("/candidate/applications").then((res) => {
      setLoading(false);
      if (res.result) {
        const raw = res.data;
        if (Array.isArray(raw)) setApplications(raw);
        else if (Array.isArray(raw?.data)) setApplications(raw.data);
        else setApplications([]);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/profile"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">
            <ArrowLeft size={16} /> Back
          </Link>
          <ThemeToggle />
        </div>
        <div className="max-w-3xl mx-auto mt-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 flex items-center gap-2">
            <Briefcase size={22} /> My Applications
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6 flex flex-col gap-4">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            <Briefcase size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No applications yet</p>
            <p className="text-sm mt-1">Apply to jobs to see them here</p>
            <Link href="/jobs"
              className="inline-block mt-4 text-sm text-primary-600 dark:text-primary-400 hover:underline">
              Browse jobs →
            </Link>
          </div>
        ) : (
          applications.map((app: any) => (
            <div key={app.id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                    {app.job?.title ?? "Job"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {app.job?.company?.name ?? "Company"}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                    <Clock size={12} />
                    {new Date(app.created_at).toLocaleDateString()}
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${
                  statusColors[app.status] ?? statusColors.pending
                }`}>
                  {app.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}