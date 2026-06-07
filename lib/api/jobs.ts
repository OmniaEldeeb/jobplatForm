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