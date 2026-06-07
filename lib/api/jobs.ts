import { apiRequest } from "./client";

export type JobFilters = {
  search?: string;
  category_id?: number;
  work_type?: string;
  work_model?: string;
  level?: string;
  location?: string;
  page?: number;
};

export function getJobs(params?: JobFilters) {
  const query = new URLSearchParams();
  query.set("active_only", "true"); // always filter active jobs
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== "") query.set(k, String(v));
    });
  }
  return apiRequest<any>(`/jobs?${query.toString()}`, { noAuth: true });
}

export function getJob(id: number) {
  return apiRequest<any>(`/jobs/${id}`, { noAuth: true });
}

export function getCategories() {
  return apiRequest<any>("/categories", { noAuth: true });
}


export function applyToJob(jobId: number, data: { cv_id: number; cover_letter?: string }) {
  return apiRequest<any>(`/jobs/${jobId}/apply`, {
    method: "POST",
    body: data,
  });
}

export function getCvs() {
  return apiRequest<any>("/cv", {});
}


export function toggleSaveJob(jobId: number) {
  return apiRequest<{ saved: boolean }>(`/jobs/${jobId}/save`, {
    method: "POST",
  });
}

export function getSavedJobs() {
  return apiRequest<any>("/candidate/saved-jobs", {});
}