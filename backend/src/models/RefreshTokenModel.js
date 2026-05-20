import pool from "../config/db.js";


const refreshTokenModel={
    storeToken:async(user_id,token,expires_at)=>{
        const result =await pool.query(
            `INSERT into refresh_tokens (user_id,token,expires_at) Values ($1,$2,$3) Returning *`,
            [user_id,token,expires_at]
        )
        return result.rows[0];
    },
    findByToken:async(token)=>{
        const result =await pool.query(
            `Select * from refresh_tokens where token=$1 and revoked=false`,
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
   
}
export default refreshTokenModel;