import express from "express";
import loadApplication from "@config/db.js";
import responseHandler from "@helpers/response-handler.js";
import requestHandler from "@helpers/error/handler.js";
import * as ErrorClasses from "@helpers/error/classes.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

/** Register Global response handlers */
app.use(responseHandler);

loadApplication(app);
// catch 404 and forward to error handler
app.use((request, _, next) => {
  next(new ErrorClasses.NotFoundError(request.originalUrl));
});

/**
 * All Errors are landed here
 * Ex:
 * next(new ErrorClasses.ValidationError())
 */
app.use(requestHandler);

export default app;
