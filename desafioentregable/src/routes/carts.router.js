import Router from "./router.js";
import Carts from "../dao/memoryManager/carts.manager.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import {
  addCart,
  getCartById,
  addProduct,
  deleteProduct,
  deleteAllProducts,
  updateAllProducts,
  updateQuantity,
} from "../controllers/carts.controller.js";
import { processPurchase } from "../controllers/tickets.controller.js";

export default class CartsRouter extends Router {
  constructor() {
    super();
    this.cartManager = new Carts();
  }

  init() {
    this.post("/", [accessRolesEnum.USER], passportStrategiesEnum.JWT, addCart);

    this.get(
      "/:cid",
      [accessRolesEnum.USER],
      passportStrategiesEnum.JWT,
      getCartById
    );

    this.post(
      "/:cid/product/:pid",
      [accessRolesEnum.USER],
      passportStrategiesEnum.JWT,
      addProduct
    );

    this.delete(
      "/:cid/products/:pid",
      [accessRolesEnum.USER],
      passportStrategiesEnum.JWT,
      deleteProduct
    );

    this.put(
      "/:cid",
      [accessRolesEnum.USER],
      passportStrategiesEnum.JWT,
      updateAllProducts
    );

    this.put(
      "/:cid/products/:pid",
      [accessRolesEnum.USER],
      passportStrategiesEnum.JWT,
      updateQuantity
    );

    this.delete(
      "/:cid",
      [accessRolesEnum.USER],
      passportStrategiesEnum.JWT,
      deleteAllProducts
    );

    this.post(
      "/:cid/purchase",
      [accessRolesEnum.USER],
      passportStrategiesEnum.JWT,
      processPurchase
    );
  }
}
