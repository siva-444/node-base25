export const LOCAL_API_DOMAIN = "localhost:3000";
export const API_BASE_URL = `http://${LOCAL_API_DOMAIN}`;
export const API_URL = `${API_BASE_URL}`;
export const API_PATHS = Object.freeze({
  USER_LOGIN: "/user/login",
});

export const LOCALE = "en-US";

export const STATUS_CODES = {
  /**
   *
   * The request has succeeded. The meaning of a success varies depending on the HTTP method:
   * GET: The resource has been fetched and is transmitted in the message body.
   * HEAD: The entity headers are in the message body.
   * POST: The resource describing the result of the action is transmitted in the message body.
   * TRACE: The message body contains the request message as received by the server
   */
  OK: 200,

  /**
   *
   * Commonly used as the response to a POST request that creates a resource.
   */
  CREATED: 201,

  /**
   *
   * There is no content to send for this request,
   *  but the headers may be useful. The user-agent may update its cached headers for this resource with the new ones.
   */
  NO_CONTENT: 204,

  /**
   *
   * This response means that server could not understand the request due to invalid syntax.
   */
  BAD_REQUEST: 400,

  /**
   *
   * Although the HTTP standard specifies "unauthorized",
   *  semantically this response means "unauthenticated". That is,
   *  the client must authenticate itself to get the requested response.
   */
  UNAUTHORIZED: 401,

  /**
   *
   * Client is authenticated but does not have permission to access the requested resource.
   */
  FORBIDDEN: 403,

  /**
   *
   * The server can not find requested resource. In the browser,
   *  this means the URL is not recognized. In an API,
   *  this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 to hide the existence of a resource from an unauthorized client. This response code is probably the most famous one due to its frequent occurrence on the web.
   */
  NOT_FOUND: 404,

  /**
   *
   * // Rarely used; indicates server cannot meet the requirements of the Expect header.
   */
  EXPECTATION_FAILED: 417,

  /**
   *
   * The user has sent too many requests in a given amount of time ("rate limiting").
   */
  TOO_MANY_REQUESTS: 429,

  /**
   *
   * The server encountered an unexpected condition that prevented it from fulfilling the request.
   */
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type StatusCodeType = typeof STATUS_CODES;
export type StatusCodeKeys = (typeof STATUS_CODES)[keyof typeof STATUS_CODES]; // StatusCode => 200 | 201 | 204 | ...
export type StatusCodeTextKeys = keyof typeof STATUS_CODES; // "OK" | "CREATED" | ...
