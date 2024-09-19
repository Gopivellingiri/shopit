import cloudinary from "cloudinary";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: "backend/config/config.env" });

// Configure Cloudinary with credentials
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload a file to Cloudinary
export const upload_file = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      {
        resource_type: "auto", // Automatically detect the file type
        folder: folder, // Specify the folder where the file should be uploaded
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error); // Reject the promise with the error
        }
        resolve({
          public_id: result.public_id, // Cloudinary file identifier
          url: result.secure_url, // Secure URL of the uploaded file
        });
      }
    );

    // End the stream with the file buffer
    stream.end(fileBuffer);
  });
};

// Function to delete a file from Cloudinary
export const delete_file = async (file) => {
  try {
    const res = await cloudinary.v2.uploader.destroy(file);
    if (res?.result === "ok") {
      return true; // Return true if deletion is successful
    }
    return false; // Return false if deletion is unsuccessful
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    return false; // Handle errors and return false
  }
};
