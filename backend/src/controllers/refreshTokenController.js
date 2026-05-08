import jwt, { decode } from 'jsonwebtoken';
import refreshTokenModel from '../models/RefreshTokenModel.js';
import { verifyRefreshToken } from '../utils/GenerateToken.js';
import { generateAccessToken } from '../utils/GenerateToken.js';


const accessRefreshToken=async (req,res)=>{
try {
    const refreshToken=req.cookies.refreshToken
    if(!refreshToken){
        return res.status(401).json({error:'Refresh token missing'})
    }
    const storedToken=await refreshTokenModel.findByToken(refreshToken)
    if(!storedToken){
        return res.status(401).json({error:"Invalid refresh token"})
    }
    const decoded=await verifyRefreshToken(refreshToken)
    const accessToken= await generateAccessToken(
        {
            id:decoded.id,
            email:decoded.email,
            role:decoded.role
        }
    )
    res.json({accessToken:accessToken})
} catch (error) {
    return res.status(401).json({error:'Invalid refresh token'})
}
}
export default accessRefreshToken;