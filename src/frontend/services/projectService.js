import { request } from "./api.js";

// PROJECTS

export function getProjects() {
  return request("/projects");
}

export function getProject(id) {
  return request(`/projects/${id}`);
}

export function createProject(data) {
  return request("/projects", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateProject(id, data) {
  return request(`/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteProject(id) {
  return request(`/projects/${id}`, {
    method: "DELETE"
  });
}