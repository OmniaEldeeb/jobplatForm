"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCompanyJob, getJobApplications, toggleJobActive } from "@/lib/api/jobs";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Users, ToggleLeft, ToggleRight, Clock } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  reviewed: "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  interview_invited: "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  hired: "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
  rejected: "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
};

export default function CompanyJobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getCompanyJob(Number(id)),
      getJobApplications(Number(id)),
    ]).then(([jobRes, appsRes]) => {
      setLoading(false);
      if (jobRes.result) setJob(jobRes.data?.job ?? jobRes.data);
      if (appsRes.result) {
        const raw = appsRes.data;
        setApplications(Array.isArray(raw) ? raw : raw?.data ?? []);
      }
    });
  }, [id]);

  async function handleToggle() {
    const res = await toggleJobActive(Number(id));
    if (res.result) setJob((prev: any) => ({ ...prev, is_active: res.data.is_active }));
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
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">
            <ArrowLeft size={16} /> Dashboard
          </button>
          <ThemeToggle />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-6">

        {/* Job header */}
        {job && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-50">{job.title}</h1>
                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                  {job.location && <span>{job.location}</span>}
                  {job.expires_at && (
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> Expires {new Date(job.expires_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  job.is_active
                    ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                }`}>
                  {job.is_active ? "Active" : "Inactive"}
                </span>
                <button onClick={handleToggle}
                  className={`p-2 rounded-lg transition-colors ${
                    job.is_active
                      ? "text-green-500 hover:bg-green-50 dark:hover:bg-green-950/30"
                      : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}>
                  {job.is_active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Applications */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <Users size={18} className="text-gray-400" />
            <h2 className="font-semibold text-gray-900 dark:text-gray-50">
              Applications ({applications.length})
            </h2>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Users size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No applications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {applications.map((app: any) => (
                <div key={app.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {app.candidate?.candidate_profile?.profile_image_url ? (
                      <img
                        src={app.candidate.candidate_profile.profile_image_url}
                        alt={app.candidate.name}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 font-bold text-sm">
                        {app.candidate?.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {app.candidate?.name ?? "Candidate"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {app.candidate?.candidate_profile?.headline ?? app.candidate?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {app.cv_score && (
                      <span className="text-xs text-gray-500">
                        CV Score: <span className="font-medium text-gray-700 dark:text-gray-300">{app.cv_score}%</span>
                      </span>
                    )}
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${
                      statusColors[app.status] ?? statusColors.pending
                    }`}>
                      {app.status?.replace(/_/g, " ")}
                    </span>
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