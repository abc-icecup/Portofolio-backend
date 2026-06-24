import multer from "multer";

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/profile");
  },

  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() + "-" + file.originalname;

    cb(null, uniqueName);
  },
});

const uploadProfile = multer({
  storage,
});

export default uploadProfile;