
export const JWTConfig = {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    accessTokenExpiry: "15m",
    refreshTokenExpiry: "7d",
}

export const BcryptConfig = {
    saltRounds: 10,
}