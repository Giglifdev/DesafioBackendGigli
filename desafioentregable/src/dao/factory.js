import mongoose from "mongoose";
import configs from "../config.js";

try {
  await mongoose.connect(configs.mongoUrl);
  console.log("BDD connected");
} catch (error) {
  console.log(error);
}
