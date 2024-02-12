import { validateUser } from "../schemas/users.schema.js";
import { updatePassword as updatePasswordServices } from "../services/sessions.services.js";
import { changeRoleUser as changeRoleUserServices } from "../services/sessions.services.js";

export const getCartByUser = async (req, res) => {
  try {
    const { cart: userCart } = req.user;
    const { _id: cid } = userCart;

    if (cid) return res.send({ status: "success", payload: { _id: cid } });
  } catch (error) {
    req.logger.error(`${error.message}`);
    return res.sendServerError(error.message);
  }
};

export const passwordChange = async (req, res) => {
  try {
    const data = req.body;
    const { password, email } = data;

    const user = await loginServices(email);
    if (!user) {
      req.logger.error(`User with email ${user.email} doesn't exists`);
      return res.sendUnproccesableEntity(
        `User with email ${user.email} doesn't exists`
      );
    }

    const newUser = await updatePasswordServices(email, user, password);
    if (!newUser) {
      req.logger.error(`User with email ${user.email} doesn't exists`);
      return res.sendUnproccesableEntity(`Password cannot be changed`);
    }

    return res.sendSuccess("Password has been changed successfully");
  } catch (error) {
    console.log(error);
    if (error instanceof PasswordIsNotValidError) {
      return res.sendUnproccesableEntity(error.message);
    }
    req.logger.fatal(`${error.message}`);
    return res.sendServerError(error.message);
  }
};

export const changeRoleUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const result = await changeRoleUserServices(uid);

    return res.sendSuccess(result);
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      req.logger.error(`${error.message}`);
      return res.sendClientError(error.message);
    } else {
      req.logger.fatal(`${error.message}`);
      return res.sendServerError(error.message);
    }
  }
};
