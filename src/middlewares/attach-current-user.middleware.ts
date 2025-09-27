import type { NextFunction, Request, Response } from "express";
/**
 * Attach user to req.currentUser
 * @param {Request} req Express req Object
 * @param {Response} res  Express res Object
 * @param {NextFunction} next  Express next Function
 */
const attachCurrentUser = (
  request: Request,
  _: Response,
  next: NextFunction,
) => {
  try {
    const { user_id } = request.tokenPayload;

    request.currentUser = { user_id };
    return next();
  } catch (error) {
    console.error("Error attaching currentUser to request: %o", error);
    return next(error);
  }
};

export { attachCurrentUser };
