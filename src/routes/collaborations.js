const express = require("express");
const router = express.Router();

const {
  addCollaborations,
  deleteCollaborations,
} = require("../controllers/Collaborations/CollaborationController");

const { isLoggin, customRoles } = require("../middlewares/user");

router
  .route("/collaborations")
  .post(isLoggin, customRoles("user", "admin"), addCollaborations)
  .delete(isLoggin, customRoles("user", "admin"), deleteCollaborations);

module.exports = router;
