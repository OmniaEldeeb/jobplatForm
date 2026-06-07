"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createJob, getCategories } from "@/lib/api/jobs";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

export default function NewJobPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const [form, setForm] = useState({
    title: "",
    target_role: "",
    description: "",
    location: "",
    work_type: "full_time",
    work_model: "onsite",
    experience_level: "",
    salary_range: "",
    category_id: "",
    expires_at: "",
    announce_in_feed: false,
    requirements: [] as string[],
    skills: [] as string[],
  });

  const [newReq, setNewReq] = useState("");
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    getCategories().then((res) => {
      if (res.result) setCategories(res.data);
    });
  }, []);

  function updateField(key: string, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setErrors({});
    setLoading(true);

    const res = await createJob({
      ...form,
      category_id: form.category_id ? Number(form.category_id) : undefined,
      expires_at: form.expires_at || undefined,
    });

    setLoading(false);

    if (!res.result) {
      if (res.meta?.errors) setErrors(res.meta.errors);
      else setError(res.message);
      return;
    }

    router.push("/dashboard");
  }

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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Post a New Job</h1>

        {/* Basic info */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-900 dark:text-gray-50">Job Details</h2>

          <Input label="Job Title" name="title" placeholder="e.g. Senior Laravel Developer"
            value={form.title} onChange={(e) => updateField("title", e.target.value)}
            error={errors.title?.[0]} required />

          <Input label="Target Role" name="target_role" placeholder="e.g. Backend Engineer"
            value={form.target_role} onChange={(e) => updateField("target_role", e.target.value)}
            error={errors.target_role?.[0]} required />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea rows={5} value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
            {errors.description?.[0] && (
              <p className="text-xs text-red-500">{errors.description[0]}</p>
            )}
          </div>

          <Input label="Location" name="location" placeholder="e.g. Cairo, Egypt"
            value={form.location} onChange={(e) => updateField("location", e.target.value)} />

          <Input label="Salary Range (optional)" name="salary_range"
            placeholder="e.g. 25,000 – 35,000 EGP / month"
            value={form.salary_range} onChange={(e) => updateField("salary_range", e.target.value)} />

          <Input label="Expires At (optional)" name="expires_at" type="date"
            value={form.expires_at} onChange={(e) => updateField("expires_at", e.target.value)} />
        </div>

        {/* Dropdowns */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-900 dark:text-gray-50">Job Type</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Work Type</label>
              <select value={form.work_type} onChange={(e) => updateField("work_type", e.target.value)}
                className="px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Work Model</label>
              <select value={form.work_model} onChange={(e) => updateField("work_model", e.target.value)}
                className="px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="onsite">On-site</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Experience Level</label>
              <select value={form.experience_level} onChange={(e) => updateField("experience_level", e.target.value)}
                className="px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Any Level</option>
                <option value="entry">Entry</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
                <option value="staff">Staff</option>
                <option value="principal">Principal</option>
                <option value="manager">Manager</option>
                <option value="director">Director</option>
                <option value="vp">VP</option>
                <option value="executive">Executive</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <select value={form.category_id} onChange={(e) => updateField("category_id", e.target.value)}
                className="px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">No Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Announce in feed */}
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Announce in feed</p>
              <p className="text-xs text-gray-400">Post this job to the social feed</p>
            </div>
            <div
              onClick={() => updateField("announce_in_feed", !form.announce_in_feed)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                form.announce_in_feed ? "bg-primary-600" : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                form.announce_in_feed ? "translate-x-6" : "translate-x-1"
              }`} />
            </div>
          </label>
        </div>

        {/* Requirements */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-900 dark:text-gray-50">Requirements</h2>
          <div className="flex flex-col gap-2">
            {form.requirements.map((req, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
                  {req}
                </span>
                <button type="button" onClick={() =>
                  updateField("requirements", form.requirements.filter((_, idx) => idx !== i))}
                  className="text-red-400 hover:text-red-600">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={newReq}
              onChange={(e) => setNewReq(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (newReq.trim()) {
                    updateField("requirements", [...form.requirements, newReq.trim()]);
                    setNewReq("");
                  }
                }
              }}
              placeholder="Add a requirement..."
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button type="button" variant="secondary" size="sm" onClick={() => {
              if (newReq.trim()) {
                updateField("requirements", [...form.requirements, newReq.trim()]);
                setNewReq("");
              }
            }}>
              <Plus size={14} /> Add
            </Button>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-900 dark:text-gray-50">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {form.skills.map((skill, i) => (
              <span key={i} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-900">
                {skill}
                <button type="button" onClick={() =>
                  updateField("skills", form.skills.filter((_, idx) => idx !== i))}>
                  <Trash2 size={10} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (newSkill.trim()) {
                    updateField("skills", [...form.skills, newSkill.trim()]);
                    setNewSkill("");
                  }
                }
              }}
              placeholder="Add a skill..."
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button type="button" variant="secondary" size="sm" onClick={() => {
              if (newSkill.trim()) {
                updateField("skills", [...form.skills, newSkill.trim()]);
                setNewSkill("");
              }
            }}>
              <Plus size={14} /> Add
            </Button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <Button type="submit" loading={loading} fullWidth size="lg">
          Post Job
        </Button>
      </form>
    </div>
  );
}