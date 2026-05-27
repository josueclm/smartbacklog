const express =
   require("express");

const router =
   express.Router();

const controller =
   require("../controllers/commentController");


// =========================
// GET TASK COMMENTS
// =========================

router.get(
   "/task/:taskId",
   controller.getByTask
);


// =========================
// CREATE COMMENT
// =========================

router.post(
   "/",
   controller.create
);


// =========================
// UPDATE COMMENT
// =========================

router.put(
   "/:id",
   controller.update
);


// =========================
// DELETE COMMENT
// =========================

router.delete(
   "/:id",
   controller.delete
);


module.exports =
   router;