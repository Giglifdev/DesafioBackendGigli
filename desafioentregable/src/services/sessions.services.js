import Users from "../dao/dbManagers/users.manager.js";
import { createHash, isValidPassowrd } from "../utils.js";

const usersManager = new Users();

export const login = async (email, password) => {
  const user = await usersManager.getByEmail(email);
  if (!user) return { status: "error", error: "incorrect credentials" };
  const comparePassword = isValidPassowrd(password, user.password);
  if (!comparePassword)
    return { status: "error", error: "incorrect credentials" };
  delete user.password;
  delete user["_id"];

  return user;
};

export const register = async (user) => {
  const existsUser = await usersManager.getByEmail(user.email);
  if (existsUser) return { status: "error", error: "user already exists" };

  const hashedPassword = createHash(user.password);
  const newUser = { ...user };
  newUser.password = hashedPassword;
  const result = await usersManager.create(newUser);
  return result;
};

export const logout = async (req, res) => {
  const result = usersManager.deleteCartFromUser(req.user.email);
  return result;
};

export const github = async (req, res) => {};

export const githubCallback = async (req, res) => {};
