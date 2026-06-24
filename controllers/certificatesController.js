import fs from "fs";
import Certificate from "../models/certificates.js";

export const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.findAll({
      where: {
        user_id: req.user.id,
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(certificates);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ADD CERTIFICATE
export const addCertificate = async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        message: "Gambar wajib diupload",
      });
    }

    const certificate =
      await Certificate.create({
        user_id: req.user.id,
        image: req.file.path,
      });

    res.status(201).json({
      message: "Certificate berhasil ditambahkan",
      certificate,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

export const deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByPk(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        message: "Certificate tidak ditemukan",
      });
    }

    if (certificate.user_id !== req.user.id) {
      return res.status(403).json({
        message: "Akses ditolak",
      });
    }

    if (
      certificate.image &&
      fs.existsSync(certificate.image)
    ) {
      fs.unlinkSync(certificate.image);
    }

    await certificate.destroy();

    res.status(200).json({
      message: "Certificate berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};