import { productsModel } from "../dbManagers/models/products.model.js";

export default class Products {
  constructor() {
    console.log("Products database operations are ready.");
  }

  filterProducts = async (filter, options) => {
    const result = await ProductsModel.paginate(filter, options);
    return result;
  };

  getProducts = async () => {
    const products = await ProductsModel.find();
    return products;
  };

  existProduct = async (prodId) => {
    const product = await ProductsModel.findById(prodId);
    return !!product;
  };

  isInStock = async (prodId) => {
    const product = await ProductsModel.findById(prod);
    if (product.stock === 0) return false;
    return true;
  };

  addProduct = async (product) => {
    const result = await ProductsModel.create(product);
    return result;
  };

  getProductById = async (id) => {
    const result = await ProductsModel.findById(id);
    return result;
  };

  updateProduct = async (id, product) => {
    const result = await ProductsModel.updateOne({ _id: id }, product, {
      new: true,
    });
    return result;
  };

  deleteProduct = async (id) => {
    const result = await ProductsModel.deleteOne({ _id: id });
    return result;
  };
}
