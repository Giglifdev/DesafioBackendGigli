import express from "express";
import handlebars from "express-handlebars";
import { initializePassport } from "./config/passport.config.js";
import { __dirname } from "./utils.js";
import passport from "passport";
import sessionsRouter from "./routes/sessions.router.js";
import ProductsRouter from "./routes/products.router.js";
import CartsRouter from "./routes/carts.router.js";
import ViewsRouter from "./routes/views.router.js";
import session from "express-session";
import currentRouter from "./routes/current.router.js";
import errorHandler from "./middlewares/errors/index.js";

const app = express();

const viewsRouter = new ViewsRouter();

const productsRouter = new ProductsRouter();
const cartsRouter = new CartsRouter();

viewsRouter.init();

cartsRouter.init();
productsRouter.init();

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use("/api/sessions", sessionsRouter);

app.use("/", viewsRouter.getRouter());
app.use("/api/products", productsRouter.getRouter());
app.use("/api/carts", cartsRouter.getRouter());
app.use("/current", currentRouter);

app.use(errorHandler);

app.use((err, req, res, next) => {
  if (err && err.error && err.error.isJoi) {
    res.status(422).json({
      type: err.type,
      message: err.error.toString(),
    });
  } else {
    next(err);
  }
});

app.listen(8090, () => console.log("Server running"));
import "./dao/factory.js";
