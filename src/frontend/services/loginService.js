import { request } from "./api.js";


// =========================
// LOGIN
// =========================

export function login(data) {

   return request("/login", {

      method: "POST",

      body: JSON.stringify(data)

   });

}