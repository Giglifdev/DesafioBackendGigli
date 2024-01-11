import { productsModel } from "../dao/dbManagers/models/products.model.js";
import Products from "../dao/dbManagers/products.manager.js";
import Carts from "../dao/dbManagers/carts.manager.js";

const products = new Products();
const carts = new Carts();

const Register = async (req, res) => {
  res.render("register");
};

const Login = async (req, res) => {
  res.render("login");
};

const renderProducts = async (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  try {
    const options = {
      page: page,
      limit: limit,
      lean: true,
      leanWithId: false,
    };

    const result = await productsModel.paginate({}, options);

    console.log("User Data:", req.session.user);

    res.render("products", {
      user: req.session.user,
      products: result.docs,
      page: result.page,
      totalPages: result.totalPages,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      limit: result.limit,
    });
  } catch (error) {
    res.status(500).render("error", { message: "Error loading product list." });
  }
};

const renderDetails = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await products.getProductById(productId);
    if (!product) {
      return res.status(404).render("error", { message: "Product not found." });
    }

    const productObject = product.toObject();

    res.render("productDetails", { product: productObject });
  } catch (error) {
    res.status(500).render("error", {
      message: "Error retrieving product details.",
    });
  }
};

const renderCart = async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await carts.getById(cartId).populate("products.product");

    if (!cart) {
      return res.status(404).render("error", { message: "Cart not found." });
    }

    const productsWithSubtotals = cart.products.map((item) => {
      return {
        ...item.toObject(),
        subtotal: item.quantity * item.product.price,
      };
    });

    res.render("carts", { products: productsWithSubtotals });
  } catch (error) {
    res.status(500).render("error", { message: "Error loading cart." });
  }
};

const addToCart = async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;

    const cart = await carts.getById(cartId);

    if (!cart) {
      return res.status(404).send("Cart not found");
    }

    const product = await products.getProductById(productId);

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex === -1) {
      await carts.updateCart(cartId, product);
    } else {
      await carts.updateProductQuantity(cartId, productId, quantity);
    }

    res
      .status(200)
      .send({ message: "Product added to cart", cartId: cart._id });
  } catch (error) {
    res.status(500).send("Error when adding product to cart.");
  }
};

export {
  renderDetails,
  renderProducts,
  renderCart,
  addToCart,
  Register,
  Login,
};
