import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../utils/jwt";
const deserialiedToken = (req: Request, res: Response, next: NextFunction) => {
  const accesToken = req.headers.authorization?.split(" ")[1];
  if (!accesToken) {
    return next();
  }

  const token = verifyJWT(accesToken);

  if (token.decoded) {
    res.locals.user = token.decoded;
    console.log("token decoded");
    return next();
  }

  if (!token.decoded) {
    return next();
  }

  if (token.expired) {
    return next();
  }
};

export default deserialiedToken;
