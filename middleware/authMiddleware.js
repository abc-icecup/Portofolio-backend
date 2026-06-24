import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // cek apakah token ada
  if (!authHeader) {
    return res.status(401).json({
      message: "Token tidak ditemukan",
    });
  }

  // ambil token setelah kata "Bearer"
  const token = authHeader.split(" ")[1];

  try {
    // verifikasi token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // simpan data user ke request
    req.user = verified;

    next();
    
  } catch (error) {
    res.status(403).json({
      message: "Token tidak valid",
    });
  }
};

export default verifyToken;