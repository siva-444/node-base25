import * as ErrorClass from "./classes.js";

import type { ErrorRequestHandler } from "express";

const requestErrorHandler: ErrorRequestHandler = (
  error,
  request,
  response,
  _,
) => {
  console.log("Exception Handled", error);

  if (error instanceof ErrorClass.BadRequestError) {
    //Handle 400
    return response.sendBadHeaderResponse("Token Expired", error.headers);
  } else if (error instanceof ErrorClass.UnauthorizedError) {
    //Handle 401
    return response.sendUnauthorizeResponse("Token Expired");
  } else if (
    error instanceof Error &&
    "code" in error &&
    error.code === "permission_denied"
  ) {
    //Handle 403
    return response.sendForbiddenResponse("Access denied");
  } else if (error instanceof ErrorClass.NotFoundError) {
    //Handle 404
    return response.sendNotFoundResponse(error.message);
  } else if (error instanceof ErrorClass.UnHandledError) {
    //Handle 417
    const { message, name, status, stack } = error;
    return response.sendExpectationFailed(message, {
      message,
      name,
      status,
      stack,
    });
  } else if (error instanceof ErrorClass.ValidationError) {
    //Handle 422
    return response.sendValidationFailureResponse(error.message, error.errors);
  } else {
    //Handle 500
    return response.sendServerErrorResponse(
      "Unknown Exception",
      error as Record<string, string>,
    );
  }
};

export default requestErrorHandler;
