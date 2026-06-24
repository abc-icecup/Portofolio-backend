import express from "express";

import verifyToken from "../middleware/authMiddleware.js";

import uploadProject from "../middleware/uploadProjects.js";

import {
  addProject,
  getProjects,
  getProjectDetail,
  deleteProject,
  updateProject,
} from "../controllers/projectController.js";

const router = express.Router();

router.get(
  "/",
  verifyToken,
  getProjects
);

router.get(
  "/:id",
  verifyToken,
  getProjectDetail
);

router.post(
  "/",
  verifyToken,
  uploadProject.array(
    "images",
    5
  ),
  addProject
);

router.delete(
  "/:id",
  verifyToken,
  deleteProject
);

router.put(
  "/:id",
  verifyToken,
  uploadProject.array(
    "images",
    5
  ),
  updateProject
);

export default router;