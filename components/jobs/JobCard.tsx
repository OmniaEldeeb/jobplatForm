"use client";
import Link from "next/link";
import { MapPin, Bookmark } from "lucide-react";
import { useState } from "react";
import { toggleSaveJob } from "@/lib/api/jobs";

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

function cleanUrl(url: string) {
  return url?.replace(/\s+/g, "");
}

export function JobCard({ job, showSave = true }: { job: any; showSave?: boolean }) {
  const [saved, setSaved] = useState<boolean>(job.is_saved ?? false);
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setSaving(true);
    const res = await toggleSaveJob(job.id);
    setSaving(false);
    if (res.result) setSaved(res.data.saved);
  }

  return (
    <Link href={`/jobs/${job.id}`}>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-sm transition-all duration-200 cursor-pointer relative">

        {/* Save button */}
        {showSave && (
          <button
            onClick={handleSave}
            disabled={saving}
            className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors ${
              saved
                ? "text-primary-600 dark:text-primary-400"
                : "text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400"
            }`}
          >
            <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
          </button>
        )}

        {/* Company info */}
        <div className="flex items-center gap-3 mb-3">
          {job.company?.logo_url ? (
            <img
              src={cleanUrl(job.company.logo_url)}
              alt={job.company.name}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling?.removeAttribute("style");
              }}
              className="w-10 h-10 rounded-lg object-cover border border-gray-100 dark:border-gray-800"
            />
          ) : null}
          <div
            style={job.company?.logo_url ? { display: "none" } : {}}
            className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm"
          >
            {job.company?.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {job.company?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {job.company?.industry}
            </p>
          </div>
        </div>

        {/* Job title */}
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-50 mb-2 pr-8">
          {job.title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
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

        {/* Location & salary */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <MapPin size={12} />
            <span>{job.location ?? "Not specified"}</span>
          </div>
          {job.salary_range && (
            <span className="text-primary-600 dark:text-primary-400 font-medium">
              {job.salary_range}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}