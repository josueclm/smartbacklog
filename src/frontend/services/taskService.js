import { request } from "./api.js";

export function getTasks1() {
  return request("/tasks");
}

export function createTask1(data) {
  return request("/tasks", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function deleteTask1(id) {
  return request(`/tasks/${id}`, {
    method: "DELETE"
  });
}




const API = "http://localhost:3000/api/tasks";

export async function getBacklogTasks(projectId) {
  const res = await fetch(`${API}/backlog?projectId=${projectId}`);
  return res.json();
}

export async function createTask(data) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  return res.json();
}

export async function deleteTask(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
}

export async function updateTask(id, data) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  return res.json();
}

export async function updateStatus(id, status) {
  const res = await fetch(`${API}/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });

  return res.json();
}

export async function updatePriority(id, priority) {
  const res = await fetch(`${API}/${id}/priority`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priority })
  });

  return res.json();
}