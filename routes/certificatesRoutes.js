import express from "express";

import verifyToken from "../middleware/authMiddleware.js";

import uploadCertificate from "../middleware/uploadCertificates.js";

import {
  getCertificates,
  addCertificate,
  deleteCertificate,
} from "../controllers/certificatesController.js";

const router = express.Router();


// GET CERTIFICATES
router.get( "/", verifyToken, getCertificates );

// ADD CERTIFICATE
router.post( "/", verifyToken, uploadCertificate.single("image"), addCertificate );

// DELETE CERTIFICATE
router.delete( "/:id", verifyToken, deleteCertificate );

export default router;