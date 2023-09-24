import express from "express";
import ProductManager from "./manager/ProductManager.js";

const app = express();
const port = 8080;

const productManager = new ProductManager();

app.use(express.json());

app.get("/products", async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : null;
  const products = await productManager.getAll(limit);
  res.json(products);
});

app.get("/products/:pid", (req, res) => {
  const pid = parseInt(req.params.pid);
  const product = productManager.getProductById(pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
