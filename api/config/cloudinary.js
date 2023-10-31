import { v2 as cloudinary } from "cloudinary";

const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUND_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
};

export default configureCloudinary;
