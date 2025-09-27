import morgan from "morgan";
import type { Express } from "express";
import fs from "fs";

export default (app: Express) => {
  // create a write stream (in append mode)
  const accessLogStream = fs.createWriteStream("./src/logs/access.log", {
    flags: "a",
  });

  // setup the logger
  app.use(morgan("combined", { stream: accessLogStream }));
};