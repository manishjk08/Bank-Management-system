import crypto from "crypto";
import bcrypt from "bcrypt";
import pool from "../config/db.js";
import resetPasswordModel from "../models/resetPasswordModel.js";

const resetPassword=async(req,res)=>{
            

    try {
        
        const{token}=req.params;
        const{password}=req.body;
           
        const hashedToken=crypto.createHash('sha256').update(token).digest('hex')
        const user = await resetPasswordModel.findByResetToken(hashedToken);
        if(!user){
            return res.status(400).json({message:'Invalid or expired token'})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await resetPasswordModel.updatePasswordAndClearToken(user.id, hashedPassword);
        return res.status(200).json({message:'Password reset successful'})

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Server error"
        })
    }
}
export  {resetPassword};