import { Router } from "express";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { handlePolicies } from "../middlewares/auth.js";
import { passportCall } from "../config/passport.config.js";
import { generateCustomResponse } from "../middlewares/responses.js";

import {
  getCartByUser,
  passwordChange,
  changeRoleUser,
} from "../controllers/users.controller.js";

const router = Router();

router
  .get(
    "/user-cart",
    passportCall(passportStrategiesEnum.JWT),
    handlePolicies([accessRolesEnum.USER]),
    generateCustomResponse,
    getCartByUser
  )
  .put(
    "/password-change",
    passportCall(passportStrategiesEnum.NOTHING),
    handlePolicies([accessRolesEnum.PUBLIC]),
    generateCustomResponse,
    passwordChange
  )
  .put(
    "/premium/:uid",
    passportCall(passportStrategiesEnum.JWT),
    handlePolicies([
      accessRolesEnum.USER,
      accessRolesEnum.PREMIUM,
      accessRolesEnum.ADMIN,
    ]),
    generateCustomResponse,
    changeRoleUser
  );

export default router;
