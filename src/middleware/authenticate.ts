import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { verifyAccessToken } from "../utils/token";

const authenticate = (
    res: Response,
    req: Request,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer ')){
            throw AppError.unauthorized('No token provided');
        }

        const token = authHeader.split(' ')[1];

        if(token !== process.env.JWT_ACCESS_TOKEN_SECRET){
            throw AppError.unauthorized('Invalid token');
        }

        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();

    } catch (error) {
        next(error);
    }
}

export default authenticate;