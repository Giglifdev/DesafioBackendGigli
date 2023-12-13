import Carts from "../dao/dbManagers/carts.manager.js";
import Products from "../dao/dbManagers/products.manager.js";

const productsManager = new Products();
const cartsManager = new Carts();

export const getCart = async (cid) => {
  const cart = await cartsManager.getById(cid);
  if (!cart) return { status: "error", message: "Cart not found" };

  return cart;
};
export const createCart = async () => {
  const cart = await cartsManager.create();
  return res.sendSuccess(cart);
};
export const addProduct = async () => {
  try {
    const { cid, pid } = req.params;
    const product = await productsManager.getById(pid);
    if (!product) return res.sendNotFoundError("Product not found");

    const cart = await this.cartsManager.addProduct(cid, pid);
    if (!cart) return res.sendNotFoundError("Cart or product not found");
    return res.sendSuccess(cart);
  } catch (error) {
    return res.sendServerError(error.message);
  }
};
export const updateCart = async (cid, products) => {
  const updatedCart = await cartsManager.updateCart(cid, products);
  if (!updatedCart)
    return { status: "error", error: "Cart or product not found" };
  return updatedCart;
};
export const updateProducts = async () => {
  try {
    const { quantity } = req.body;
    const { cid, pid } = req.params;
    const product = await productsManager.getById(pid);
    if (!product) return res.sendNotFoundError("Product not found");

    const cart = await cartsManager.getById(cid);
    if (!cart) return res.sendNotFoundError("Cart not found");

    if (!quantity) return res.sendUnproccesableEntity("Quantity is required");

    const updatedQuantityCart = await cartsManager.updateQuantityProduct(
      cid,
      pid,
      quantity
    );
    return res.sendSucess(updatedQuantityCart);
  } catch (error) {
    return res.sendServerError(error.message);
  }
};
export const deleteProduct = async () => {
  try {
    const { cid } = req.params;
    const cart = await cartsManager.getById(cid);
    if (!cart) return res.sendNotFoundError("Cart not found");
    const result = await cartsManager.deleteProducts(cid);
    return res.sendSuccess(result);
  } catch (error) {
    if (error.message.toLowerCase().includes("not found"))
      return res.sendNotFoundError(error.message);
    return res.sendServerError(error.message);
  }
};
export const deleteCart = async () => {
  try {
    const { cid } = req.params;
    const cart = await cartsManager.getById(cid);
    if (!cart) return res.sendNotFoundError("Cart not found");
    const result = await cartsManager.deleteProducts(cid);
    return res.sendSuccess(result);
  } catch (error) {
    if (error.message.toLowerCase().includes("not found"))
      return res.sendNotFoundError(error.message);
    return res.sendServerError(error.message);
  }
};
