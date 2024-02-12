import { Users as UsersDao } from "../dao/factory.js";
import UsersRepository from "../repositories/users.repository.js";
import { createHash } from "../utils.js";
import {
  PasswordIsNotValidError,
  UserNotFoundError,
} from "../utils/custom.exceptions.js";

const usersDao = new UsersDao();
const userRepository = new UsersRepository(usersDao);

export const updatePassword = async (email, user, newPassword) => {
  const { password } = user;
  const isValid = isValidPassowrd(newPassword, password);

  if (!isValid)
    throw new PasswordIsNotValidError(
      "You must use a password different from the previous one"
    );

  const newHashedPassword = createHash(newPassword);
  const result = await userRepository.updatePassword(email, newHashedPassword);

  return result;
};

export const changeRoleUser = async (uid) => {
  let result;
  const user = await userRepository.getById(uid);
  if (!user) throw new UserNotFoundError("User not found, incorrect id");
  if (user.role === "user") {
    result = await userRepository.changeRole(uid, "premium");
  } else if (user.role === "premium") {
    result = await userRepository.changeRole(uid, "user");
  }

  return result;
};
