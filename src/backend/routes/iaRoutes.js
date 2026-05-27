const express =
   require("express");

const router =
   express.Router();

const controller =
   require("../controllers/iaController");


// =========================
// USER STORY
// =========================

router.post(
   "/user-story",
   controller.generateUserStory
);


// =========================
// ACCEPTANCE CRITERIA
// =========================

router.post(
   "/acceptance-criteria",
   controller.generateAcceptanceCriteria
);


// =========================
// PRIORITY
// =========================

router.post(
   "/priority",
   controller.generatePriority
);


// =========================
// TASK ANALYSIS
// =========================
router.post(
    "/task-analysis",
    controller.generateTaskAnalysis
);

module.exports =
   router;