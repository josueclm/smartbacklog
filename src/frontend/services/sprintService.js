import { request } from "./api.js";

// SPRINTS

export function getSprints(projectId = null) {
  let url = "/sprints";

  if (projectId) {
    url += `/project/${projectId}`;
  }

  return request(url);
}

export function getSprintById(id) {
  return request(`/sprints/${id}`);
}

export function createSprint(data) {
  return request("/sprints", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateSprint(id, data) {
  return request(`/sprints/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
}

export function deleteSprint(id) {
  return request(`/sprints/${id}`, {
    method: "DELETE"
  });
}

// STATUS

export function startSprint(id) {
  return request(`/sprints/${id}/start`, {
    method: "PATCH"
  });
}

export function completeSprint(id) {
  return request(`/sprints/${id}/complete`, {
    method: "PATCH"
  });
}

export function archiveSprint(id) {
  return request(`/sprints/${id}/archive`, {
    method: "PATCH"
  });
}

// TASKS INSIDE SPRINT

export function getSprintTasks(id) {
  return request(`/sprints/${id}/tasks`);
}

export function addTaskToSprint(sprintId, taskId) {
  return request(`/sprints/${sprintId}/tasks`, {
    method: "POST",
    body: JSON.stringify({ taskId })
  });
}

export function removeTaskFromSprint(sprintId, taskId) {
  return request(`/sprints/${sprintId}/tasks/${taskId}`, {
    method: "DELETE"
  });
}

// METRICS

export function getSprintMetrics(id) {
  return request(`/sprints/${id}/metrics`);
}

export function getSprintVelocity(id) {
  return request(`/sprints/${id}/velocity`);
}

export function getSprintBurndown(id) {
  return request(`/sprints/${id}/burndown`);
}

/*
|--------------------------------------------------------------------------
| GET ACTIVE SPRINT
|--------------------------------------------------------------------------
*/

export function getActiveSprint(projectId = null) {
   let url = "/sprints/active";
   if (projectId) {
      url += `?projectId=${projectId}`;
   }
   return request(url);

}
