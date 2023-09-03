class ProductManager {
  constructor() {
    this.products = [];
  }

  generateUniqueId() {
    return Date.now().toString();
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error("All fields are required.");
      return;
    }

    const existingProduct = this.products.find(
      (product) => product.code === code
    );
    if (existingProduct) {
      console.error(
        "The code already exists. Duplicate products cannot be added."
      );
      return;
    }

    const id = this.generateUniqueId();

    const product = {
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(product);

    console.log("Product added successfully.");
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);

    if (!product) {
      console.error("product not found.");
      return null;
    }

    return product;
  }
}

const productManager = new ProductManager();
console.log(productManager.getProducts());

productManager.addProduct(
  "test product",
  "This is a test product",
  200,
  "no image",
  "abc123",
  25
);
console.log(productManager.getProducts());

productManager.addProduct(
  "another product",
  "This is another product",
  150,
  "another image",
  "abc123",
  10
);

const product = productManager.getProductById(1);
console.log(product);

productManager.getProductById(99);
