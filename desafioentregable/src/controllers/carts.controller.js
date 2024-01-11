import {
  addCart as addCartService,
  getCartById as getCartByIdService,
  addProduct as addProductService,
  deleteProduct as deleteProductService,
  deleteAllProducts as deleteAllProductsService,
  updateAllProducts as updateAllProductsService,
  updateQuantity as updateQuantityService,
} from "../services/carts.services.js";

const addCart = async (req, res) => {
  try {
    const newCart = await addCartService({});
    res.status(201).send({ status: "success", payload: newCart });
  } catch (error) {
    res.status(500).send({ status: "error", payload: error.message });
  }
};

const getCartById = async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await getCartByIdService(cid);
    res.status(200).send({ status: "success", payload: cart.products });
  } catch (error) {
    res.status(500).send({ status: "error", payload: error.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const idCart = req.params.cid;
    const idProd = req.params.pid;

    const result = addProductService(idCart, idProd);
    res.status(200).send({ status: "success", payload: result });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const idCart = req.params.cid;
    const idProd = req.params.pid;

    const result = await deleteProductService(idCart, idProd);

    res.status(200).send({ status: "success", payload: result });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const deleteAllProducts = async (req, res) => {
  try {
    const idCart = req.params.cid;
    const deletedProducts = await deleteAllProductsService(idCart);

    res.status(200).send({ status: "success", payload: deletedProducts });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const updateAllProducts = async (req, res) => {
  try {
    const idCart = req.params.cid;
    const newProducts = req.body.products;
    const updatedCart = await updateAllProductsService(idCart, newProducts);

    res.status(200).send({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(400).send({ status: "error", payload: error.message });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const idCart = req.params.cid;
    const idProduct = req.params.pid;
    const newQuantity = req.body.quantity;

    const updatedCart = await updateQuantityService(
      idCart,
      idProduct,
      newQuantity
    );

    res.status(200).send({ status: "success", payload: updatedCart });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
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
