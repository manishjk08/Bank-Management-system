import pool from '../config/db.js';

const transactionModel ={
    findUserById: async(user_id)=>{
        const result =await pool.query(
            `SELECT t.id,t.amount,t.currency,
            t.transaction_type,t.status,t.description,
            t.created_at,
            fa.account_number AS From_account,
            ta.account_number as To_account 
            from transactions t
            left join accounts fa on t.from_account_id=fa.id
            left join accounts ta on t.to_account_id=ta.id
            where fa.user_id=$1 or ta.user_id=$1
            order by t.created_at desc`,
            [user_id]
        )
        return result.rows;
    },
    create:async(from_account_id,to_account_id, amount, currency,transaction_type,status,description, client = pool)=>{
       const result= await client.query(
            `Insert into transactions(from_account_id,to_account_id, amount, currency, transaction_type, status, description)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        Returning * `,
        [from_account_id,to_account_id, amount, currency, transaction_type, status, description]
        )
        return result.rows[0];
    },
    createDeposit:async(to_account_id, amount,currency,description,client=pool)=>{
        const result= await client.query(
            `INSERT into transactions(to_account_id,amount,currency,transaction_type,status,description) values ($1,$2,$3,'deposit','completed',$4) 
            returning *`,
            [to_account_id, amount, currency, description || 'Admin deposit']
        );
        return result.rows[0];
    },
    getAll:async()=>{
        const result= await pool.query(
            `select t.id,t.amount,t.transaction_type,
            t.status,t.description,t.created_at,
            fa.account_number as From_account,
            ta.account_number as To_account,
            fu.full_name As from_user,
            tu.full_name As to_user 
            from transactions t left join accounts fa
            on t.from_account_id=fa.id
            left join accounts ta on t.to_account_id=ta.id
            left join users fu on fu.id=fa.user_id
            left join users tu on tu.id=ta.user_id
            order by t.created_at desc`
        )
        return result.rows;
    }
}
export default transactionModel;