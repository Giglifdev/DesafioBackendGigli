import { Router } from "express";
import { usersModel } from "../dao/dbManagers/models/users.model.js";
import passport from "passport";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
      return res
        .status(422)
        .send({ status: "error", message: "incomplete values" });
    }

    const exists = await usersModel.findOne({ email });

    if (exists) {
      return res
        .status(400)
        .send({ status: "error", message: "user already exists" });
    }

    await usersModel.create({
      first_name,
      last_name,
      email,
      age,
      password,
    });

    res.status(201).send({ status: "success", message: "user registered" });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await usersModel.findOne({ email, password });

    if (!user) {
      return res
        .status(400)
        .send({ status: "error", message: "incorrect credentials" });
    }

    req.session.user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
    };

    res.send({ status: "success", message: "login success" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error)
      return res.status(500).send({ status: "error", message: error.message });
    res.redirect("/");
  });
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {
    res.send({ status: "success", message: "user registered" });
  }
);

router.get(
  "/github-callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/products");
  }
);

export default router;
