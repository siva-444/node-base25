import type { StatusCodeType } from "@services/constants";

/***************** API Types & Interface *****************/
export type GlobalHeaderKeys = "Authorization";
export type DataCustomizedCodes =
  | StatusCodeType["OK"]
  | StatusCodeType["CREATED"];
export type DataHeadersCodes = StatusCodeType["BAD_REQUEST"];
export type DataErrorsCodes = StatusCodeType["BAD_REQUEST"];
export type DataNullableCodes =
  | StatusCodeType["NO_CONTENT"]
  | StatusCodeType["UNAUTHORIZED"]
  | StatusCodeType["FORBIDDEN"]
  | StatusCodeType["NOT_FOUND"]
  | StatusCodeType["INTERNAL_SERVER_ERROR"];

//Basic Responses
export interface ValidationErrorProps {
  name: string;
}
export interface ValidationResponse {
  errors: Record<string, string>;
}
export interface SuccessResponse<T> {
  records: T;
}
export type BadRequestResponse = ValidationResponse;

//Modules Responses
export type ResponseTypes = BadRequestResponse | ValidationResponse | null;
export type ResponseTypesWith<T> = ResponseTypes | SuccessResponse<T>;

export interface ApiResponse<T = null> {
  data?: T;
  message: string;
}
