import { request } from "./api.js";

export function getTasks() {
  return request("/tasks");
}

export function createTask(data) {
  return request("/tasks", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function deleteTask(id) {
  return request(`/tasks/${id}`, {
    method: "DELETE"
  });
}