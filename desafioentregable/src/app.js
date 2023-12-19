import path from "node:path";
import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import { __dirname } from "./utils.js";
import configs from "./config.js";

import { config } from "dotenv";
config();

// routes
import SessionsRouter from "./routes/sessions.routes.js";
import ProductsRouter from "./routes/products.routes.js";
import CartsRouter from "./routes/carts.routes.js";
import ViewsRouter from "./routes/views.routes.js";

// message manager
import MessageManager from "./dao/dbManagers/messages.manager.js";
import { initializePassport } from "./config/passport.config.js";
import passport from "passport";

const app = express();
const PORT = configs.port;

// db

try {
  await mongoose.connect(configs.mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Database connected");
} catch (error) {
  console.log(error.message);
  mongoose.disconnect();
}

//engine config
app.engine(".handlebars", handlebars.engine({ extname: ".handlebars" }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", ".handlebars");

// middlewares config
app.disable("X-Powered-By");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: configs.mongoUrl,
      ttl: 3600,
    }),
    secret: "Coder55575secret",
    resave: true,
    saveUninitialized: true,
  })
);

// passport config
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/api/products", ProductsRouter);
app.use("/api/carts", CartsRouter);
app.use("/api/sessions", SessionsRouter);
app.use("/", ViewsRouter);

app.use((req, res) => {
  res.status(404).send({ status: "error", message: "404 not found" });
});

// sv
const server = app.listen(PORT, () => {
  console.log(`Server is ready on http://localhost:${PORT}`);
});

const socketServer = new Server(server);

socketServer.on("connection", (socket) => {
  const messagesManager = new MessageManager();
  console.log("Connected Client");

  socket.on("message", async (data) => {
    try {
      const result = await messagesManager.create(data);
      const messages = await messagesManager.getAll();
      socketServer.emit("messageLogs", messages);
    } catch (error) {
      console.error({ error: error.message });
    }
  });

  socket.on("authenticated", async (data) => {
    const messages = await messagesManager.getAll();
    socket.emit("messageLogs", messages);
    socket.broadcast.emit("newUserConnected", data);
  });
});
console.log("Configs:", configs);
app.set("socketio", socketServer);
