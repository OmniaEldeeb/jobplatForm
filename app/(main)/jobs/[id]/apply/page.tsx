"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getJob, applyToJob, getCvs } from "@/lib/api/jobs";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Briefcase, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ApplyPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [cvs, setCvs] = useState<any[]>([]);
  const [selectedCv, setSelectedCv] = useState<number | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    Promise.all([
      getJob(Number(id)),
      getCvs(),
    ]).then(([jobRes, cvsRes]) => {
      setLoading(false);
      if (jobRes.result) setJob(jobRes.data);
      if (cvsRes.result) setCvs(cvsRes.data?.data ?? cvsRes.data ?? []);
    });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCv) { setError("Please select a CV."); return; }
    setError("");
    setSubmitting(true);
    const res = await applyToJob(Number(id), {
      cv_id: selectedCv,
      cover_letter: coverLetter || undefined,
    });
    setSubmitting(false);
    if (!res.result) {
      setError(res.message);
      return;
    }
    setSuccess(true);
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (success) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center gap-4 px-6">
      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
        <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
      </div>
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-50">Application submitted!</h1>
      <p className="text-gray-500 dark:text-gray-400 text-center text-sm">
        Your application for <span className="font-medium text-gray-700 dark:text-gray-300">{job?.title}</span> has been sent successfully.
      </p>
      <div className="flex gap-3 mt-2">
        <Button variant="secondary" onClick={() => router.push("/jobs")}>
          Browse more jobs
        </Button>
        <Button onClick={() => router.push("/applications")}>
          My applications
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link
            href={`/jobs/${id}`}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-sm"
          >
            <ArrowLeft size={16} /> Back to job
          </Link>
          <ThemeToggle />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-6">
        {/* Job summary */}
        {job && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
                {job.company?.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-50">{job.title}</p>
                <p className="text-sm text-gray-500">{job.company?.name} · {job.location}</p>
              </div>
            </div>
          </div>
        )}

        {/* Apply form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* CV selection */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
            <h2 className="font-semibold text-gray-900 dark:text-gray-50 mb-4 flex items-center gap-2">
              <FileText size={18} /> Select your CV
            </h2>

            {cvs.length === 0 ? (
              <div className="text-center py-8">
                <FileText size={32} className="mx-auto mb-3 text-gray-300" />
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  You don't have any CVs yet.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push("/profile/cv")}
                >
                  Create a CV first
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {cvs.map((cv: any) => (
                  <label
                    key={cv.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedCv === cv.id
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="cv"
                      value={cv.id}
                      checked={selectedCv === cv.id}
                      onChange={() => setSelectedCv(cv.id)}
                      className="accent-primary-600"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {cv.name ?? `CV #${cv.id}`}
                      </p>
                      {cv.updated_at && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          Updated {new Date(cv.updated_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {selectedCv === cv.id && (
                      <CheckCircle size={18} className="text-primary-600 dark:text-primary-400" />
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Cover letter */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
            <h2 className="font-semibold text-gray-900 dark:text-gray-50 mb-1">
              Cover letter <span className="text-gray-400 font-normal text-sm">(optional)</span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Max 3000 characters</p>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              maxLength={3000}
              rows={6}
              placeholder="Tell the company why you're a great fit for this role..."
              className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">
              {coverLetter.length}/3000
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            loading={submitting}
            fullWidth
            size="lg"
            disabled={cvs.length === 0}
          >
            Submit application
          </Button>
        </form>
      </div>
    </div>
  );
}