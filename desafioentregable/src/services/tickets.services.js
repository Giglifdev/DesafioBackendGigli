import CartsManager from "../dao/dbManagers/carts.manager.js";
import CartRepository from "../repositories/carts.repository.js";
import ProductsManager from "../dao/dbManagers/products.manager.js";
import ProductRepository from "../repositories/products.repository.js";
import { ticketModel } from "../dao/dbManagers/models/tickets.model.js";

const cartDao = new CartsManager();
const cartRepository = new CartRepository(cartDao);

const productDao = new ProductsManager();
const productRepository = new ProductRepository(productDao);

const processPurchase = async (cartId, user) => {
  const unavailableProducts = [];
  const availableProducts = [];
  const cart = await cartRepository.getCartById(cartId);

  for (const cartProduct of cart.products) {
    const productId = cartProduct.product;
    const productInfo = await productRepository.getProductById(productId);

    if (productInfo && productInfo.stock >= cartProduct.quantity) {
      await productRepository.updateProduct(productId, {
        stock: productInfo.stock - cartProduct.quantity,
      });

      const productToAdd = {
        ...cartProduct.toObject(),
        price: productInfo.price,
      };

      availableProducts.push(productToAdd);
    } else {
      unavailableProducts.push(productId);
    }
  }

  const generateTicketCode = () =>
    Date.now() + Math.floor(Math.random() * 100000 + 1);

  const calculateTotalAmount = (products) => {
    return products.reduce((total, product) => {
      const price = product.price || 0;
      const quantity = Number(product.quantity) || 0;
      const productAmount = price * quantity;
      return total + productAmount;
    }, 0);
  };

  const updatedProducts = cart.products.filter(
    (product) =>
      !availableProducts.some(
        (pd) => pd.product === product.product || pd.product === undefined
      )
  );

  if (availableProducts.length > 0) {
    await cartRepository.updateCart(cart._id, { products: updatedProducts });
  }

  const totalAmount = calculateTotalAmount(availableProducts);

  if (availableProducts.length > 0) {
    const ticketData = {
      code: generateTicketCode(),
      amount: totalAmount,
      purchaser: user.email,
    };

    const ticket = await ticketModel.create(ticketData);

    return { ticket };
  }

  return { unavailableProducts };
};

export { processPurchase };
