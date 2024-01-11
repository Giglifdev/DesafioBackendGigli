import ProductDto from "../DTOs/product.dto.js";

export default class ProductsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getProducts = async () => {
    const carts = await this.dao.getAll();
    return carts;
  };

  addProduct = async (product) => {
    const ProductToCreate = new ProductDto(product);
    const result = await this.dao.save(ProductToCreate);
    return result;
  };

  getProductById = async (productId) => {
    const cart = await this.dao.getById(productId);
    return cart;
  };

  updateProduct = async (id, updatedFields) => {
    const result = await this.dao.update(id, updatedFields);
    return result;
  };

  deleteProduct = async (productId) => {
    const result = await this.dao.delete(productId);
    return result;
  };
}
