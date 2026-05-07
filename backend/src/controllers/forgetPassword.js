import crypto from "crypto";
import pool from "../config/db.js";
import sendEmail from "../utils/sendEmail.js";
import resetPasswordModel from "../models/resetPasswordModel.js";
import userModel from "../models/userModels.js";

const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body

        const user = await userModel.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'If user exists then token will be sent to email' })
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')
        const expires = new Date(Date.now() + 3600000)
        const result = await resetPasswordModel.createResetToken(user.id, hashedToken, expires);
        const resetUrl = `http://localhost:5173/login/${resetToken}`;
        const message = `You requested a password reset. Please click the following link to reset your password: ${resetUrl}. 
   This link will expire in 1 hour.`

        await sendEmail({
            to: user.email,
            subject: "Password reset request",
            text: message
        })
        res.status(200).json({ 
      message: ' A reset link has been sent to you email.' 
    });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Server error and error in sending email"
        })
    }
}
export { forgetPassword };