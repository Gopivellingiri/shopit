import express from "express";
const router = express.Router();
import {
  allOrders,
  deleteOrder,
  getOrderDetails,
  getSales,
  myOrders,
  newOrder,
  updateOrder,
} from "../controllers/orderController.js";
import { authorizedRoles, isAuthenticatedUser } from "../middlewares/auth.js";

router.route("/orders/new").post(isAuthenticatedUser, newOrder);
router.route("/orders/:id").get(isAuthenticatedUser, getOrderDetails);
router.route("/me/orders").get(isAuthenticatedUser, myOrders);

router
  .route("/admin/get_sales")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getSales);

router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizedRoles("admin"), allOrders);

router
  .route("/admin/orders/:id")
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteOrder);
export default router;
