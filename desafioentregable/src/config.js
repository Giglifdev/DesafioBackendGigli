import { config } from "dotenv";
import { Command } from "commander";
import { __dirname } from "./utils.js";
import { join } from "node:path";

const program = new Command();
program.option("--mode <mode>", "development environment variable", "DEV");
program.parse();

// development = DEV
// production = PROD
const environment = program.opts().mode;

config({ path: "../.env" });

const configs = {
  port: process.env.PORT || 8090,
  mongoUrl: process.env.MONGO_URL,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  githubCallbackUrl: process.env.GITHUB_CALLBACK_URL,
};

export default configs;
