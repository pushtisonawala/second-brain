import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();

const JWT_PASSWORD = process.env.JWT_PASSWORD;
if (!JWT_PASSWORD) {
  throw new Error("JWT_PASSWORD is not set in environment variables.");
}


function mid(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_PASSWORD!) as jwt.JwtPayload;

    // @ts-ignore
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({
      error: "Invalid token",
      details: (err as Error).message
    });
  }
}

export { mid };
