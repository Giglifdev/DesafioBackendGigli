import CartDto from "../DTOs/cart.dto.js";

export default class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll = async () => {
    const result = await this.dao.getAll();
    return result;
  };

  addCart = async (cart) => {
    const cartToCreate = new CartDto(cart);
    const result = await this.dao.create(cartToCreate);
    return result;
  };

  getById = async (cartId) => {
    const cart = await this.dao.getById(cartId);
    return cart;
  };

  updateCart = async (cartId, products) => {
    const result = await this.dao.update(cartId, products);
    return result;
  };

  updateProductQuantity = async (cartId, productId, newQuantity) => {
    const result = await this.dao.update(cartId, productId, newQuantity);
    return result;
  };

  deleteCart = async (cartId) => {
    const result = this.dao.delete(cartId);
    return result;
  };
}
