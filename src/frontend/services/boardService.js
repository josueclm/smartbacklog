import { request } from "./api.js";


// =========================
// GET BOARD
// =========================
export function getBoard(sprintId) {

   return request(`/boards/sprint/${sprintId}`);

}


// =========================
// UPDATE TASK STATUS
// =========================
export function updateBoardTaskStatus(taskId, status) {

   return request(`/boards/task/${taskId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
   });

}


// =========================
// REORDER TASKS
// =========================
export function reorderBoardTasks(tasks) {

   return request(`/boards/reorder`, {
      method: "PATCH",
      body: JSON.stringify({ tasks })
   });

}