"use client";
import { useEffect, useState } from "react";
import { getSavedJobs } from "@/lib/api/jobs";
import { JobCard } from "@/components/jobs/JobCard";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Bookmark, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSavedJobs().then((res) => {
      setLoading(false);
      if (res.result) {
        const raw = res.data;
        if (Array.isArray(raw)) setJobs(raw);
        else if (Array.isArray(raw?.data)) setJobs(raw.data);
        else if (Array.isArray(raw?.jobs)) setJobs(raw.jobs);
        else setJobs([]);
        }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/jobs"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-sm"
          >
            <ArrowLeft size={16} /> Back to jobs
          </Link>
          <ThemeToggle />
        </div>
        <div className="max-w-5xl mx-auto mt-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 flex items-center gap-2">
            <Bookmark size={22} /> Saved Jobs
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 animate-pulse">
                <div className="flex gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-1" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                  </div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            <Bookmark size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No saved jobs yet</p>
            <p className="text-sm mt-1">Bookmark jobs to find them here later</p>
            <Link
              href="/jobs"
              className="inline-block mt-4 text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Browse jobs →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map((job: any) => (
              <JobCard key={job.id} job={job} showSave={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}