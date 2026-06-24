import express from "express";

import verifyToken from "../middleware/authMiddleware.js";

import {
  getUsers,
  deleteUser,
  updateUser,
} from "../controllers/usersController.js";

const router = express.Router();


// GET PROFILE
// router.get("/profile", verifyToken, getProfile);

// UPDATE PROFILE
// router.put("/profile", verifyToken, updateProfile);

// GET USERS
router.get("/", verifyToken, getUsers);

// PUT USERS
router.put("/:id", verifyToken, updateUser);

// DELETE USER
router.delete("/:id", verifyToken, deleteUser);



export default router;