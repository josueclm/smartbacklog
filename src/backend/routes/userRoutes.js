const express = require("express");

const router = express.Router();

const userController =
  require("../controllers/userController");


// =========================
// GET ALL
// =========================
router.get(
  "/",
  userController.getUsers
);


// =========================
// GET BY ID
// =========================
router.get(
  "/:id",
  userController.getUserById
);


// =========================
// CREATE
// =========================
router.post(
  "/",
  userController.createUser
);


// =========================
// UPDATE
// =========================
router.put(
  "/:id",
  userController.updateUser
);


// =========================
// DELETE
// =========================
router.delete(
  "/:id",
  userController.deleteUser
);


module.exports = router;