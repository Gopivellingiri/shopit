import multer from "multer";
import express from "express";

import {
  loginUser,
  registerUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updatePassword,
  updateProfile,
  allUsers,
  getUserDetails,
  updateUser,
  deleteUser,
  uploadAvatar,
} from "../controllers/authController.js";
import { authorizedRoles, isAuthenticatedUser } from "../middlewares/auth.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

//
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);

router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get(isAuthenticatedUser, getUserProfile);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router
  .route("/me/upload_avatar")
  .put(isAuthenticatedUser, upload.single("avatar"), uploadAvatar);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizedRoles("admin"), allUsers);
router
  .route("/admin/users/:id")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getUserDetails)
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateUser)
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteUser);

export default router;
