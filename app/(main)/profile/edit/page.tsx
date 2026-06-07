"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyProfile, updateMyProfile, uploadAvatar } from "@/lib/api/auth";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Camera, Plus, Trash2 } from "lucide-react";

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [form, setForm] = useState({
    name: "", phone: "", headline: "", bio: "",
    location: "", linkedin_url: "", github_url: "",
    portfolio_url: "", open_to_work: false,
    skills: [] as string[],
    experience: [] as any[],
    education: [] as any[],
    projects: [] as any[],
    certifications: [] as any[],
  });

  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    getMyProfile().then((res) => {
      setLoading(false);
      if (!res.result) return;
      const user = res.data.user;
      const cp = user.candidate_profile ?? {};
      setAvatarUrl(cp.profile_image_url ?? "");
      setForm({
        name: user.name ?? "",
        phone: user.phone ?? "",
        headline: cp.headline ?? "",
        bio: cp.bio ?? "",
        location: cp.location ?? "",
        linkedin_url: cp.linkedin_url ?? "",
        github_url: cp.github_url ?? "",
        portfolio_url: cp.portfolio_url ?? "",
        open_to_work: cp.open_to_work ?? false,
        skills: cp.skills ?? [],
        experience: cp.experience ?? [],
        education: cp.education ?? [],
        projects: cp.projects ?? [],
        certifications: cp.certifications ?? [],
      });
    });
  }, []);

  function updateField(key: string, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addSkill() {
    if (!newSkill.trim()) return;
    updateField("skills", [...form.skills, newSkill.trim()]);
    setNewSkill("");
  }

  function removeSkill(i: number) {
    updateField("skills", form.skills.filter((_, idx) => idx !== i));
  }

  function addExperience() {
    updateField("experience", [...form.experience, {
      title: "", company: "", start_date: "", end_date: "", description: ""
    }]);
  }

  function updateExperience(i: number, key: string, value: string) {
    const updated = [...form.experience];
    updated[i] = { ...updated[i], [key]: value };
    updateField("experience", updated);
  }

  function removeExperience(i: number) {
    updateField("experience", form.experience.filter((_, idx) => idx !== i));
  }

  function addEducation() {
    updateField("education", [...form.education, {
      degree: "", school: "", start_date: "", end_date: ""
    }]);
  }

  function updateEducation(i: number, key: string, value: string) {
    const updated = [...form.education];
    updated[i] = { ...updated[i], [key]: value };
    updateField("education", updated);
  }

  function removeEducation(i: number) {
    updateField("education", form.education.filter((_, idx) => idx !== i));
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    const res = await uploadAvatar(file);
    setUploadingAvatar(false);
    if (res.result) setAvatarUrl(res.data?.profile_image_url ?? avatarUrl);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await updateMyProfile(form);
    setSaving(false);
    if (!res.result) { setError(res.message); return; }
    setSuccess(true);
    setTimeout(() => router.push("/profile"), 1000);
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
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">
            <ArrowLeft size={16} /> Back
          </button>
          <ThemeToggle />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-6">

        {/* Avatar */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex items-center gap-4">
          <div className="relative">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar"
                className="w-16 h-16 rounded-full object-cover border-2 border-primary-100 dark:border-primary-900" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 font-bold text-xl">
                {form.name?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
            <label className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center cursor-pointer hover:bg-primary-700">
              <Camera size={12} className="text-white" />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">Profile photo</p>
            <p className="text-xs text-gray-400">{uploadingAvatar ? "Uploading..." : "Click the camera to change"}</p>
          </div>
        </div>

        {/* Basic info */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-900 dark:text-gray-50">Basic Info</h2>
          <Input label="Full name" name="name" value={form.name}
            onChange={(e) => updateField("name", e.target.value)} required />
          <Input label="Phone (optional)" name="phone" value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)} />
          <Input label="Headline" name="headline" placeholder="e.g. Full-Stack Developer"
            value={form.headline} onChange={(e) => updateField("headline", e.target.value)} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
            <textarea rows={3} value={form.bio}
              onChange={(e) => updateField("bio", e.target.value)}
              placeholder="Tell employers about yourself..."
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
          </div>
          <Input label="Location" name="location" placeholder="Cairo, Egypt"
            value={form.location} onChange={(e) => updateField("location", e.target.value)} />

          {/* Open to work toggle */}
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Open to work</span>
            <div
              onClick={() => updateField("open_to_work", !form.open_to_work)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                form.open_to_work ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                form.open_to_work ? "translate-x-6" : "translate-x-1"
              }`} />
            </div>
          </label>
        </div>

        {/* Links */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-900 dark:text-gray-50">Links</h2>
          <Input label="LinkedIn URL" name="linkedin_url" type="url"
            placeholder="https://linkedin.com/in/you"
            value={form.linkedin_url} onChange={(e) => updateField("linkedin_url", e.target.value)} />
          <Input label="GitHub URL" name="github_url" type="url"
            placeholder="https://github.com/you"
            value={form.github_url} onChange={(e) => updateField("github_url", e.target.value)} />
          <Input label="Portfolio URL" name="portfolio_url" type="url"
            placeholder="https://yoursite.com"
            value={form.portfolio_url} onChange={(e) => updateField("portfolio_url", e.target.value)} />
        </div>

        {/* Skills */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-900 dark:text-gray-50">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {form.skills.map((skill, i) => (
              <span key={i} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-900">
                {skill}
                <button type="button" onClick={() => removeSkill(i)}>
                  <Trash2 size={10} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              placeholder="Add a skill..."
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button type="button" variant="secondary" size="sm" onClick={addSkill}>
              <Plus size={14} /> Add
            </Button>
          </div>
        </div>

        {/* Experience */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-gray-50">Experience</h2>
            <Button type="button" variant="secondary" size="sm" onClick={addExperience}>
              <Plus size={14} /> Add
            </Button>
          </div>
          {form.experience.map((exp, i) => (
            <div key={i} className="border border-gray-100 dark:border-gray-800 rounded-lg p-4 flex flex-col gap-3">
              <div className="flex justify-end">
                <button type="button" onClick={() => removeExperience(i)}
                  className="text-red-400 hover:text-red-600">
                  <Trash2 size={14} />
                </button>
              </div>
              <Input label="Job title" name="title" value={exp.title}
                onChange={(e) => updateExperience(i, "title", e.target.value)} />
              <Input label="Company" name="company" value={exp.company}
                onChange={(e) => updateExperience(i, "company", e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Start date" name="start_date" type="date" value={exp.start_date}
                  onChange={(e) => updateExperience(i, "start_date", e.target.value)} />
                <Input label="End date" name="end_date" type="date" value={exp.end_date}
                  onChange={(e) => updateExperience(i, "end_date", e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea rows={2} value={exp.description}
                  onChange={(e) => updateExperience(i, "description", e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
              </div>
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-gray-50">Education</h2>
            <Button type="button" variant="secondary" size="sm" onClick={addEducation}>
              <Plus size={14} /> Add
            </Button>
          </div>
          {form.education.map((edu, i) => (
            <div key={i} className="border border-gray-100 dark:border-gray-800 rounded-lg p-4 flex flex-col gap-3">
              <div className="flex justify-end">
                <button type="button" onClick={() => removeEducation(i)}
                  className="text-red-400 hover:text-red-600">
                  <Trash2 size={14} />
                </button>
              </div>
              <Input label="Degree" name="degree" value={edu.degree}
                onChange={(e) => updateEducation(i, "degree", e.target.value)} />
              <Input label="School" name="school" value={edu.school}
                onChange={(e) => updateEducation(i, "school", e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Start date" name="start_date" type="date" value={edu.start_date}
                  onChange={(e) => updateEducation(i, "start_date", e.target.value)} />
                <Input label="End date" name="end_date" type="date" value={edu.end_date}
                  onChange={(e) => updateEducation(i, "end_date", e.target.value)} />
              </div>
            </div>
          ))}
        </div>

        {/* Error / Success */}
        {error && (
          <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
        {success && (
          <div className="px-4 py-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-600 dark:text-green-400">Profile saved! Redirecting...</p>
          </div>
        )}

        <Button type="submit" loading={saving} fullWidth size="lg">
          Save profile
        </Button>
      </form>
    </div>
  );
}