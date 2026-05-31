import { request } from "./api.js";

// TASKS

export function getBacklogTasks(projectId) {
  return request(`/tasks/backlog?projectId=${projectId}`);
}

export function getById(id) {
  return request(`/tasks/${id}`);
}

export function createTask(data) {
  return request("/tasks", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function reorder(payload) {
  return request("/tasks/reorder", {
    method: "PATCH",
    body: JSON.stringify({ tasks: payload })
  });
}
export function deleteTask(id) {
  return request(`/tasks/${id}`, {
    method: "DELETE"
  });
}

export function updateTask(id, data) {
  return request(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function addToSprint(id, payload) {
  return request(`/tasks/${id}/add-to-sprint`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}


export function removeTaskFromSprint(id, payload) {
  return request(`/tasks/${id}/remove-from-sprint`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export function updateSprint(id, data) {
  return request(`/tasks/sprint/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}


export function updateStatus(id, status) {
  return request(`/tasks/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });
}

export function updatePriority(id, priority) {
  return request(`/tasks/${id}/priority`, {
    method: "PATCH",
    body: JSON.stringify({ priority })
  });
}
