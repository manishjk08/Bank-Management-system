import pool from "../config/db.js";


const refreshTokenModel={
    storeToken:async(user_id,token,expires_at,revoked)=>{
        const result =await pool.query(
            `INSERT into refresh_tokens (user_id,token,expires_at,revoked) Values ($1,$2,$3,$4) Returning *`,
            [user_id,token,expires_at,revoked]
        )
        return result.rows[0];
    },
    findByToken:async(token)=>{
        const result =await pool.query(
            `Select * from refresh_tokens where token=$1 and revoked=false and expires_at>Now()`,
            [token]
        )
        return result.rows[0];
    },
    revokeToken:async(token)=>{
        const result=await pool.query(
            `Update refresh_tokens set revoked=true where token=$1 RETURNING *`,
            [token]
        )
        return result.rows[0];
    },
    revokeTokenByUser:async(user_id)=>{
        await pool.query(
            `UPDATE refresh_tokens set revoked=true where user_id=$1`,
            [user_id]
        )
    }
}
export default refreshTokenModel;