import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif",".jfif"];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error("Only images are allowed"), false);
};

export default multer({ storage, fileFilter });
