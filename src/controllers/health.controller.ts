import type { Request, Response } from "express";

export const healthCheck = (_req: Request, res: Response) => {
	res.status(200).json({
		status: "ok",
		node: process.version,
		timestamp: new Date().toISOString()
	});
};
