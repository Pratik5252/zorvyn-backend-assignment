import jwt, { SignOptions } from 'jsonwebtoken';
import { JwtPayload } from '../types';
import { JWTConfig } from '../config';


export const generateAccessToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, JWTConfig.accessTokenSecret!, {expiresIn: JWTConfig.accessTokenExpiry} as SignOptions);
}

export const generateRefreshToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, JWTConfig.refreshTokenSecret!, {expiresIn: JWTConfig.refreshTokenExpiry} as SignOptions);
}

export const verifyAccessToken = (token: string): JwtPayload => {
    return jwt.verify(token, JWTConfig.accessTokenSecret!) as JwtPayload;
}

export const verifyRefreshToken = (token: string): JwtPayload => {
    return jwt.verify(token, JWTConfig.refreshTokenSecret!) as JwtPayload;
}
