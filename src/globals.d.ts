import type { ResponseDataType } from "@utils/response-handler";
import type { StatusCodeKeys } from "@utils/constants";
import type { NextFunction, Request } from "express";
import "jsonwebtoken";

declare module "jsonwebtoken" {
  // Replace/extend JwtPayload with your own
  export interface JwtPayload {
    user_id: number;
    role: "admin" | "teacher" | "student";
  }
}

interface TokenPayload {
  user_id: number;
  role: "admin" | "teacher" | "student";
}
declare module "express-serve-static-core" {
  interface Request {
    currentUser: {
      user_id: number;
    };
    tokenPayload: {
      user_id: number;
      role: "admin" | "teacher" | "student";
    };
  }
  interface Response {
    respond: (
      messageCode?: string | null,
      data?: Record<string, unknown> | null,
      status?: StatusCodeKeys,
    ) => void;
    sendSuccessResponse: (
      messageCode?: string,
      records?: unknown,
      appendData?: unknown,
    ) => void;
    sendResponseWithPagination: (
      messageCode?: string,
      records?: unknown,
      meta?: unknown,
      appendData?: unknown,
    ) => void;
    sendContentCreatedResponse: (
      messageCode?: string,
      records?: unknown,
    ) => void;
    sendNoContentResponse: (messageCode?: string) => void;
    sendUnknownFieldResponse: (
      messageCode?: string,
      unknown_fields?: unknown,
    ) => void;
    sendBadHeaderResponse: (
      messageCode?: string,
      missedHeaders?: unknown,
    ) => void;
    sendUnauthorizeResponse: (messageCode?: string) => void;
    sendForbiddenResponse: (messageCode?: string) => void;
    sendNotFoundResponse: (messageCode?: string) => void;
    sendValidationFailureResponse: (
      messageCode?: string,
      errors?: unknown,
    ) => void;
    sendRateLimitExceedResponse: (messageCode?: string) => void;
    sendExpectationFailed: (messageCode?: string, exception?: unknown) => void;
    sendServerErrorResponse: (
      messageCode?: string,
      exception?: unknown,
    ) => void;
  }
}
