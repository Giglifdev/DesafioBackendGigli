import Router from "./router.js";
import Products from "../dao/memoryManager/products.manager.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  mockingProducts,
} from "../controllers/products.controller.js";

export default class ProductsRouter extends Router {
  constructor() {
    super();
    this.productsManager = new Products();
  }

  init() {
    this.get(
      "/",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.JWT,
      getProducts
    );

    this.get(
      "/:pid",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.JWT,
      getProductById
    );

    this.post(
      "/",
      [accessRolesEnum.ADMIN],
      passportStrategiesEnum.JWT,
      addProduct
    );

    this.put(
      "/:pid",
      [accessRolesEnum.ADMIN],
      passportStrategiesEnum.JWT,
      updateProduct
    );

    this.delete(
      ":/pid",
      [accessRolesEnum.ADMIN],
      passportStrategiesEnum.JWT,
      deleteProduct
    );

    this.get(
      "/mockingproducts",
      [accessRolesEnum.ADMIN],
      passportStrategiesEnum.JWT,
      mockingProducts
    );
  }
}
