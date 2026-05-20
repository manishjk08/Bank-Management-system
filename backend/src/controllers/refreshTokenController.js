import jwt from 'jsonwebtoken';
import refreshTokenModel from '../models/RefreshTokenModel.js';
import userModel from '../models/userModels.js';
import { verifyRefreshToken } from '../utils/GenerateToken.js';
import { generateAccessToken } from '../utils/GenerateToken.js';


const accessRefreshToken=async (req,res)=>{
   
try {
    
    const refreshToken=req.cookies.refreshToken
    if(!refreshToken){
        return res.status(401).json({error:'Refresh token missing'})
    }
    
    const decoded= verifyRefreshToken(refreshToken)
    const storedToken=await refreshTokenModel.findByToken(refreshToken)
    if(!storedToken){
        return res.status(401).json({error:"Invalid refresh token"})
    }
   
    const user = await userModel.findById(decoded.id);
    if(!user){
        return res.status(401).json({error: "User not found"});
    }

    const accessToken= generateAccessToken(
        {
            id:user.id,
            email:user.email,
            role:user.role
        }
    )
    res.json({accessToken:accessToken})
} catch (error) {
    return res.status(401).json({error:'Invalid refresh token'})
}
}
export default accessRefreshToken;