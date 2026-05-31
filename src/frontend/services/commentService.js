import { request } from "./api.js";


// =========================
// GET COMMENTS
// =========================

export function getCommentsByTask(
   taskId
) {

   return request(
      `/comments/task/${taskId}`
   );

}


// =========================
// CREATE COMMENT
// =========================

export function createComment(data) {

   return request("/comments", {

      method: "POST",

      body: JSON.stringify(data)

   });

}


// =========================
// UPDATE COMMENT
// =========================

export function updateComment(
   id,
   data
) {

   return request(`/comments/${id}`, {

      method: "PUT",

      body: JSON.stringify(data)

   });

}


// =========================
// DELETE COMMENT
// =========================

export function deleteComment(id) {

   return request(`/comments/${id}`, {

      method: "DELETE"

   });

}