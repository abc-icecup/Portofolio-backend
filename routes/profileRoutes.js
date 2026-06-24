import express from "express";

import verifyToken from "../middleware/authMiddleware.js";

import uploadProfile from "../middleware/uploadProfile.js";

import {
  getProfile,
  updateProfile,
} from "../controllers/profileController.js";

const router = express.Router();


// GET PROFILE
router.get(
  "/",
  verifyToken,
  getProfile
);


// UPDATE PROFILE
router.put(
  "/",
  verifyToken,
  uploadProfile.single("profile_image"),
  updateProfile
);

export default router;