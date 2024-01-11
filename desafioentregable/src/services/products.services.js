import ProductsRepository from "../repositories/products.repository.js";
import Products from "../dao/memoryManager/products.manager.js";

const productsDao = new Products();
const productsRepository = new ProductsRepository(productsDao);

const getProducts = async (page, limit, sort, query) => {
  const options = {
    page: page,
    limit: limit,
    sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
  };

  const filter = query ? { category: query, status: true } : { status: true };
  const result = await productsRepository.filterProducts(filter, options);

  return result;
};

const getProductById = async (id) => {
  const product = await productsRepository.getProductById(id);
  return product;
};

const addProduct = async (product) => {
  const result = await productsRepository.addProduct(product);
  return result;
};

const updateProduct = async (id, product) => {
  const result = await productsRepository.updateProduct(id, product);
  return result;
};

const deleteProduct = async (id) => {
  const result = await productsRepository.deleteProduct(id);
  return result;
};

export {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};
