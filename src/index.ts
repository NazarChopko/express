import dotenv from "dotenv";
dotenv.config();
import express from "express";

import config from "config";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { createStream } from "rotating-file-stream";
import rootRouter from "./router";
import path from "path";

import { type Config } from "types/config";
import { fileDateGenerator } from "./helpers";
import errorMiddleware from "./middlewares/error-middleware";

const appConfig: Config = config.get("app");

const server = express();
const morganLogFormat = ":date :method :url :status";
const morganConsoleLogger = morgan(morganLogFormat);

const accessLogStream = createStream(fileDateGenerator, {
  interval: "1d",
  path: path.join(__dirname, "logs"),
});

server.use(cors({ origin: appConfig.clientUrl, credentials: true }));
server.use(express.json());
server.use(cookieParser());
server.use(express.static("./static/files"));
server.use("/api", rootRouter);
server.use(morganConsoleLogger);

server.use(morgan(morganLogFormat, { stream: accessLogStream }));

server.use(errorMiddleware);

server.listen(appConfig.port, () => {
  console.log(`server has started at ${appConfig.port} PORT`);
});
