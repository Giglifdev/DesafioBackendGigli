const fs = require("fs");

class ProductManager {
  constructor() {
    this.products = [];
    this.loadProductsFromFile();
  }

  getProducts = () => {
    return this.products;
  };

  getProductById = (id) => {
    const productById = this.products.find((product) => product.id === id);

    if (!productById) {
      throw new Error("Product not found");
    }

    return productById;
  };

  addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error("All fields are required.");
    }

    const codeExists = this.products.some((product) => product.code === code);

    if (codeExists) {
      throw new Error("Product with the same code already exists");
    }

    const product = {
      id: this.generateUniqueId(),
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(product);
    this.saveProductsToFile();
  }

  updateProduct(id, updatedFields) {
    const productToUpdate = this.getProductById(id);

    if (!productToUpdate) {
      throw new Error("Product not found");
    }

    delete updatedFields.id;

    Object.assign(productToUpdate, updatedFields);
    this.saveProductsToFile();
  }

  deleteProduct(id) {
    const indexToDelete = this.products.findIndex(
      (product) => product.id === id
    );

    if (indexToDelete === -1) {
      throw new Error("Product not found");
    }

    this.products.splice(indexToDelete, 1);
    this.saveProductsToFile();
  }

  generateUniqueId() {
    if (this.products.length === 0) {
      return 1;
    } else {
      const ids = this.products.map((product) => product.id);
      return Math.max(...ids) + 1;
    }
  }

  loadProductsFromFile() {
    try {
      const data = fs.readFileSync("products.json", "utf8");
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = [];
      this.saveProductsToFile();
    }
  }

  saveProductsToFile() {
    const data = JSON.stringify(this.products, null, 2);
    fs.writeFileSync("products.json", data);
  }
}

const manager = new ProductManager();

console.log(manager.getProducts());

try {
  manager.addProduct(
    "product test",
    "This is a test product",
    200,
    "no image",
    "abc123",
    25
  );
  console.log("Product successfully added");
} catch (error) {
  console.error(error.message);
}

console.log(manager.getProducts());

try {
  const foundProduct = manager.getProductById(1);
  console.log("Product found:", foundProduct);
} catch (error) {
  console.error(error.message);
}

try {
  manager.updateProduct(1, { price: 250, stock: 30 });
  console.log("Product updated");
} catch (error) {
  console.error(error.message);
}

try {
  manager.deleteProduct(1);
  console.log("Product deleted");
} catch (error) {
  console.error(error.message);
}
