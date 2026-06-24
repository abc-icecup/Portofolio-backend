import express from "express";

import verifyToken from "../middleware/authMiddleware.js";

import uploadSkill from "../middleware/uploadSkills.js";

import {

  getSkills,

  addSkill,

  updateSkill,

  deleteSkill,

} from "../controllers/skillsController.js";

const router = express.Router();


// GET ALL
router.get(
  "/",
  verifyToken,
  getSkills
);


// ADD
router.post(
  "/",
  verifyToken,
  uploadSkill.single("icon"),
  addSkill
);


// UPDATE
router.put(
  "/:id",
  verifyToken,
  uploadSkill.single("icon"),
  updateSkill
);


// DELETE
router.delete(
  "/:id",
  verifyToken,
  deleteSkill
);

export default router;