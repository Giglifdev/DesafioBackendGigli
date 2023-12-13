import { config } from "dotenv";
import { Command } from "commander";
import { __dirname } from "./utils.js";

const program = new Command();
program.option("--mode <mode>", "development environment variable", "DEV");
program.parse();

// development = DEV
// production = PROD
const environment = program.opts().mode;

config({
  path: environment === "DEV" ? `./.env.development` : `./.env.production`,
});

const configs = {
  port: process.env.PORT || 8090,
  mongoUrl: process.env.MONGO_URL,
};
export default configs;
