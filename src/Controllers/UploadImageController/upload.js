import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // thư mục lưu trữ file
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    ); // đổi tên file để tránh trùng lặp
  },
});

const fileFilter = function (req, file, cb) {
  // Kiểm tra phần mở rộng của file
  const allowedExtensions = [".jpg", ".png"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true); // Cho phép upload file có đuôi .jpg hoặc .png
  } else {
    cb(new Error("Only jpg and png files are allowed!"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

export default upload;
