"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyProfile, logoutApi } from "@/lib/api/auth";
import { clearToken } from "@/lib/api/client";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import {
  User, MapPin, Link2, GitBranch,
  Briefcase, GraduationCap, Award, FolderOpen,
  Edit, LogOut, BookmarkCheck, FileText, ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyProfile().then((res) => {
      setLoading(false);
      if (res.result) setProfile(res.data.user);
    });
  }, []);

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

  const cp = profile?.candidate_profile;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/jobs" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">
            ← Jobs
          </Link>
          <ThemeToggle />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-6">

        {/* Profile card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              {cp?.profile_image_url ? (
                <img
                  src={cp.profile_image_url}
                  alt={profile?.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary-100 dark:border-primary-900"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-xl">
                  {profile?.name?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-50">{profile?.name}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{profile?.email}</p>
                {cp?.headline && (
                  <p className="text-sm text-primary-600 dark:text-primary-400 mt-0.5">{cp.headline}</p>
                )}
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => router.push("/profile/edit")}>
              <Edit size={14} /> Edit
            </Button>
          </div>

          {/* Open to work badge */}
          {cp?.open_to_work && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-xs font-medium mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Open to work
            </div>
          )}

          {/* Bio */}
          {cp?.bio && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{cp.bio}</p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
            {cp?.location && (
              <span className="flex items-center gap-1"><MapPin size={14} />{cp.location}</span>
            )}
            {cp?.linkedin_url && (
              <a href={cp.linkedin_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400">
                <Link2 size={14} /> LinkedIn
              </a>
            )}
            {cp?.GitBranch_url && (
              <a href={cp.GitBranch_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400">
                <GitBranch size={14} /> GitBranch
              </a>
            )}
            {cp?.portfolio_url && (
              <a href={cp.portfolio_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400">
                <Link2 size={14} /> Portfolio
              </a>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          {[
            { icon: FileText, label: "My Applications", href: "/applications" },
            { icon: BookmarkCheck, label: "Saved Jobs", href: "/saved-jobs" },
          ].map(({ icon: Icon, label, href }) => (
            <Link key={href} href={href}
              className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0">
              <div className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Icon size={18} className="text-gray-400" /> {label}
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>
          ))}
        </div>

        {/* Skills */}
        {cp?.skills?.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 dark:text-gray-50 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {cp.skills.map((skill: string, i: number) => (
                <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-900">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {cp?.experience?.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 dark:text-gray-50 mb-4 flex items-center gap-2">
              <Briefcase size={18} /> Experience
            </h2>
            <div className="flex flex-col gap-4">
              {cp.experience.map((exp: any, i: number) => (
                <div key={i} className="border-l-2 border-primary-200 dark:border-primary-800 pl-4">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{exp.title}</p>
                  <p className="text-sm text-gray-500">{exp.company}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {exp.start_date} — {exp.end_date ?? "Present"}
                  </p>
                  {exp.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {cp?.education?.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 dark:text-gray-50 mb-4 flex items-center gap-2">
              <GraduationCap size={18} /> Education
            </h2>
            <div className="flex flex-col gap-4">
              {cp.education.map((edu: any, i: number) => (
                <div key={i} className="border-l-2 border-primary-200 dark:border-primary-800 pl-4">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{edu.degree}</p>
                  <p className="text-sm text-gray-500">{edu.school}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {edu.start_date} — {edu.end_date ?? "Present"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {cp?.projects?.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 dark:text-gray-50 mb-4 flex items-center gap-2">
              <FolderOpen size={18} /> Projects
            </h2>
            <div className="flex flex-col gap-3">
              {cp.projects.map((proj: any, i: number) => (
                <div key={i}>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{proj.name}</p>
                    {proj.url && (
                      <a href={proj.url} target="_blank" rel="noopener noreferrer"
                        className="text-primary-500 hover:text-primary-700">
                        <Link2 size={14} />
                      </a>
                    )}
                  </div>
                  {proj.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{proj.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {cp?.certifications?.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 dark:text-gray-50 mb-4 flex items-center gap-2">
              <Award size={18} /> Certifications
            </h2>
            <div className="flex flex-col gap-3">
              {cp.certifications.map((cert: any, i: number) => (
                <div key={i}>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{cert.name}</p>
                  <p className="text-sm text-gray-500">{cert.issuer} · {cert.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-sm font-medium"
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </div>
  );
}