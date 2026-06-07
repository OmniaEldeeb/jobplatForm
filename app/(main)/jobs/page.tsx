"use client";
import { useState, useEffect } from "react";
import { JobCard } from "@/components/jobs/JobCard";
import { JobFilters } from "@/components/jobs/JobFilters";
import { getJobs, getCategories } from "@/lib/api/jobs";
import { Briefcase } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const EMPTY_FILTERS = {
  search: "", work_type: "", work_model: "",
  level: "", location: "", category_id: "",
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Load categories once
  useEffect(() => {
    getCategories().then((res) => {
      if (res.result) setCategories(res.data);
    });
  }, []);

  // Load jobs — single effect watching filters + page
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getJobs({
      ...filters,
      category_id: filters.category_id ? Number(filters.category_id) : undefined,
      page,
    }).then((res) => {
      if (cancelled) return;
      setLoading(false);
      if (res.result) {
        setJobs(res.data.data ?? res.data);
        setLastPage(res.data.last_page ?? 1);
      }
    });
    return () => { cancelled = true; };
  }, [filters, page]);

  function handleFiltersChange(newFilters: typeof EMPTY_FILTERS) {
    setFilters(newFilters);
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
            <Briefcase size={20} />
            <span className="font-semibold text-lg">JobPlatform</span>
          </div>
          <ThemeToggle />
        </div>
        <div className="max-w-5xl mx-auto mt-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Find your next role
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Browse open positions
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col gap-4">
        {/* Filters */}
        <JobFilters
          filters={filters}
          categories={categories}
          onChange={handleFiltersChange}
        />

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 animate-pulse">
                <div className="flex gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-1" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                  </div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 text-gray-500 dark:text-gray-400">
            <Briefcase size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No jobs found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => <JobCard key={job.id} job={job} />)}
            </div>

            {/* Pagination */}
            {lastPage > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-gray-500">
                  Page {page} of {lastPage}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                  disabled={page === lastPage}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}