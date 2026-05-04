import pool from  '../config/db.js';

const auditModel={
 
    log:async(user_id,action,entity_type,entity_id,meta=null,client=pool)=>{
        await client.query(
            `INSERT into audit_log(user_id,action,entity_type,entity_id,meta)
            Values($1,$2,$3,$4,$5)`,
            [user_id,action,entity_type,entity_id,meta?JSON.stringify(meta):null] 
        )
    },

    getAll:async()=>{
        const result= await pool.query(
            `SELECT al.id,al.action,al.entity_type,al.entity_id,
            al.meta,al.created_at,u.full_name,u.email
            from audit_log al
            left join users u on u.id=al.user_id
             ORDER by al.created_at DESC limit 200`
        )
        return result.rows
    }
}
export default auditModel;