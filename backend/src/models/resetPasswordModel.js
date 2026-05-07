import pool from "../config/db.js";

const resetPasswordModel={
    createResetToken:async(user_id, reset_password_token ,reset_password_expires)=>{
        const result =await pool.query(
            `Update users set reset_password_token = $1, reset_password_expires = $2 where id=$3 RETURNING *`,
            [reset_password_token, reset_password_expires, user_id]
        )
        return result.rows[0];
    },
    findByResetToken:async(hashedToken)=>{
        const result=await pool.query(
            `SELECT * from users where reset_password_token=$1 and reset_password_expires > NOW()`,
            [hashedToken]
        )
        return result.rows[0];
    },
    updatePasswordAndClearToken:async(id,hashedPassword)=>{
        const result =await pool.query(
            `Update users set password_hash=$1 , reset_password_token=NULL,reset_password_expires=NULL where id=$2 RETURNING *`,
            [hashedPassword,  id]
        )
        return result.rows[0];
    }
}
export default resetPasswordModel;
