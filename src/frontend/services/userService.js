import { request } from "./api.js";


// =========================
// GET ALL USERS
// =========================
export function getUsers() {

  return request("/users");

}


// =========================
// GET USER BY ID
// =========================
export function getUserById(id) {

  return request(`/users/${id}`);

}


// =========================
// CREATE USER
// =========================
export function createUser(data) {

  return request("/users", {
    method: "POST",
    body: JSON.stringify(data)
  });

}


// =========================
// UPDATE USER
// =========================
export function updateUser(id, data) {

  return request(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });

}


// =========================
// DELETE USER
// =========================
export function deleteUser(id) {

  return request(`/users/${id}`, {
    method: "DELETE"
  });

}