import type {
  BadRequestResponse,
  ResponseTypesWith,
  SuccessResponse,
} from "./types";

export const isNullableResponse = <T>(res: ResponseTypesWith<T>): res is null =>
  res === null || res === undefined;

export const isBadRequestResponse = <T extends object>(
  res: ResponseTypesWith<T>,
): res is BadRequestResponse =>
  !isNullableResponse<T>(res) && typeof res === "object" && "errors" in res;

// export const isValidationResponse = <T extends object>(
//   res: ResponseTypesWith<T>,
// ): res is ValidationResponse =>
//   !isNullableResponse<T>(res) && typeof res === "object" && "errors" in res;

export const isSuccessResponse = <T extends object>(
  res: ResponseTypesWith<T>,
): res is SuccessResponse<T> => {
  return (
    !isBadRequestResponse<T>(res) &&
    !isNullableResponse<T>(res) &&
    typeof res === "object" &&
    "records" in res
  );
};
