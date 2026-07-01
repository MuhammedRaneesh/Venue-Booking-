import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/Cloudinary.js";

const createUploader = (folder: string) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async () => ({
      folder,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    }),
  });

  return multer({
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });
};

export const uploadAvatar = createUploader("bookmyvenue/avatars");

export const uploadVenueImages = createUploader("bookmyvenue/venues");