import pool from '../config/db.js';

const userModel = {
    findByEmail: async (email) => {
        const result = await pool.query('SELECT * from users where email =$1', [email]);
        return result.rows[0]
    },

    findById: async (id) => {
        const result = await pool.query(
            `SELECT id, full_name, email, role, is_active, created_at
        FROM users
        WHERE id = $1`,
            [id]
        );
        return result.rows[0];
    },

    createUser: async (full_name, email, password_hash, role) => {
        const result = await pool.query("INSERT INTO users(full_name,email,password_hash,role) VALUES($1,$2,$3,$4) RETURNING *",
            [full_name, email, password_hash, role || 'customer']
        )
        return result.rows[0]

    },
   
    getAll: async () => {
        return await pool.query(
            `SELECT id, full_name, email, role, is_active, created_at
             FROM users
             ORDER BY created_at DESC`
        );
    }
}
    


export default userModel;