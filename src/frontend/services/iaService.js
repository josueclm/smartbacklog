import { request } from "./api.js";


// =========================
// USER STORY
// =========================

export function generateUserStory(data) {

   return request("/ia/user-story", {

      method: "POST",
      
      body: JSON.stringify(data)
   });

}


// =========================
// ACCEPTANCE CRITERIA
// =========================

export function generateAcceptanceCriteria(data) {

   return request("/ia/acceptance-criteria", {

      method: "POST",

      body: JSON.stringify(data)

   });

}


// =========================
// PRIORITY
// =========================

export function generatePriority(data) {

   return request("/ia/priority", {

      method: "POST",

      body: JSON.stringify(data)

   });

}


// =========================
// TASK ANALYSIS
// =========================

export function generateTaskAnalysis(data) {

   return request("/ia/task-analysis", {

      method: "POST",

      body: JSON.stringify(data)

   });

}