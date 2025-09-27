import routes from "@routes/index.js";
import logger from "@src/config/logger.js";
import { checkDBConnection } from "@config/db.js";

import type { Express } from "express";

export default (app: Express) => {
  //register the all routes
  routes(app);

  //register the app logging service
  // logger(app);

  //check mysql Connection
  checkDBConnection();
};
