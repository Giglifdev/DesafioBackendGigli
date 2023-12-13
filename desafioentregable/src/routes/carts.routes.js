import { Router } from "express";

import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { handlePolicies } from "../middlewares/auth.js";
import { passportCall } from "../config/passport.config.js";
import {
  addProduct,
  createCart,
  deleteCart,
  deleteProduct,
  getCart,
  updateCart,
  updateProducts,
} from "../controllers/carts.controller.js";

const router = Router();

router
  .get(
    "/:cid",
    passportCall(passportStrategiesEnum.JWT),
    handlePolicies([accessRolesEnum.USER]),
    getCart
  )
  .post(
    "/",
    passportCall(passportStrategiesEnum.JWT),
    handlePolicies([accessRolesEnum.USER]),
    createCart
  )
  .post(
    "/:cid/products/:pid",
    passportCall(passportStrategiesEnum.JWT),
    handlePolicies([accessRolesEnum.USER]),
    addProduct
  )
  .put(
    "/:cid",
    passportCall(passportStrategiesEnum.JWT),
    handlePolicies([accessRolesEnum.USER]),
    updateCart
  )
  .put(
    "/:cid/products/:pid",
    passportCall(passportStrategiesEnum.JWT),
    handlePolicies([accessRolesEnum.USER]),
    updateProducts
  )
  .delete(
    "/:cid/products/:pid",
    passportCall(passportStrategiesEnum.JWT),
    handlePolicies([accessRolesEnum.USER]),
    deleteProduct
  )
  .delete(
    "/:pid",
    passportCall(passportStrategiesEnum.JWT),
    handlePolicies([accessRolesEnum.USER]),
    deleteCart
  );

export default router;
