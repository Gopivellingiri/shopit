import catchAsyncError from "../middlewares/catchAsyncError.js";
import User from "../models/user.js";
import { getResetPasswordTemplate } from "../utils/emailTemplate.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendEmail from "../utils/sendEmail.js";
import sendToken from "../utils/sendToken.js";
import crypto from "crypto";
import { upload_file, delete_file } from "../utils/cloudinary.js";

// Register user => /api/v1/register
export const registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  sendToken(user, 201, res);
});

// Login user => /api/v1/login
export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }
  // Find user in the database
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  // Check if password is correct
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  sendToken(user, 200, res); // Changed status code to 200
});

// Logout user => /api/v1/logout
export const logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    message: "Logged Out",
  });
});

export const uploadAvatar = catchAsyncError(async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ErrorHandler("No file uploaded", 400));
    }

    console.log("File received:", req.file);

    // Upload the file to Cloudinary
    const avatarResponse = await upload_file(req.file.buffer, "shopit/avatars");

    // Delete the old avatar if it exists
    if (req.user.avatar?.url) {
      await delete_file(req.user.avatar.public_id);
    }

    // Update user with the new avatar
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarResponse },
      { new: true }
    );

    res.status(200).json({ user });
  } catch (error) {
    return next(
      new ErrorHandler("Avatar upload failed. Please try again.", 500)
    );
  }
});

// Forgot password => /api/v1/password/forgot
export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }
  const resetToken = await user.getResetPasswordToken();
  await user.save();
  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const message = getResetPasswordTemplate(user.name, resetUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: "shopIt Password Recovery",
      message,
    });
    res.status(200).json({
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset password => /api/v1/password/forgot/:token
export const resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Password reset token is invalid or has expired", 400)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user, 200, res); // Changed status code to 200
});

//get current user Profile => /api/v1/me
export const getUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req?.user?._id);
  res.status(200).json({
    user,
  });
});

//update Password => /api/v1/password/update
export const updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req?.user?._id).select("+password");

  //Chek the previous user password
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is incorrect", 400));
  }
  user.password = req.body.password;
  user.save();

  res.status(200).json({
    success: true,
  });
});

//update user profile => /api/v1/me/update
export const updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
  });
  res.status(200).json({
    user,
  });
});

//get all users - admin => /api/v1/admin/users
export const allUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    users,
  });
});

//get user details - admin => /api/v1/admin/users/:id
export const getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    user,
  });
});

//update updateUser -admin => /api/v1/admin/users/:id
export const updateUser = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
  });
  res.status(200).json({
    user,
  });
});

//delete user - admin => /api/v1/admin/users/:id
export const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id}`, 404)
    );
  }
  //todo - remove user avatar from cloudinary

  if (user?.avatar?.public_id) {
    await delete_file(user?.avatar?.public_id);
  }

  await user.deleteOne();
  res.status(200).json({
    success: true,
  });
});
