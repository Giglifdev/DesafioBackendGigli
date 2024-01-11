import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PRIVATE_KEY_JWT } from "./config/constants.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const authorization = (role) => {
  return async (req, res, next) => {
    if (req.user.role !== role)
      return res
        .status(403)
        .send({ status: "error", message: "not permissions" });
    next();
  };
};

const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (plainPassword, hashedPassword) =>
  bcrypt.compareSync(plainPassword, hashedPassword);

const generateToken = (user) => {
  const token = jwt.sign({ user }, PRIVATE_KEY_JWT, { expiresIn: "24h" });
  return token;
};

const generateProduct = () => {
  return {
    title: faker.commerce.productName(),
    price: faker.commerce.price(),
    department: faker.commerce.department(),
    stock: faker.number.int(1),
    id: faker.database.mongodbObjectId(),
    image: faker.image.url(),
    code: faker.string.alphanumeric(10),
    description: faker.commerce.productDescription(),
  };
};

export {
  authorization,
  __dirname,
  createHash,
  isValidPassword,
  generateToken,
  generateProduct,
};
