import mongoose from "mongoose";
import Carts from "../dao/memoryManager/carts.manager.js";
import CartRepository from "../repositories/carts.repository.js";

const cartsDao = new Carts();
const cartRepository = new CartRepository(cartsDao);

const addCart = async (cart) => {
  const result = cartRepository.addCart(cart);
  return result;
};

const getCartById = async (cid) => {
  const cart = await cartRepository
    .getById(cid)
    .populate("products.product")
    .exec();
  if (!cart) throw new Error("Cart not found.");
  return cart;
};

const addProduct = async (idCart, idProd) => {
  const cart = await cartsManager.getById(idCart);

  if (!cart) throw new Error("Cart not found.");
  if ((await cartRepository.existProduct(idProd)) === false)
    throw new Error("Product not found.");
  if ((await cartRepository.isInStock(idProd)) === false)
    throw new Error("Product whitout stock");

  const productIndex = cart.products.findIndex(
    (p) => p.product.toString() === idProd
  );

  if (productIndex === -1) {
    cart.products.push({ product: idProd, quantity: 1 });
  } else {
    cart.products[productIndex].quantity++;
  }

  const updateCart = await cartRepository.updateCart(idCart, cart.products);
  return updateCart;
};

const deleteProduct = async (idCart, idProd) => {
  if ((await cartsManager.existCart(idCart)) === false)
    throw new Error("Cart not found.");
  const result = await cartRepository.deleteProduct(idCart, idProd);
  return result;
};

const deleteAllProducts = async (idCart) => {
  if ((await cartsManager.existCart(idCart)) === false)
    throw new Error("Cart not found.");
  const deleteProducts = await cartRepository.deleteAllProducts(idCart);
  return deleteProducts;
};

const updateAllProducts = async (idCart, newProducts) => {
  if ((await cartsManager.existCart(idCart)) === false)
    throw new Error("Cart not found.");
  const updatedCart = await cartRepository.updateCart(idCart, {
    products: newProducts,
  });
  return updatedCart;
};

const updateQuantity = async (idCart, idProduct, newQuantity) => {
  const updatedCart = await cartRepository.updateProductQuantity(
    idCart,
    idProduct,
    newQuantity
  );
  return updatedCart;
};

export {
  addCart,
  getCartById,
  addProduct,
  deleteProduct,
  deleteAllProducts,
  updateAllProducts,
  updateQuantity,
};
