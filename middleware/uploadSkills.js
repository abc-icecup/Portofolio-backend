import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    const userFolder = path.join(
      "uploads",
      "skills",
      `user-${req.user.id}`
    );

    if (!fs.existsSync(userFolder)) {

      fs.mkdirSync(userFolder, {
        recursive: true,
      });
    }

    cb(null, userFolder);
  },

  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() +
      "-" +
      file.originalname;

    cb(null, uniqueName);
  },
});

const uploadSkill = multer({
  storage,
});

export default uploadSkill;