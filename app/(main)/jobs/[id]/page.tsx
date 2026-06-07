"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getJob, toggleSaveJob } from "@/lib/api/jobs";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import {
  Briefcase, MapPin, ArrowLeft, Clock,
  DollarSign, Bookmark
} from "lucide-react";
import Link from "next/link";

const workTypeLabel: Record<string, string> = {
  full_time: "Full Time", part_time: "Part Time",
  contract: "Contract", freelance: "Freelance", internship: "Internship",
};
const workModelLabel: Record<string, string> = {
  onsite: "On-site", remote: "Remote", hybrid: "Hybrid",
};
const levelLabel: Record<string, string> = {
  entry: "Entry", junior: "Junior", mid: "Mid", senior: "Senior",
  lead: "Lead", staff: "Staff", principal: "Principal",
  manager: "Manager", director: "Director", vp: "VP", executive: "Executive",
};

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getJob(Number(id)).then((res) => {
      setLoading(false);
      if (res.result) {
        setJob(res.data);
        setSaved(res.data.is_saved ?? false);
      } else {
        setNotFound(true);
      }
    });
  }, [id]);

  async function handleSave() {
    setSaving(true);
    const res = await toggleSaveJob(Number(id));
    setSaving(false);
    if (res.result) setSaved(res.data.saved);
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center gap-4">
      <Briefcase size={40} className="text-gray-300" />
      <p className="text-gray-500">Job not found</p>
      <Button onClick={() => router.push("/jobs")}>Back to Jobs</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            href="/jobs"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-sm"
          >
            <ArrowLeft size={16} /> Back to jobs
          </Link>
          <ThemeToggle />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-6">
        {/* Job header card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          {/* Company */}
          <div className="flex items-center gap-3 mb-4">
            {job.company?.logo_url ? (
              <img
                src={job.company.logo_url}
                alt={job.company.name}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.removeAttribute("style");
                }}
                className="w-12 h-12 rounded-xl object-cover border border-gray-100 dark:border-gray-800"
              />
            ) : null}
            <div
              style={job.company?.logo_url ? { display: "none" } : {}}
              className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-lg"
            >
              {job.company?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">{job.company?.name}</p>
              <p className="text-sm text-gray-500">{job.company?.industry}</p>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-4">
            {job.title}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {job.work_type && (
              <span className="text-xs px-2 py-1 rounded-md bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-900">
                {workTypeLabel[job.work_type] ?? job.work_type}
              </span>
            )}
            {job.work_model && (
              <span className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                {workModelLabel[job.work_model] ?? job.work_model}
              </span>
            )}
            {job.experience_level && (
              <span className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                {levelLabel[job.experience_level] ?? job.experience_level}
              </span>
            )}
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
            {job.location && (
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {job.location}
              </span>
            )}
            {job.salary_range && (
              <span className="flex items-center gap-1 text-primary-600 dark:text-primary-400 font-medium">
                <DollarSign size={14} /> {job.salary_range}
              </span>
            )}
            {job.expires_at && (
              <span className="flex items-center gap-1">
                <Clock size={14} /> Expires {new Date(job.expires_at).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button size="lg" className="flex-1" onClick={() => router.push(`/jobs/${id}/apply`)}>
              Apply Now
            </Button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-4 py-3 rounded-lg border-2 transition-all ${
                saved
                  ? "border-primary-500 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/30"
                  : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300"
              }`}
            >
              <Bookmark size={20} fill={saved ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {/* Description */}
        {job.description && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 dark:text-gray-50 mb-3">About this role</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>
        )}

        {/* Requirements */}
        {job.requirements?.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 dark:text-gray-50 mb-3">Requirements</h2>
            <ul className="flex flex-col gap-2">
              {job.requirements.map((req: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills */}
        {job.skills?.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 dark:text-gray-50 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill: string, i: number) => (
                <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}