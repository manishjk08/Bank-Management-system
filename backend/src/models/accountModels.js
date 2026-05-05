import pool from '../config/db.js'

const accountModel = {

    findByUserID: async (user_id) => {
        const result = await pool.query(
            `SELECT id,account_number,account_type,balance, currency,created_at FROM accounts WHERE user_id=$1`,
            [user_id]
        );
        return result.rows;
    },
    findByIdAndUserId: async (id, user_id) => {
        const result = await pool.query(
            `SELECT id,user_id from accounts where id=$1 AND user_id=$2`,
            [id, user_id]
        );
        return result.rows[0];
    },
    findByAccountNumber: async (account_number, client = pool) => {
        const result = await client.query(
            `Select * from accounts where account_number=$1 for update`,
            [account_number]
        )
        return result.rows[0];
    },

    findByIdAndUserIdForUpdate: async (id, user_id, client = pool) => {
        const result = await client.query(
            `Select * from accounts where id=$1 and user_id=$2 for update`,
            [id, user_id]
        )
        return result.rows[0];
    },

    findByIdforUpdate: async (id, client = pool) => {
        const result = await client.query(
            `SELECT * from accounts where id=$1 for update`,
            [id]
        )
        return result.rows[0];
    },
    createDefaultAccount: async (user_id, account_number) => {
        const result = await pool.query(
            `INSERT INTO accounts(user_id,account_number,account_type,balance)
            VALUES ($1,$2,'savings',1000.00) RETURNING *`,
            [user_id, account_number]
        )
        return result.rows[0];
    },
    requestNewAccount: async (user_id, account_type, status = 'pending') => {
        const result = await pool.query(
            `INSERT into account_request(user_id,account_type,status) VALUES($1,$2,$3) RETURNING *`,
            [user_id, account_type, status || 'pending']
        )
        return result.rows[0];
    },
    getRequestByIdForUpdate: async (request_id, client) => {
        const result = await client.query(
            `SELECT * FROM account_request WHERE id=$1 FOR UPDATE`,
            [request_id]
        );

        return result.rows[0]; 
    },
    updateRequestStatus: async (request_id, status, client) => {
        const result = await client.query(
            `UPDATE account_request SET status=$1 WHERE id=$2 RETURNING *`,
            [status, request_id]
        );
        return result.rows[0];
    },
    createAccount: async ({ user_id, account_number, accountType, client }) => {
        const result = await pool.query(
            `INSERT INTO accounts (user_id, account_number, account_type)
     VALUES ($1, $2, $3)
     RETURNING *`,
            [user_id, account_number, accountType]

        );
        return result.rows[0];
    },

    getAll: async () => {
        const result = await pool.query(
            `Select a.id,a.account_number,a.account_type,
            a.balance,a.currency,a.created_at,u.full_name,
            u.email from accounts a join users u on a.user_id=u.id
            order by a.created_at desc`
        )
        return result.rows
    },
    deductBalance: async (id, amount, client = pool) => {
        const result = await client.query(
            `Update accounts set balance = balance -$1 where id=$2 AND balance>=$1 returning *`,
            [amount, id]
        )
        return result.rows[0];
    },
    addBalance: async (id, amount, client = pool) => {
        const result = await client.query(
            `update accounts set balance=balance+$1 where id=$2  returning *`,
            [amount, id]
        )
        return result.rows[0];
    }
}
export default accountModel;