import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { verifyAccessToken } from "../utils/token";

const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer ')){
            throw AppError.unauthorized('No token provided');
        }

        const token = authHeader.split(' ')[1];

        if(token === 'undefined' || !token){
            throw AppError.unauthorized('Invalid token provided');
        }

        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();

    } catch (error) {
        if (error instanceof AppError) {
            return next(error);
        }else {
            return next(AppError.unauthorized('Invalid token', 'INVALID_TOKEN'));
        }
    }
}

export default authenticate;