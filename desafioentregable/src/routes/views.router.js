import Router from "./router.js";
import Products from "../dao/dbManagers/products.manager.js";
import Carts from "../dao/dbManagers/carts.manager.js";
import {
  renderProducts,
  renderDetails,
  renderCart,
  addToCart,
  Login,
  Register,
} from "../controllers/views.controller.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";

export default class ViewsRouter extends Router {
  constructor() {
    super();
    this.productsManager = new Products();
    this.cartsManager = new Carts();
  }

  init() {
    this.get(
      "/register",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      Register
    );

    this.get(
      "/login",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      Login
    );

    this.get(
      "/products",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      renderProducts
    );

    this.get(
      "/products/:productId",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      renderDetails
    );

    this.get(
      "/carts/:cid",
      [accessRolesEnum.USER],
      passportStrategiesEnum.NOTHING,
      renderCart
    );

    this.post(
      "/carts/:cartId/products/:productId",
      [accessRolesEnum.USER],
      passportStrategiesEnum.NOTHING,
      addToCart
    );
  }
}
