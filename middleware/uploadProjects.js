import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = "uploads/projects";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

    filename: (req, file, cb) => {

        const originalName =
            path.parse(file.originalname).name;

        const safeName =
            originalName
            .replace(/\s+/g, "-")
            .replace(/[^a-zA-Z0-9-_]/g, "");

        cb(
            null,
            `${Date.now()}-${safeName}${path.extname(file.originalname)}`
        );
    },
});

const uploadProject = multer({
  storage,

  limits: {
    files: 5,
    fileSize: 5 * 1024 * 1024,
  },
});

export default uploadProject;