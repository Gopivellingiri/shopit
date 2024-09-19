import express from "express";
import {
  canUserReview,
  createProductReview,
  deleteProduct,
  deleteProductImage,
  deleteReview,
  getAdminProducts,
  getProductDetails,
  getProductReviews,
  getProducts,
  newProduct,
  updateProduct,
  uploadProductImages,
} from "../controllers/productController.js";
import { authorizedRoles, isAuthenticatedUser } from "../middlewares/auth.js";
const router = express.Router();

router.route("/products").get(getProducts);
router
  .route("/admin/products")
  .post(isAuthenticatedUser, authorizedRoles("admin"), newProduct)
  .get(isAuthenticatedUser, authorizedRoles("admin"), getAdminProducts);

router.route("/products/:id").get(getProductDetails);

router
  .route("/admin/products/:id/upload_images")
  .put(isAuthenticatedUser, authorizedRoles("admin"), uploadProductImages);

router
  .route("/admin/products/:id/delete_image")
  .put(isAuthenticatedUser, authorizedRoles("admin"), deleteProductImage);

router
  .route("/admin/products/:id")
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateProduct);
router
  .route("/admin/products/:id")
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteProduct);

router
  .route("/reviews")
  .get(isAuthenticatedUser, getProductReviews)
  .put(isAuthenticatedUser, createProductReview);

router
  .route("/admin/reviews")
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteReview);

router.route("/can_review").get(isAuthenticatedUser, canUserReview);

export default router;
