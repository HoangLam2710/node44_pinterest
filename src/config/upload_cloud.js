import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloud = (folder) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      format: async (req, file) => {
        const validImgFormat = ["jpg", "jpeg", "png", "gif", "webp", "heic"];
        const fileFormat = file.mimetype.split("/")[1];

        if (validImgFormat.includes(fileFormat)) {
          return fileFormat;
        }
      },
      public_id: (req, file) => Date.now(),
    },
  });

  return multer({ storage });
};

const removeImageCloud = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};

export { uploadCloud, removeImageCloud };
