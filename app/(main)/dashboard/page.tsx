"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCompanyDashboard, getCompanyJobs, toggleJobActive, deleteJob } from "@/lib/api/jobs";
import { logoutApi } from "@/lib/api/auth";
import { clearToken } from "@/lib/api/client";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import {
  Briefcase, Users, Clock, TrendingUp,
  Plus, ToggleLeft, ToggleRight, Trash2,
  Eye, LogOut, Building2
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getCompanyDashboard(),
      getCompanyJobs(),
    ]).then(([dashRes, jobsRes]) => {
      setLoading(false);
      if (dashRes.result) setStats(dashRes.data);
      if (jobsRes.result) {
        const raw = jobsRes.data;
        setJobs(Array.isArray(raw) ? raw : raw?.data ?? []);
      }
    });
  }, []);

  async function handleToggle(id: number) {
    const res = await toggleJobActive(id);
    if (res.result) {
      setJobs((prev) => prev.map((j) =>
        j.id === id ? { ...j, is_active: res.data.is_active } : j
      ));
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this job?")) return;
    const res = await deleteJob(id);
    if (res.result) setJobs((prev) => prev.filter((j) => j.id !== id));
  }

  async function handleLogout() {
    await logoutApi();
    clearToken();
    router.push("/auth/login");
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
            <Building2 size={20} />
            <span className="font-semibold text-lg">Company Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <LogOut size={16} /> Logout
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col gap-6">

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Jobs", value: stats.total_jobs, icon: Briefcase, color: "text-primary-600 dark:text-primary-400" },
              { label: "Active Jobs", value: stats.active_jobs, icon: TrendingUp, color: "text-green-600 dark:text-green-400" },
              { label: "Total Applications", value: stats.total_applications, icon: Users, color: "text-blue-600 dark:text-blue-400" },
              { label: "Pending Review", value: stats.pending_review, icon: Clock, color: "text-yellow-600 dark:text-yellow-400" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
                <div className={`mb-2 ${color}`}>
                  <Icon size={20} />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">{value ?? 0}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Jobs list */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-gray-50">Your Job Postings</h2>
            <Button size="sm" onClick={() => router.push("/dashboard/jobs/new")}>
              <Plus size={14} /> Post a Job
            </Button>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400">
              <Briefcase size={36} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No jobs posted yet</p>
              <p className="text-sm mt-1">Post your first job to start receiving applications</p>
              <Button className="mt-4" onClick={() => router.push("/dashboard/jobs/new")}>
                <Plus size={14} /> Post a Job
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {jobs.map((job: any) => (
                <div key={job.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {job.title}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        job.is_active
                          ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                      }`}>
                        {job.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                      <span>{job.applications_count ?? 0} applications</span>
                      {job.location && <span>· {job.location}</span>}
                      {job.expires_at && (
                        <span>· Expires {new Date(job.expires_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Link href={`/dashboard/jobs/${job.id}`}>
                      <button className="p-2 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <Eye size={16} />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleToggle(job.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        job.is_active
                          ? "text-green-500 hover:bg-green-50 dark:hover:bg-green-950/30"
                          : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {job.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}