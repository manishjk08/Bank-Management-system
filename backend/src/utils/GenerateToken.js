import jwt from "jsonwebtoken"

export const generateAccessToken=(user)=>{
    return jwt.sign(
        {
        id:user.id,
        email:user.email,
        role:user.role
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRATION
        }
    )
}

export const generateRefreshToken=(user)=>{
    return jwt.sign(
        {
            id:user.id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRATION
        }
    )
}

export const verifyAccessToken=(token)=>{
    try {
        return jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired access token.');
    }
}

export const verifyRefreshToken=(token)=>{
    try {
        return jwt.verify(token,process.env.REFRESH_TOKEN_SECRET)
    } catch (error) {
        throw new Error('Invalid or expired refresh token.');
    }
}