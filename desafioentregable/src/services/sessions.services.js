import { CartsModel } from "../dao/dbManagers/models/carts.model.js";
import { createHash, isValidPassword, generateToken } from "../utils.js";
import Users from "../dao/dbManagers/users.manager.js";
import UserRepository from "../repositories/user.reposity.js";
import { usersModel } from "../dao/dbManagers/models/users.model.js";

const userDao = new Users();
const userRepository = new UserRepository(userDao);

const Register = async (first_name, last_name, age, role, email, password) => {
  const user = await userRepository.getUserByEmail(email);
  console.log(user);

  if (!user) {
    const cart = await CartsModel.create({ products: [] });
    const userToSave = new usersModel({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      role,
      cart: cart._id,
    });

    await userToSave.save();
    return userToSave;
  }
};

const Login = async (email, password) => {
  const user = await userRepository.getUserByEmail(email);
  if (user || isValidPassword(password, user.password)) {
    const { password: _, ...userResult } = user;
    const accessToken = generateToken(userResult);
    return accessToken;
  }
};

export { Register, Login };
