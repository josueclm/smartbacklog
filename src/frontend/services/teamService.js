// services/teamService.js

import { request } from "./api.js";

export function getTeams() {

   return request("/teams");

}