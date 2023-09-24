import fs from "fs/promises";
import { fileURLToPath, pathToFileURL } from "url";
import path from "path";

class ProductManager {
  constructor() {
    this.products = [];

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    this.filePath = path.join(__dirname, "..", "products", "products.json");
    this.loadProductsFromFile();
  }

  async loadProductsFromFile() {
    try {
      const data = await fs.readFile(this.filePath, "utf8");
      this.products = JSON.parse(data);
    } catch (error) {
      console.error("error:", error);
      this.products = [];
    }
  }

  async getAll(limit) {
    await this.loadProductsFromFile();
    if (limit) {
      return this.products.slice(0, limit);
    } else {
      return this.products;
    }
  }

  getProductById(id) {
    return this.products.find((product) => product.id === id);
  }
}

export default ProductManager;
